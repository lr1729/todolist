import React, { useState } from 'react';

// Register.tsx
interface RegisterProps {
  onRegister: (username: string, password: string) => Promise<void>;
  onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Add this line

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (username === '' || password === '') {
      setError('Username and password cannot be empty');
      return;
    }
    try {
      await onRegister(username, password);
      onClose(); // Only close the modal when registration is successful
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError('User already exists'); // Set an error message
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
      {error && <p>{error}</p>} {/* Display the error message */}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
