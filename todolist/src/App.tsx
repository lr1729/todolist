import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Modal from './components/Modal';
import { User } from './types';
import { login, register, getUserTasks, getUserDetails, isAuthenticated, getUserId, logout, createTask} from './api';
import './App.css';

// Main App component
const App: React.FC = () => {
  // State variables
  const [tasks, setTasks] = useState([]); // Tasks of the user
  const [user, setUser] = useState<User | null>(null); // Current user
  const [modalOpen, setModalOpen] = useState(false); // State of the modal (open/closed)
  const [isLogin, setIsLogin] = useState(true); // State to check if user is logging in or registering
  const [isUserDataFetched, setIsUserDataFetched] = useState(false); // State to check if user data has been fetched

  // Function to handle logout
  const handleLogout = () => {
    logout(); // Logout function from api file
    setUser(null); // Clearing the user state
    setTasks([]); // Clearing the tasks state
  };

  // Function to handle adding a task
  const handleAddTask = async (title: string, description: string, status: string) => {
    if (user) {
      await createTask(user.id, title, description, status); // Create task function from api file
      fetchTasksAndUser(); // Fetch updated tasks and user details
    }
  };

  // Function to handle login
  const handleLogin = async (username: string, password: string) => {
    await login(username, password); // Login function from api file
    const userId = getUserId(); // Get user id function from api file
    const userDetails = await getUserDetails(userId); // Get user details function from api file
    setUser(userDetails); // Setting the user state with the fetched user details
    fetchTasksAndUser(); // Fetch updated tasks and user details
  };

  // Function to handle registration
  const handleRegister = async (username: string, password: string) => {
    await register(username, password); // Register function from api file
    const userId = getUserId(); // Get user id function from api file
    const userDetails = await getUserDetails(userId); // Get user details function from api file
    setUser(userDetails); // Setting the user state with the fetched user details
    fetchTasksAndUser(); // Fetch updated tasks and user details
  };

  // Function to fetch tasks of the current user
  const fetchTasks = async () => {
    if (user) {
      const tasks = await getUserTasks(user.id); // Get user tasks function from api file
      setTasks(tasks); // Setting the tasks state with the fetched tasks
    }
  };

  // Function to fetch tasks and user details of the current user if authenticated 
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
      setTasks([]);
      setUser(null);
    }
  };

  // Check if the user data has updated and fetch if so
  useEffect(() => {
      if (!isUserDataFetched) {
      fetchTasksAndUser();
      setIsUserDataFetched(true);
      }
      }, [user, isUserDataFetched]);

  // Set the fetched state to true if not null
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

