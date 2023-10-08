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

const createSessionTable: string = `
  CREATE TABLE IF NOT EXISTS tasks(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(255),
    description TEXT
  )
`;

db.query(createUserTable, {caching: caching.SKIP}, function (err, res) {
  if (err) throw err;
  if(res.warningCount !== 0)
    logger.debug("User table already exists");
  else
  logger.debug("Created new user table");
});

db.query(createSessionTable, {caching: caching.SKIP}, function (err, res) {
  if (err) throw err;
  if(res.warningCount !== 0)
    logger.debug("Session table already exists");
  else
  logger.debug("Created new session table");
});

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

// User registration
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string, password: string };
  if (!username || !password) {
    return (res.status as any)(400).send('Username and password are required');
  }

  const hashedPassword = await hashPassword(password);
  const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
  
  db.query(mysql.format(insertUserQuery, [username, hashedPassword]), {hash: "insertUser" + username})
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

  db.query(mysql.format(getUserQuery, [username]), {hash: "getUser" + username})
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

// Create user
router.post('/', async (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string, password: string };
  if (!username || !password) {
    return (res.status as any)(400).send('Username and password are required');
  }

  const hashedPassword = await hashPassword(password);
  const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
  
  db.query(mysql.format(insertUserQuery, [username, hashedPassword]), {hash: "insertUser" + username})
    .then(response => {
      const token = generateToken(response[0].insertId);
      (res.status as any)(201).send({ token });
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});

// Read user
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.params.id;
  
  const getUserQuery = 'SELECT * FROM users WHERE id = ?';
  
  db.query(mysql.format(getUserQuery, [userId]), {hash: "getUser" + userId})
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

  db.query(mysql.format(updateUserQuery, params), {hash: "updateUser" + userId})
    .then(() => {
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
  
  db.query(mysql.format(deleteUserQuery, [userId]), {hash: "deleteUser" + userId})
    .then(() => {
      (res.status as any)(204).end();
    })
    .catch(error => {
      logger.error(error);
      (res.status as any)(500).send('Something went wrong');
    });
});

module.exports = router;
