import React from 'react';
import Task, { TaskData } from './Task';

interface TaskListProps {
  tasks: TaskData[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div>
      {tasks.map(task => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;

