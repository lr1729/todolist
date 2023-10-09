export type TaskData = {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
};

export type User = {
  id: string;
  username: string;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string; // Add this line
  children: React.ReactNode;
}

