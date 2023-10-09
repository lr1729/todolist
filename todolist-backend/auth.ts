// Importing necessary libraries
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Function to generate a JSON Web Token (JWT) for a user
export const generateToken = (userId: number) => {
  // The token is signed with the user's ID and a secret key, and it expires in 1 hour
  return jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1h' });
};

// Function to verify a given JWT
export const verifyToken = (token: string) => {
  try {
    // If the token is valid, it returns the decoded token
    return jwt.verify(token, 'your-secret-key');
  } catch {
    // If the token is invalid, it returns null
    return null;
  }
};

// Function to hash a password using bcrypt
export const hashPassword = async (password: string) => {
  // The password is hashed with a salt of 10 rounds
  return await bcrypt.hash(password, 10);
};

// Function to verify a password against a hash using bcrypt
export const verifyPassword = async (password: string, hash: string) => {
  // It returns true if the password matches the hash, false otherwise
  return await bcrypt.compare(password, hash);
};

