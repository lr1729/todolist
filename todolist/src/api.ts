export const getTasks = async () => {
  const response = await fetch('/tasks');
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const tasks = await response.json();
  return tasks;
};

