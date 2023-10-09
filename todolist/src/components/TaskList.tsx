import React from 'react';
import { TaskData, User } from '../types';
import Task from './Task';

interface TaskListProps {
  tasks: TaskData[];
  user: User | null;
  onEdit: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, user, onEdit }) => {
  return (
    <div>
      {tasks.map(task => (
        <div className="task-list-item" key={task.id}>
          <Task task={task} user={user} onEdit={onEdit} />
        </div>
      ))}
    </div>
  );
};

export default TaskList;

