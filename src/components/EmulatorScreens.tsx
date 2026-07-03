import React, { useState, useMemo } from 'react';
import { useEmulator, ScreenType } from '../context/EmulatorContext';
import { Task } from '../data/mockServer';
import { 
  Lock, Mail, User, Plus, Trash2, CheckCircle2, Circle, AlertCircle, 
  Search, Calendar, ListTodo, Sliders, ChevronLeft, LogOut, Sun, Moon, 
  Check, Edit, ArrowLeft, RefreshCw, BarChart2, Briefcase, UserCircle, AlertOctagon, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Common Header Component for Mobile Emulator
export const EmulatorHeader: React.FC<{ title: string; showBack?: boolean }> = ({ title, showBack = false }) => {
  const { goBack, theme } = useEmulator();
  return (
    <div className={`px-4 py-3 flex items-center justify-between border-b ${
      theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
    }`}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={goBack}
            className={`p-1 rounded-full transition-colors ${
              theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
            }`}
            id="mobile-back-btn"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <h1 className="font-bold text-base tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        <span className="text-xs font-mono opacity-60">TaskFlow OS</span>
      </div>
    </div>
  );
};

// 1. Emulator LOGIN SCREEN
export const EmulatorLogin: React.FC = () => {
  const { login, navigate, loading } = useEmulator();
  const [email, setEmail] = useState('developer@taskflow.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill out all fields');
      return;
    }
    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-zinc-950 p-6 justify-center">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-zinc-950 dark:bg-white rounded-2xl mx-auto flex items-center justify-center shadow-md mb-4">
          <ListTodo size={28} className="text-white dark:text-zinc-950" />
        </div>
        <h2 className="text-2xl font-serif italic text-zinc-950 dark:text-white font-bold">TaskFlow</h2>
        <p className="text-[10px] text-zinc-400 mt-1 dark:text-zinc-500 font-bold uppercase tracking-wider">Mobile Portfolio Workspace</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-850">
        <h3 className="font-bold text-zinc-950 dark:text-zinc-100 mb-0.5 tracking-tight text-sm uppercase">Welcome back</h3>
        <p className="text-xs text-zinc-400 dark:text-zinc-400 mb-4">Sign in using mock developer details</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-zinc-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-150 dark:border-zinc-850 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-all font-medium"
                placeholder="developer@taskflow.com"
                id="login-email-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">PASSWORD</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-zinc-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-150 dark:border-zinc-850 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-all font-medium"
                placeholder="••••••••"
                id="login-password-input"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/40">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            id="login-submit-btn"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <button 
          onClick={() => navigate('REGISTER')}
          className="w-full text-center text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-white mt-5 block"
          id="navigate-register-btn"
        >
          Don't have an account? <span className="text-zinc-900 dark:text-white font-bold underline decoration-orange-500 decoration-2">Register here</span>
        </button>
      </div>
    </div>
  );
};

