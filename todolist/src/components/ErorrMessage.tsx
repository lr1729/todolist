import React from 'react';

// Define the properties for the ErrorMessage component
interface ErrorMessageProps {
  message: string | null; // The error message to display
}

// Define the ErrorMessage component
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null; // If there's no message, don't render anything

  return <p>{message}</p>; // Render the error message
};

export default ErrorMessage; // Export the ErrorMessage component

