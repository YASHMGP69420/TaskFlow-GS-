import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, User, INITIAL_TASKS, MOCK_USER } from '../data/mockServer';
import axios from 'axios';

export type ScreenType = 'LOGIN' | 'REGISTER' | 'HOME' | 'ADD_TASK' | 'EDIT_TASK' | 'DETAILS' | 'COMPLETED' | 'PROFILE';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

interface EmulatorContextProps {
  currentScreen: ScreenType;
  screenStack: ScreenType[];
  selectedTaskId: string | null;
  tasks: Task[];
  user: User | null;
  theme: 'light' | 'dark';
  loading: boolean;
  toast: ToastMessage | null;
  apiMode: 'offline' | 'online';
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  navigate: (screen: ScreenType, params?: { taskId?: string }) => void;
  goBack: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setApiMode: (mode: 'offline' | 'online') => void;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  editTask: (id: string, updatedFields: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleCompleteTask: (id: string) => void;
  triggerPullToRefresh: () => Promise<void>;
}

const EmulatorContext = createContext<EmulatorContextProps | undefined>(undefined);

export const useEmulator = () => {
  const context = useContext(EmulatorContext);
  if (!context) {
    throw new Error('useEmulator must be used within an EmulatorProvider');
  }
  return context;
};

export const EmulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('LOGIN');
  const [screenStack, setScreenStack] = useState<ScreenType[]>(['LOGIN']);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [apiMode, setApiMode] = useState<'offline' | 'online'>('online');

  // Trigger brief toast messages
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, text, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load state from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem('taskflow_user');
    const savedTasks = localStorage.getItem('taskflow_tasks');
    const savedTheme = localStorage.getItem('taskflow_theme');

    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    }

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setCurrentScreen('HOME');
      setScreenStack(['HOME']);

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks(INITIAL_TASKS);
      }
    } else {
      setTasks(INITIAL_TASKS);
    }
  }, []);

  // Save tasks and user to local storage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const navigate = (screen: ScreenType, params?: { taskId?: string }) => {
    if (params?.taskId) {
      setSelectedTaskId(params.taskId);
    }
    setCurrentScreen(screen);
    setScreenStack(prev => [...prev, screen]);
  };

  const goBack = () => {
    if (screenStack.length > 1) {
      const newStack = [...screenStack];
      newStack.pop(); // remove current
      const targetScreen = newStack[newStack.length - 1];
      setCurrentScreen(targetScreen);
      setScreenStack(newStack);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    // Mimic API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);

    if (!email.includes('@') || password.length < 4) {
      showToast('Invalid email or password (min 4 characters)', 'error');
      return false;
    }

    const name = email.split('@')[0].toUpperCase();
    const newUser: User = {
      id: 'user-' + Date.now(),
      name,
      email,
      avatar: MOCK_USER.avatar
    };

    setUser(newUser);
    localStorage.setItem('taskflow_user', JSON.stringify(newUser));
    showToast(`Welcome back, ${name}!`, 'success');
    setCurrentScreen('HOME');
    setScreenStack(['HOME']);
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);

    if (!name.trim() || !email.includes('@') || password.length < 6) {
      showToast('Please provide valid details (Password min 6 characters)', 'error');
      return false;
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      name: name.toUpperCase(),
      email,
      avatar: MOCK_USER.avatar
    };

    setUser(newUser);
    localStorage.setItem('taskflow_user', JSON.stringify(newUser));
    showToast('Registration successful!', 'success');
    setCurrentScreen('HOME');
    setScreenStack(['HOME']);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_user');
    showToast('Logged out successfully', 'info');
    setCurrentScreen('LOGIN');
    setScreenStack(['LOGIN']);
  };

  const updateTheme = (nextTheme: 'light' | 'dark') => {
    setTheme(nextTheme);
    localStorage.setItem('taskflow_theme', nextTheme);
    showToast(`Theme switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  // Task Mutators
  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    showToast('Task added successfully!', 'success');
  };

  const editTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } as Task : t));
    showToast('Task updated successfully!', 'success');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task deleted successfully', 'error');
  };

  const toggleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        showToast(nextState ? 'Task marked complete! 🎉' : 'Task reopened', 'success');
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const triggerPullToRefresh = async () => {
    if (apiMode === 'offline') {
      showToast('Pull to Refresh: offline fallback task list restored', 'info');
      setTasks(INITIAL_TASKS);
      return;
    }

    setLoading(true);
    showToast('Fetching tasks from JSONPlaceholder API...', 'info');
    try {
      // Axios request to fetch initial mock todos from public API
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=4');
      
      const formattedTasks: Task[] = response.data.map((todo: any, idx: number) => ({
        id: `api-${todo.id}-${idx}`,
        title: todo.title,
        description: 'REST API Todo element imported from jsonplaceholder.typicode.com.',
        category: idx % 3 === 0 ? 'Work' : idx % 3 === 1 ? 'Personal' : 'Urgent',
        dueDate: new Date(Date.now() + idx * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: idx % 3 === 0 ? 'High' : idx % 3 === 1 ? 'Medium' : 'Low',
        notes: 'Loaded dynamically via Axios service layers.',
        completed: todo.completed,
        createdAt: new Date().toISOString()
      }));

      // Merge fetched tasks with existing tasks, avoiding duplicate titles
      setTasks(prev => {
        const filteredPrev = prev.filter(p => !p.id.startsWith('api-'));
        return [...formattedTasks, ...filteredPrev];
      });
      showToast('API synchronized successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('API request failed, fallback task restored', 'error');
      setTasks(INITIAL_TASKS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmulatorContext.Provider value={{
      currentScreen,
      screenStack,
      selectedTaskId,
      tasks,
      user,
      theme,
      loading,
      toast,
      apiMode,
      showToast,
      navigate,
      goBack,
      login,
      register,
      logout,
      setTheme: updateTheme,
      setApiMode,
      addTask,
      editTask,
      deleteTask,
      toggleCompleteTask,
      triggerPullToRefresh
    }}>
      {children}
    </EmulatorContext.Provider>
  );
};
