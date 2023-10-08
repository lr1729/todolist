import React from 'react';

export type TaskData = {
  id: number;
  title: string;
  description: string;
  status: string;
};

interface TaskProps {
  task: TaskData;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
    </div>
  );
};

export default Task;

