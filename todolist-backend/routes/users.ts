import mysql from 'mysql2';
import { Request, Response } from 'express';
import Router from 'express-promise-router';
import database from '../dbManager';
import logger from '../logger';
import { authMiddleware } from '../middleware';
import { hashPassword, verifyPassword, generateToken } from '../auth';

const router = Router();

const {db, hashTypes, caching} = database;

const createUserTable: string = `
  CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255)
  )
`;

const createTaskTable: string = `
  CREATE TABLE IF NOT EXISTS tasks(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(255),
    description TEXT,
    status ENUM('Completed', 'In Progress', 'Pending') DEFAULT 'Pending' NOT NULL
  )
`;

const refreshCache = (userId: string) => {
  const getTasks = 'SELECT * FROM tasks WHERE user_id = ?';
  return db.query(mysql.format(getTasks, [userId]), {hash: "getTasks" + userId, caching: caching.REFRESH})
    .catch(error => {
      logger.error(error);
      throw new Error('Something went wrong');
    });
};

db.query(createUserTable, {caching: caching.SKIP}, function (err, res) {
  if (err) throw err;
  if(res.warningCount !== 0)
    logger.debug("User table already exists");
  else
  logger.debug("Created new user table");
});

db.query(createTaskTable, {caching: caching.SKIP}, function (err, res) {
  if (err) throw err;
  if(res.warningCount !== 0)
    logger.debug("Task table already exists");
  else
  logger.debug("Created new task table");
});

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string, password: string };
  if (!username || !password) {
    return (res.status as any)(400).send('Username and password are required');
  }

  const userExistsQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(mysql.format(userExistsQuery, [username]), {caching: caching.SKIP})
    .then(async users => {
      if (users[0].length > 0) {
        return (res.status as any)(400).send('User already exists');
      }

      const hashedPassword = await hashPassword(password);
      const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
      return db.query(mysql.format(insertUserQuery, [username, hashedPassword]), {caching: caching.SKIP});
    })
    .then(response => {
      const token = generateToken(response[0].insertId);
      (res.status as any)(201).send({ token });
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});


// User login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string, password: string };
  if (!username || !password) {
    return (res.status as any)(400).send('Username and password are required');
  }

  const getUserQuery = 'SELECT * FROM users WHERE username = ?';

  db.query(mysql.format(getUserQuery, [username]), {caching: caching.SKIP})
    .then(async (response: any) => {
      if (response[0].length === 0) {
        return (res.status as any)(401).send('Invalid username or password');
      }

      const user = response[0][0];
      const passwordMatches = await verifyPassword(password, user.password);

      if (!passwordMatches) {
        return (res.status as any)(401).send('Invalid username or password');
      }

      const token = generateToken(user.id);

      res.send({ token });
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.params.id;

  const getUserQuery = 'SELECT * FROM users WHERE id = ?';

  db.query(mysql.format(getUserQuery, [userId]), {caching: caching.SKIP})
    .then(response => {
      (res.status as any)(200).send(response[0]);
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});

// Update user
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { username, password } = req.body as { username?: string, password?: string };

  if (!username && !password) {
    return (res.status as any)(400).send('Username or password should be provided');
  }

  let updateUserQuery = 'UPDATE users SET ';
  let params = [];

  if (username) {
    updateUserQuery += 'username = ?, ';
    params.push(username);
  }

  if (password) {
    const hashedPassword = await hashPassword(password);
    updateUserQuery += 'password = ?, ';
    params.push(hashedPassword);
  }

  updateUserQuery = updateUserQuery.slice(0, -2); // Remove trailing comma and space
  updateUserQuery += ' WHERE id = ?';
  params.push(userId);

  db.query(mysql.format(updateUserQuery, params), {caching: caching.SKIP})
    .then(() => {
      refreshCache(userId);
      (res.status as any)(204).end();
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});

// Delete user
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.params.id;

  const deleteUserQuery = 'DELETE FROM users WHERE id = ?';

  db.query(mysql.format(deleteUserQuery, [userId]), {caching: caching.SKIP})
    .then(() => {
      (res.status as any)(204).end();
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});

// Create Task
router.post('/:id/tasks', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { title, description, status } = req.body as { title: string, description: string, status: string };

  const insertTaskQuery = 'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)';

  db.query(mysql.format(insertTaskQuery, [userId, title, description, status]), {caching: caching.SKIP})
    .then(response => {
      refreshCache(userId);
      (res.status as any)(201).send(response[0]);
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});

// Get All Tasks
router.get('/:id/tasks', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.params.id;

  const getTasksQuery = 'SELECT * FROM tasks WHERE user_id = ?';

  db.query(mysql.format(getTasksQuery, [userId]), {hash: "getTasks" + userId})
    .then(response => {
      (res.status as any)(200).send(response[0]);
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});

// Get Specific Task
router.get('/:id/tasks/:taskId', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.params.id;
  const taskId = req.params.taskId;

  const getTaskQuery = 'SELECT * FROM tasks WHERE id = ? AND user_id = ?';

  db.query(mysql.format(getTaskQuery, [taskId, userId]), {caching: caching.SKIP})
    .then(response => {
      (res.status as any)(200).send(response[0]);
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});

// Update Task
router.put('/:id/tasks/:taskId', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.params.id;
  const taskId = req.params.taskId;
  const { title, description, status } = req.body as { title?: string, description?: string, status?: string };

  let updateTaskQuery = 'UPDATE tasks SET ';
  let params = [];

  if (title) {
    updateTaskQuery += 'title = ?, ';
    params.push(title);
  }

  if (description) {
    updateTaskQuery += 'description = ?, ';
    params.push(description);
  }

  if (status) {
    updateTaskQuery += 'status = ?, ';
    params.push(status);
  }

  updateTaskQuery = updateTaskQuery.slice(0, -2); // Remove trailing comma and space
  updateTaskQuery += ' WHERE id = ? AND user_id = ?';
  params.push(taskId, userId);

  db.query(mysql.format(updateTaskQuery, params), {caching: caching.SKIP})
    .then(() => {
      refreshCache(userId);
      (res.status as any)(204).end();
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});

// Delete Task
router.delete('/:id/tasks/:taskId', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.params.id;
  const taskId = req.params.taskId;

  const deleteTaskQuery = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';

  db.query(mysql.format(deleteTaskQuery, [taskId, userId]), {caching: caching.SKIP})
    .then(() => {
      refreshCache(userId);
      (res.status as any)(204).end();
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});

// Get User's Username
router.get('/:id/username', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.params.id;
  
  const getUsernameQuery = 'SELECT username FROM users WHERE id = ?';
  
  db.query(mysql.format(getUsernameQuery, [userId]), {caching: caching.SKIP})
    .then(response => {
      (res.status as any)(200).send(response[0]);
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});

module.exports = router;