// 2. Emulator REGISTER SCREEN
export const EmulatorRegister: React.FC = () => {
  const { register, navigate, loading } = useEmulator();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const success = await register(name, email, password);
    if (!success) {
      setError('Failed to create account. Passwords require 6 characters.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-zinc-950 p-6 justify-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif italic text-zinc-950 dark:text-white font-bold">Create Account</h2>
        <p className="text-[10px] text-zinc-400 mt-1 dark:text-zinc-500 font-bold uppercase tracking-wider">Initialize a custom TaskFlow session</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-850">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">FULL NAME</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3 text-zinc-400" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-150 dark:border-zinc-850 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-all font-medium"
                placeholder="Jane Doe"
                id="register-name-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-zinc-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-150 dark:border-zinc-850 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-all font-medium"
                placeholder="developer@taskflow.com"
                id="register-email-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">PASSWORD</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-zinc-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-150 dark:border-zinc-850 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-all font-medium"
                placeholder="Min. 6 characters"
                id="register-password-input"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/40">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            id="register-submit-btn"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <button 
          onClick={() => navigate('LOGIN')}
          className="w-full text-center text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-white mt-5 block"
          id="navigate-login-btn"
        >
          Already have an account? <span className="text-zinc-900 dark:text-white font-bold underline decoration-orange-500 decoration-2">Sign In</span>
        </button>
      </div>
    </div>
  );
};

// TaskCard Component inside Emulator (with sliding gestures simulated by Framer Motion)
export const EmulatorTaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { navigate, toggleCompleteTask, deleteTask, theme } = useEmulator();

  const isHigh = task.priority === 'High';
  const isCompleted = task.completed;

  let cardBgClass = '';
  if (isCompleted) {
    cardBgClass = theme === 'dark' ? 'bg-zinc-950/50 border-zinc-900 opacity-50' : 'bg-zinc-50 border-zinc-100 opacity-60';
  } else if (isHigh) {
    cardBgClass = theme === 'dark' ? 'bg-orange-950/20 border-orange-900/40 text-orange-200' : 'bg-orange-50/80 border-orange-100 text-orange-900';
  } else {
    cardBgClass = theme === 'dark' ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-100 hover:border-zinc-200 shadow-sm';
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`group relative overflow-hidden rounded-2xl border transition-all ${cardBgClass}`}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Checkbox */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleCompleteTask(task.id);
          }}
          className={`mt-0.5 transition-colors ${
            isHigh 
              ? 'text-orange-400 dark:text-orange-600 hover:text-orange-600' 
              : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
          id={`toggle-complete-${task.id}`}
        >
          {task.completed ? (
            <CheckCircle2 size={18} className={isHigh ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-900 dark:text-white'} />
          ) : (
            <Circle size={18} className={isHigh ? 'text-orange-300 dark:text-orange-800' : ''} />
          )}
        </button>

        {/* Content clickable block */}
        <div 
          onClick={() => navigate('DETAILS', { taskId: task.id })}
          className="flex-1 cursor-pointer min-w-0"
        >
          <h4 className={`text-sm font-bold truncate tracking-tight ${
            task.completed 
              ? 'line-through text-zinc-400 dark:text-zinc-500' 
              : isHigh 
                ? 'text-orange-950 dark:text-orange-100 font-extrabold' 
                : 'text-zinc-900 dark:text-zinc-100'
          }`}>
            {task.title}
          </h4>
          <p className={`text-xs truncate mt-0.5 ${isHigh ? 'text-orange-700 dark:text-orange-400/80' : 'text-zinc-500 dark:text-zinc-400'}`}>
            {task.description || 'No description provided.'}
          </p>

          <div className="flex items-center gap-2 mt-2.5">
            {/* Calendar Due Date */}
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold ${
              isHigh 
                ? 'bg-orange-200/50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
            }`}>
              <Calendar size={10} />
              <span>{task.dueDate}</span>
            </div>
            {/* Category / Priority Badge */}
            <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
              isHigh 
                ? 'bg-orange-200 text-orange-800 dark:bg-orange-900/65 dark:text-orange-200' 
                : task.category === 'Work'
                  ? 'bg-blue-50 text-blue-700 border border-blue-100/30 dark:bg-blue-950/40 dark:text-blue-300'
                  : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
            }`}>
              {isHigh ? 'Critical' : task.category}
            </div>
          </div>
        </div>

        {/* Priority dot & slide delete controls */}
        <div className="flex flex-col items-end justify-between h-12">
          <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-orange-500' : 'bg-zinc-300 dark:bg-zinc-700'}`} title={`${task.priority} Priority`}></span>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="p-1 rounded text-zinc-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-zinc-100/55 dark:hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Delete task"
            id={`delete-btn-${task.id}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// 3. Emulator HOME SCREEN
export const EmulatorHome: React.FC = () => {
  const { tasks, theme, triggerPullToRefresh, loading, navigate, user } = useEmulator();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Work' | 'Personal' | 'Urgent'>('All');
  const [refreshing, setRefreshing] = useState(false);

  const categories: ('All' | 'Work' | 'Personal' | 'Urgent')[] = ['All', 'Work', 'Personal', 'Urgent'];

  const onRefresh = async () => {
    setRefreshing(true);
    await triggerPullToRefresh();
    setRefreshing(false);
  };

  // Filter tasks based on Search, Completion status, and Categories
  const activeFilteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                            task.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
      return matchesSearch && matchesCategory && !task.completed;
    });
  }, [tasks, search, selectedCategory]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { pending, completed, completionRate };
  }, [tasks]);

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-zinc-950">
      <EmulatorHeader title="Today's Tasks" />

      {/* Profile Overview Banner */}
      <div className={`px-4 py-3 flex items-center justify-between border-b ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'
      }`}>
        <div className="flex items-center gap-2">
          <img 
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371717a'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z'/></svg>" 
            alt="User Silhouette" 
            className="w-8 h-8 rounded-full border border-zinc-950 dark:border-white p-0.5 bg-zinc-100 dark:bg-zinc-800"
          />
          <div>
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-none">
              {user?.name || 'DEVELOPER PROFILE'}
            </p>
          </div>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading || refreshing}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
            isDark 
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' 
              : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border border-zinc-150'
          }`}
          id="pull-to-refresh-api-btn"
        >
          <RefreshCw size={11} className={loading || refreshing ? 'animate-spin' : ''} />
          <span>Sync API</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Statistics Widgets */}
        <div className={`grid grid-cols-3 gap-3 p-3.5 rounded-2xl ${
          isDark ? 'bg-zinc-900/90' : 'bg-white shadow-xs border border-zinc-100'
        }`}>
          <div className="text-center">
            <span className="text-xl font-serif italic font-extrabold text-zinc-900 dark:text-zinc-100">{stats.pending}</span>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wider">Pending</p>
          </div>
          <div className="text-center border-x border-zinc-100 dark:border-zinc-800">
            <span className="text-xl font-serif italic font-extrabold text-zinc-900 dark:text-zinc-100">{stats.completed}</span>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wider">Done</p>
          </div>
          <div className="text-center">
            <span className="text-xl font-serif italic font-extrabold text-orange-600">{stats.completionRate}%</span>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wider">Ratio</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`relative flex items-center rounded-xl border px-3 py-1.5 ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-150 text-zinc-800'
        }`}>
          <Search size={15} className="text-zinc-400 mr-2 shrink-0" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search active tasks..."
            className="w-full text-xs bg-transparent focus:outline-none placeholder-zinc-400"
            id="task-search-input"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 shrink-0 text-xs font-bold"
              id="clear-search-btn"
            >
              Clear
            </button>
          )}
        </div>

        {/* Horizontal Category Slider */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  isSelected 
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black shadow-xs' 
                    : (isDark 
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400' 
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-150')
                }`}
                id={`category-pill-${cat}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Task List container */}
        <div className="space-y-3 pb-20">
          {loading && activeFilteredTasks.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <span className="w-8 h-8 border-2 border-zinc-950 dark:border-white border-t-transparent rounded-full animate-spin"></span>
              <p className="text-xs text-zinc-500 mt-2">Loading TaskFlow...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {activeFilteredTasks.length > 0 ? (
                activeFilteredTasks.map((task) => (
                  <EmulatorTaskCard key={task.id} task={task} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 px-4 text-center"
                >
                  <ListTodo size={40} className="text-zinc-400 mx-auto opacity-50 mb-3" />
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No active tasks</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[200px] mx-auto">
                    {search ? 'Try adjusting your search criteria.' : 'Create a brand new task using the floating "+" button!'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('ADD_TASK')}
        className="absolute bottom-16 right-4 w-12 h-12 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-full flex items-center justify-center shadow-lg shadow-zinc-950/20 hover:bg-zinc-900 dark:hover:bg-zinc-50 transition-colors focus:outline-none"
        title="Add new task"
        id="floating-add-task-btn"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

// 4. Emulator ADD TASK SCREEN
export const EmulatorAddTask: React.FC = () => {
  const { addTask, goBack, theme } = useEmulator();
  const isDark = theme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Work' | 'Personal' | 'Urgent'>('Personal');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description,
      category,
      priority,
      dueDate,
      notes
    });
    goBack();
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-zinc-950">
      <EmulatorHeader title="New Task" showBack />

      <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        <div>
          <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">TASK TITLE *</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
              isDark ? 'bg-zinc-900 text-zinc-100 border-zinc-800' : 'bg-white text-zinc-900 border-zinc-150 border shadow-xs'
            }`}
            placeholder="e.g., Deliver Applet build"
            id="add-task-title"
          />
        </div>

        <div>
          <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">DESCRIPTION</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
              isDark ? 'bg-zinc-900 text-zinc-100 border-zinc-800' : 'bg-white text-zinc-900 border-zinc-150 border shadow-xs'
            }`}
            placeholder="Describe the goals..."
            id="add-task-desc"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">CATEGORY</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
                isDark ? 'bg-zinc-900 text-zinc-100 border-zinc-800' : 'bg-white text-zinc-900 border-zinc-150 border shadow-xs'
              }`}
              id="add-task-category"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">PRIORITY</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
                isDark ? 'bg-zinc-900 text-zinc-100 border-zinc-800' : 'bg-white text-zinc-900 border-zinc-150 border shadow-xs'
              }`}
              id="add-task-priority"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">DUE DATE</label>
          <input 
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
              isDark ? 'bg-zinc-900 text-zinc-100 border-zinc-800' : 'bg-white text-zinc-900 border-zinc-150 border shadow-xs'
            }`}
            id="add-task-date"
          />
        </div>

        <div>
          <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">MEMO & ADDITIONAL NOTES</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
              isDark ? 'bg-zinc-900 text-zinc-100 border-zinc-800' : 'bg-white text-zinc-900 border-zinc-150 border shadow-xs'
            }`}
            placeholder="URL parameters, login keys, extra details..."
            id="add-task-notes"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-zinc-950/10"
          id="add-task-submit"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

// 5. Emulator EDIT TASK SCREEN
export const EmulatorEditTask: React.FC = () => {
  const { selectedTaskId, tasks, editTask, goBack, theme } = useEmulator();
  const isDark = theme === 'dark';

  const taskToEdit = useMemo(() => {
    return tasks.find(t => t.id === selectedTaskId);
  }, [tasks, selectedTaskId]);

  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [category, setCategory] = useState<'Work' | 'Personal' | 'Urgent'>(taskToEdit?.category || 'Personal');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>(taskToEdit?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(taskToEdit?.dueDate || '');
  const [notes, setNotes] = useState(taskToEdit?.notes || '');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !taskToEdit) return;

    editTask(taskToEdit.id, {
      title,
      description,
      category,
      priority,
      dueDate,
      notes
    });
    goBack();
  };

  if (!taskToEdit) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-zinc-500">Task details missing.</p>
        <button onClick={goBack} className="text-zinc-950 dark:text-white font-bold underline text-xs mt-2" id="edit-error-back">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-zinc-950">
      <EmulatorHeader title="Edit Task" showBack />

      <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        <div>
          <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">TASK TITLE *</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
              isDark ? 'bg-zinc-900 text-zinc-100 border-zinc-800' : 'bg-white text-zinc-900 border-zinc-150 border shadow-xs'
            }`}
            id="edit-task-title"
          />
        </div>

        <div>
          <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">DESCRIPTION</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
              isDark ? 'bg-zinc-900 text-zinc-100 border-zinc-800' : 'bg-white text-zinc-900 border-zinc-150 border shadow-xs'
            }`}
            id="edit-task-desc"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">CATEGORY</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
                isDark ? 'bg-zinc-900 text-zinc-100 border-zinc-800' : 'bg-white text-zinc-900 border-zinc-150 border shadow-xs'
              }`}
              id="edit-task-category"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">PRIORITY</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
                isDark ? 'bg-zinc-900 text-zinc-100 border-zinc-800' : 'bg-white text-zinc-900 border-zinc-150 border shadow-xs'
              }`}
              id="edit-task-priority"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">DUE DATE</label>
          <input 
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
              isDark ? 'bg-zinc-900 text-zinc-100 border-zinc-800' : 'bg-white text-zinc-900 border-zinc-150 border shadow-xs'
            }`}
            id="edit-task-date"
          />
        </div>

        <div>
          <label className="block text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">MEMO & NOTES</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
              isDark ? 'bg-zinc-900 text-zinc-100 border-zinc-800' : 'bg-white text-zinc-900 border-zinc-150 border shadow-xs'
            }`}
            id="edit-task-notes"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-zinc-950/10"
          id="edit-task-submit"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

// 6. Emulator TASK DETAILS SCREEN
export const EmulatorTaskDetails: React.FC = () => {
  const { selectedTaskId, tasks, theme, toggleCompleteTask, deleteTask, goBack, navigate } = useEmulator();
  const isDark = theme === 'dark';

  const task = useMemo(() => {
    return tasks.find(t => t.id === selectedTaskId);
  }, [tasks, selectedTaskId]);

  if (!task) {
    return (
      <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-zinc-950 items-center justify-center p-6 text-center">
        <AlertOctagon size={48} className="text-zinc-400 mb-3" />
        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Task details not found</p>
        <p className="text-xs text-zinc-500 mt-1">This task may have been permanently deleted.</p>
        <button 
          onClick={goBack} 
          className="mt-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs transition-all"
          id="details-error-back"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-zinc-950">
      <EmulatorHeader title="Task Details" showBack />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* Core Detail Card */}
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-150 text-zinc-900 shadow-sm'
        }`}>
          <div className="flex gap-2 mb-3">
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-bold px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
              {task.category}
            </span>
            <span className={`font-bold px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${
              task.priority === 'High' 
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100/50' 
                : task.priority === 'Medium'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100/50'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50'
            }`}>
              {task.priority} Priority
            </span>
          </div>

          <h3 className={`text-base font-bold ${task.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}`}>
            {task.title}
          </h3>

          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mt-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <Calendar size={13} />
            <span>Due date: {task.dueDate}</span>
          </div>

          {/* Completion Status Badge */}
          <div className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
            task.completed 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400' 
              : 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400'
          }`}>
            {task.completed ? <CheckCircle2 size={15} /> : <Circle size={15} />}
            <span>Status: {task.completed ? 'Completed' : 'Pending Action'}</span>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <span className="text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">DESCRIPTION</span>
          <div className={`mt-1.5 p-3.5 rounded-xl border text-xs leading-relaxed ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-150 text-zinc-600 shadow-xs'
          }`}>
            {task.description || 'No detailed description specified.'}
          </div>
        </div>

        {/* Memo & Notes Section */}
        {task.notes && (
          <div>
            <span className="text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">MEMO & NOTES</span>
            <div className={`mt-1.5 p-3.5 rounded-xl border text-xs font-mono break-all whitespace-pre-wrap ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-150 text-zinc-500 shadow-xs'
            }`}>
              {task.notes}
            </div>
          </div>
        )}

        {/* Interactive Actions Grid */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          <button
            onClick={() => toggleCompleteTask(task.id)}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            id="details-action-complete"
          >
            <Check size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1">{task.completed ? 'Reopen' : 'Done'}</span>
          </button>

          <button
            onClick={() => navigate('EDIT_TASK')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-50 shadow-xs transition-colors"
            id="details-action-edit"
          >
            <Edit size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Edit</span>
          </button>

          <button
            onClick={() => {
              deleteTask(task.id);
              goBack();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
            id="details-action-delete"
          >
            <Trash2 size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 7. Emulator COMPLETED ARCHIVES SCREEN
export const EmulatorCompletedTasks: React.FC = () => {
  const { tasks, theme } = useEmulator();
  const isDark = theme === 'dark';

  const completedTasks = useMemo(() => {
    return tasks.filter(t => t.completed);
  }, [tasks]);

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-zinc-950">
      <EmulatorHeader title="Completed Archive" />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20">
        <AnimatePresence mode="popLayout">
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <EmulatorTaskCard key={task.id} task={task} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <CheckCircle2 size={48} className="text-zinc-400 mx-auto opacity-40 mb-3" />
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Archive is empty</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[200px] mx-auto">
                No tasks are currently archived. Finish active items to check them off!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// 8. Emulator PROFILE & CONFIG SCREEN
export const EmulatorProfile: React.FC = () => {
  const { user, theme, setTheme, logout, tasks } = useEmulator();
  const isDark = theme === 'dark';

  // Stats calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const workCount = tasks.filter(t => t.category === 'Work').length;
    const personalCount = tasks.filter(t => t.category === 'Personal').length;
    const urgentCount = tasks.filter(t => t.category === 'Urgent').length;
    return { total, completed, workCount, personalCount, urgentCount };
  }, [tasks]);

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-zinc-950">
      <EmulatorHeader title="My Profile" />

      <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-20">
        {/* User Badge */}
        <div className={`p-5 rounded-2xl text-center border ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-150 shadow-sm'
        }`}>
          <img 
            src={user.avatar} 
            alt="Profile Avatar" 
            className="w-16 h-16 rounded-full border-2 border-zinc-950 dark:border-white mx-auto mb-3"
          />
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-tight">{user.name}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
        </div>

        {/* Preferences section */}
        <div>
          <span className="text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">PREFERENCES</span>
          <div className={`mt-1.5 p-3 rounded-2xl border ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-150 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                {isDark ? <Moon size={16} className="text-zinc-100" /> : <Sun size={16} className="text-zinc-850" />}
                <span className="font-semibold">Dark Mode Layout</span>
              </div>
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  isDark ? 'bg-zinc-100' : 'bg-zinc-950'
                }`}
                id="emulator-theme-switch"
              >
                <span className={`w-3.5 h-3.5 bg-white dark:bg-zinc-950 rounded-full absolute top-0.5 transition-transform ${
                  isDark ? 'translate-x-5.5' : 'translate-x-1'
                }`}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Task Analytics metrics */}
        <div>
          <span className="text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">TASKFLOW METRICS</span>
          <div className={`mt-1.5 rounded-2xl border p-4 space-y-3.5 text-xs ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-150 shadow-sm text-zinc-600'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Tasks Registered</span>
              <span className="font-extrabold text-zinc-900 dark:text-white">{stats.total}</span>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-850" />
            
            <div className="flex items-center justify-between">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">Total Completed Archive</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{stats.completed}</span>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-850" />

            <div className="flex items-center justify-between">
              <span className="font-medium">Work Categories</span>
              <span className="font-extrabold">{stats.workCount} tasks</span>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-850" />

            <div className="flex items-center justify-between">
              <span className="font-medium">Personal Categories</span>
              <span className="font-extrabold">{stats.personalCount} tasks</span>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-850" />

            <div className="flex items-center justify-between">
              <span className="font-medium text-rose-500">Urgent Categories</span>
              <span className="font-extrabold text-rose-500">{stats.urgentCount} tasks</span>
            </div>
          </div>
        </div>

        {/* Sign Out Trigger */}
        <button
          onClick={logout}
          className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors flex items-center justify-center gap-1.5"
          id="profile-logout-btn"
        >
          <LogOut size={14} />
          <span>Sign Out Account</span>
        </button>
      </div>
    </div>
  );
};
