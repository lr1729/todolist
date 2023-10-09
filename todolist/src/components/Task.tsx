import React, { useState } from 'react';
import TaskForm from './TaskForm';
import { TaskData, User } from '../types';
import { updateTask, deleteTask } from '../api';

interface TaskProps {
  task: TaskData;
  user: User | null;
  onEdit: () => void;
}

const Task: React.FC<TaskProps> = ({ task, user, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (user) {
      await deleteTask(task.id.toString(), user.id.toString());
      onEdit();
    }
  };

  const handleUpdate = async (title: string, description: string, status: 'Pending' | 'In Progress' | 'Completed') => {
    if (user) {
      await updateTask(user.id.toString(), task.id.toString(), title, description, status);
      setIsEditing(false);
      onEdit();
    }
  };

  if (isEditing) {
    return (
      <div>
        <TaskForm onSubmit={handleUpdate} task={task} />
        <button onClick={() => setIsEditing(false)}>Cancel</button>
      </div>
    );
  }

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

export default Task;

