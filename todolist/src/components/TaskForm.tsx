// Importing necessary hooks and types from React and local files
import React, { useState } from 'react';
import { TaskData } from '../types';

// Defining the props for the TaskForm component
interface TaskFormProps {
  onSubmit: (title: string, description: string, status: 'Pending' | 'In Progress' | 'Completed') => void;
  task?: TaskData; // Optional prop to handle task updates
}

// The TaskForm functional component
const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, task }) => {
  // Using the useState hook to manage form fields
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>(task ? task.status : 'Pending');

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Preventing default form submission behaviour
    onSubmit(title, description, status); // Calling the onSubmit function passed as a prop
  };

  // The component's returned JSX
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
      <button type="submit">{task ? 'Update' : 'Add'} Task</button> {/* The button text changes based on whether a task is being updated or added */}
    </form>
  );
};

// Exporting the TaskForm component as default
export default TaskForm;
