import React, { useState } from 'react';

// Defining the type for the props
interface LoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onClose: () => void;
}

// The Login component
const Login: React.FC<LoginProps> = ({ onLogin, onClose }) => {
  // Using the useState hook to manage component state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Check if username or password is empty
    if (username === '' || password === '') {
      setError('Username and password cannot be empty');
      return;
    }
    try {
      // Try to login
      await onLogin(username, password);
      // If login is successful, close the modal
      onClose(); 
    } catch (error: any) {
      // Handle errors
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  // The component's render method
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      {error && <p>{error}</p>}
      <button type="submit">Log in</button>
    </form>
  );
};

// Exporting the component
export default Login;
