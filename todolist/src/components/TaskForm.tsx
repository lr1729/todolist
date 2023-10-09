import React, { useState } from 'react';
import { TaskData } from '../types';

interface TaskFormProps {
  onSubmit: (title: string, description: string, status: 'Pending' | 'In Progress' | 'Completed') => void;
  task?: TaskData;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, task }) => {
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>(task ? task.status : 'Pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, description, status);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
      <select value={status} onChange={e => setStatus(e.target.value as 'Pending' | 'In Progress' | 'Completed')} required>
        <option value="">Select status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <button type="submit">{task ? 'Update' : 'Add'} Task</button>
    </form>
  );
};

export default TaskForm;

