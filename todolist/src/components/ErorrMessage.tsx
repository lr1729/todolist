// ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return <p>{message}</p>;
};

export default ErrorMessage;
