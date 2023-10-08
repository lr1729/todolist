import React, { useEffect, useState } from 'react';
import './App.css';
import TaskList from './components/TaskList';
import { getTasks } from './api';
import { TaskData } from './components/Task';

const App = () => {
  const [tasks, setTasks] = useState<TaskData[]>([]);

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="App">
      <TaskList tasks={tasks} />
    </div>
  );
};

export default App;

