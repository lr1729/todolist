// Importing necessary modules and components
import React, { useState } from 'react';
import TaskForm from './TaskForm';
import { TaskData, User } from '../types';
import { updateTask, deleteTask } from '../api';

// Defining the props for the Task component
interface TaskProps {
  task: TaskData; // The task data
  user: User | null; // The user data
  onEdit: () => void; // Function to be called when a task is edited
}

// The Task component
const Task: React.FC<TaskProps> = ({ task, user, onEdit }) => {
  // State for whether the task is being edited
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle deleting a task
  const handleDelete = async () => {
    if (user) {
      await deleteTask(task.id.toString(), user.id.toString());
      onEdit();
    }
  };

  // Function to handle updating a task
  const handleUpdate = async (title: string, description: string, status: 'Pending' | 'In Progress' | 'Completed') => {
    if (user) {
      await updateTask(user.id.toString(), task.id.toString(), title, description, status);
      setIsEditing(false);
      onEdit();
    }
  };

  // If the task is being edited, render the form for editing a task
  if (isEditing) {
    return (
      <div>
        <TaskForm onSubmit={handleUpdate} task={task} />
        <button onClick={() => setIsEditing(false)}>Cancel</button>
      </div>
    );
  }

  // If the task is not being edited, render the task details with Edit and Delete buttons
  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

// Exporting the Task component as default
export default Task;
