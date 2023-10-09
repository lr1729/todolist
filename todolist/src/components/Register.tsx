import React, { useState } from 'react';

// Define the properties for the Register component
interface RegisterProps {
  onRegister: (username: string, password: string) => Promise<void>; // Function to handle registration
  onClose: () => void; // Function to close the modal
}

// Define the Register component
const Register: React.FC<RegisterProps> = ({ onRegister, onClose }) => {
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (username === '' || password === '') {
      setError('Username and password cannot be empty'); // Set error if username or password is empty
      return;
    }
    try {
      await onRegister(username, password); // Try to register the user
      onClose(); // Only close the modal when registration is successful
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError('User already exists'); // Set an error message if user already exists
      } else {
        setError('An unexpected error occurred'); // Set an error message for any other errors
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} /> {/* Input field for username */}
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} /> {/* Input field for password */}
      </label>
      {error && <p>{error}</p>} {/* Display the error message */}
      <button type="submit">Register</button> {/* Submit button */}
    </form>
  );
};

export default Register; // Export the Register component

