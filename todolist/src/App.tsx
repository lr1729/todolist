import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Modal from './components/Modal';
import { User } from './types';
import { login, register, getUserTasks, getUserDetails, isAuthenticated, getUserId, logout, createTask} from './api';
import './App.css';

const App: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isUserDataFetched, setIsUserDataFetched] = useState(false);

  const handleLogout = () => {
    logout();
    setUser(null);
    setTasks([]);
  };

  const handleAddTask = async (title: string, description: string, status: string) => {
    if (user) {
      await createTask(user.id, title, description, status);
      fetchTasksAndUser();
    }
  };

  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
    const userId = getUserId();
    const userDetails = await getUserDetails(userId);
    setUser(userDetails);
    fetchTasksAndUser();
  };

  const handleRegister = async (username: string, password: string) => {
    await register(username, password);
    const userId = getUserId();
    const userDetails = await getUserDetails(userId);
    setUser(userDetails);
    fetchTasksAndUser();
  };


  const fetchTasks = async () => {
    if (user) {
      const tasks = await getUserTasks(user.id);
      setTasks(tasks);
    }
  };

  const fetchTasksAndUser = async () => {
    if (isAuthenticated()) {
      const userId = getUserId();
      if (userId) {
        try {
          const tasks = await getUserTasks(userId);
          setTasks(tasks);
          const userDetails = await getUserDetails(userId);
          setUser(userDetails);
        } catch (error) {
          // Handle error
        }
      }
    } else {
      // If the user is not authenticated, clear the tasks and user details
      setTasks([]);
      setUser(null);
    }
  };

  useEffect(() => {
      if (!isUserDataFetched) {
      fetchTasksAndUser();
      setIsUserDataFetched(true);
      }
      }, [user, isUserDataFetched]);

  useEffect(() => {
      if (tasks.length > 0 || user !== null) {
      setIsUserDataFetched(true);
      }
      }, [tasks, user]);

  return (
      <div>
      <nav>
      {!isAuthenticated() && (
          <>
          <button onClick={() => {setModalOpen(true); setIsLogin(false);}}>Register</button>
          <button onClick={() => {setModalOpen(true); setIsLogin(true);}}>Login</button>
          </>
          )}
      {isAuthenticated() && (
          <>
          <p className="nav-username">Welcome {user?.username}!</p>
          <button onClick={handleLogout}>Logout</button>
          </>
          )}
      </nav>


      {modalOpen && isLogin && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <h2>Login</h2>
          <Login onLogin={handleLogin} onClose={() => setModalOpen(false)} />
        </Modal>
      )}

      {modalOpen && !isLogin && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <h2>Register</h2>
          <Register onRegister={handleRegister} onClose={() => setModalOpen(false)} />
        </Modal>
      )}

      {isAuthenticated() && (
          <>
          <h1>Here are your tasks:</h1>
          <TaskList tasks={tasks} user={user} onEdit={fetchTasks} />
          <h1>Add a new task:</h1>
          <TaskForm onSubmit={handleAddTask} />
          </>
          )}

  {!isAuthenticated() && (
      <h1>Welcome! Please register or log in.</h1>
      )}
  </div>
    );
};

export default App;
