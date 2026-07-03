export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'Work' | 'Personal' | 'Urgent';
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Configure Express proxy server",
    description: "Write routes in server.ts to proxy request keys away from client bundle.",
    category: "Work",
    dueDate: "2026-07-04",
    priority: "High",
    notes: "Review safety guidelines regarding third-party credentials.",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "task-2",
    title: "Grocery shopping & meal prep",
    description: "Buy fresh vegetables, lean proteins, and batch cook for the week.",
    category: "Personal",
    dueDate: "2026-07-05",
    priority: "Low",
    notes: "Remember to bring reusable canvas grocery bags.",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "task-3",
    title: "CRITICAL: Fix production database leak",
    description: "Analyze Firestore security rules to prevent unauthorized reads on master collections.",
    category: "Urgent",
    dueDate: "2026-07-03",
    priority: "High",
    notes: "Run emulator tests before deploying live rules.",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "task-4",
    title: "Refactor state management context",
    description: "Avoid unnecessary re-renders in FlatList by memoizing item component layout.",
    category: "Work",
    dueDate: "2026-07-06",
    priority: "Medium",
    notes: "Review React.memo and useMemo documentation.",
    completed: true,
    createdAt: new Date().toISOString()
  }
];

export const MOCK_USER: User = {
  id: "user-999",
  name: "DEVELOPER PORTFOLIO",
  email: "developer@taskflow.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
};
