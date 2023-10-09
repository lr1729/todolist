import React from 'react';
import { TaskData, User } from '../types';
import Task from './Task';

// Defining the props for the TaskList component
interface TaskListProps {
  tasks: TaskData[]; // An array of tasks
  user: User | null; // The current user, or null if no user is logged in
  onEdit: () => void; // A function to be called when a task is edited
}

// The TaskList component displays a list of tasks
const TaskList: React.FC<TaskListProps> = ({ tasks, user, onEdit }) => {
  return (
    <div>
      {tasks.map(task => (
        // For each task in the tasks array, a Task component is created.
        // The task, user and onEdit function are passed as props to each Task component.
        <div className="task-list-item" key={task.id}>
          <Task task={task} user={user} onEdit={onEdit} />
        </div>
      ))}
    </div>
  );
};

// Exporting the TaskList component as the default export
export default TaskList;
