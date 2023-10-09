import React, { useState } from 'react';

// Login.tsx
interface LoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (username === '' || password === '') {
      setError('Username and password cannot be empty');
      return;
    }
    try {
      await onLogin(username, password);
      onClose(); // Only close the modal when login is successful
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

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

export default Login;

