export interface CodeFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const rnCodebase: CodeFile[] = [
  {
    name: "package.json",
    path: "package.json",
    language: "json",
    content: `{
  "name": "taskflow-mobile",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "ts.check": "tsc"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "~1.23.1",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/native-stack": "^6.9.26",
    "axios": "^1.6.8",
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "react-native-gesture-handler": "~2.16.1",
    "react-native-reanimated": "~3.10.1",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "3.31.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}`
  },
  {
    name: "App.js",
    path: "App.js",
    language: "javascript",
    content: `import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TaskProvider } from './src/context/TaskContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TaskProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </TaskProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}`
  },
  {
    name: "TaskContext.js",
    path: "src/context/TaskContext.js",
    language: "javascript",
    content: `import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

const TaskContext = createContext(null);

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user session, theme, and cached tasks on start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        const savedTheme = await AsyncStorage.getItem('@taskflow_theme');
        if (savedTheme) {
          setTheme(savedTheme);
        }

        const savedUser = await AsyncStorage.getItem('@taskflow_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Load cached tasks
          const cachedTasks = await AsyncStorage.getItem(\`@taskflow_tasks_\${parsedUser.id}\`);
          if (cachedTasks) {
            setTasks(JSON.parse(cachedTasks));
          } else {
            // Fetch initial dummy tasks from API if no cache
            await fetchTasksFromAPI(parsedUser.id);
          }
        }
      } catch (err) {
        console.error('Error initializing application:', err);
        setError('Failed to initialize local storage.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const fetchTasksFromAPI = async (userId) => {
    try {
      setLoading(true);
      // Fetching mock tasks from JSONPlaceholder for this user
      const response = await api.get('/todos?_limit=10');
      
      // Transform mock data into our task format
      const formattedTasks = response.data.map((todo, idx) => ({
        id: \`api-\${todo.id}-\${idx}\`,
        title: todo.title,
        description: 'Task imported via REST API integration.',
        category: idx % 3 === 0 ? 'Work' : idx % 3 === 1 ? 'Personal' : 'Urgent',
        dueDate: new Date(Date.now() + idx * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: idx % 3 === 0 ? 'High' : idx % 3 === 1 ? 'Medium' : 'Low',
        notes: 'Imported from jsonplaceholder.typicode.com',
        completed: todo.completed,
        createdAt: new Date().toISOString()
      }));

      setTasks(formattedTasks);
      await AsyncStorage.setItem(\`@taskflow_tasks_\${userId}\`, JSON.stringify(formattedTasks));
    } catch (err) {
      console.error('Failed to fetch API todos, using fallback static data:', err);
      // Fallback state if API fails
      const fallbackTasks = [
        {
          id: 'fb-1',
          title: 'Welcome to TaskFlow!',
          description: 'Start managing your projects seamlessly.',
          category: 'Personal',
          dueDate: new Date().toISOString().split('T')[0],
          priority: 'High',
          notes: 'This is a persistent local task.',
          completed: false,
          createdAt: new Date().toISOString()
        }
      ];
      setTasks(fallbackTasks);
      await AsyncStorage.setItem(\`@taskflow_tasks_\${userId}\`, JSON.stringify(fallbackTasks));
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Simple mock validation
      if (!email.includes('@') || password.length < 4) {
        throw new Error('Invalid email or password minimum length of 4.');
      }

      const mockUser = {
        id: 'user_101',
        name: email.split('@')[0].toUpperCase(),
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      };

      setUser(mockUser);
      await AsyncStorage.setItem('@taskflow_user', JSON.stringify(mockUser));
      
      // Fetch or restore tasks
      const cachedTasks = await AsyncStorage.getItem(\`@taskflow_tasks_\${mockUser.id}\`);
      if (cachedTasks) {
        setTasks(JSON.parse(cachedTasks));
      } else {
        await fetchTasksFromAPI(mockUser.id);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      if (!name || !email || !password) {
        throw new Error('All registration fields are required.');
      }

      const mockUser = {
        id: 'user_' + Date.now(),
        name,
        email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      };

      setUser(mockUser);
      await AsyncStorage.setItem('@taskflow_user', JSON.stringify(mockUser));
      
      // Initialize empty task list for new user
      setTasks([]);
      await AsyncStorage.setItem(\`@taskflow_tasks_\${mockUser.id}\`, JSON.stringify([]));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setUser(null);
      setTasks([]);
      await AsyncStorage.removeItem('@taskflow_user');
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    await AsyncStorage.setItem('@taskflow_theme', nextTheme);
  };

  // Task Mutators
  const addTask = async (taskData) => {
    try {
      const newTask = {
        ...taskData,
        id: 'task_' + Date.now(),
        completed: false,
        createdAt: new Date().toISOString()
      };

      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      
      if (user) {
        await AsyncStorage.setItem(\`@taskflow_tasks_\${user.id}\`, JSON.stringify(updatedTasks));
      }
      return true;
    } catch (err) {
      setError('Failed to save task.');
      return false;
    }
  };

  const editTask = async (id, updatedFields) => {
    try {
      const updatedTasks = tasks.map(t => t.id === id ? { ...t, ...updatedFields } : t);
      setTasks(updatedTasks);

      if (user) {
        await AsyncStorage.setItem(\`@taskflow_tasks_\${user.id}\`, JSON.stringify(updatedTasks));
      }
      return true;
    } catch (err) {
      setError('Failed to update task.');
      return false;
    }
  };

  const deleteTask = async (id) => {
    try {
      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);

      if (user) {
        await AsyncStorage.setItem(\`@taskflow_tasks_\${user.id}\`, JSON.stringify(updatedTasks));
      }
      return true;
    } catch (err) {
      setError('Failed to delete task.');
      return false;
    }
  };

  const toggleCompleteTask = async (id) => {
    try {
      const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      setTasks(updatedTasks);

      if (user) {
        await AsyncStorage.setItem(\`@taskflow_tasks_\${user.id}\`, JSON.stringify(updatedTasks));
      }
      return true;
    } catch (err) {
      setError('Failed to change task status.');
      return false;
    }
  };

  const triggerPullToRefresh = async () => {
    if (user) {
      await fetchTasksFromAPI(user.id);
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      user,
      theme,
      loading,
      error,
      login,
      register,
      logout,
      toggleTheme,
      addTask,
      editTask,
      deleteTask,
      toggleCompleteTask,
      triggerPullToRefresh
    }}>
      {children}
    </TaskContext.Provider>
  );
};`
  },
  {
    name: "api.js",
    path: "src/services/api.js",
    language: "javascript",
    content: `import axios from 'axios';

// Creating a modular Axios service configuration
export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Axios Request Interceptor for logging/token setups
api.interceptors.request.use(
  async (config) => {
    // You could retrieve a bearer token from AsyncStorage here
    // const token = await AsyncStorage.getItem('@taskflow_token');
    // if (token) config.headers.Authorization = \`Bearer \${token}\`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios Response Interceptor for handling global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Service Error:', error.message || error);
    return Promise.reject(error);
  }
);`
  },
  {
    name: "AppNavigator.js",
    path: "src/navigation/AppNavigator.js",
    language: "javascript",
    content: `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTask } from '../context/TaskContext';

// Import Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CompletedTasksScreen from '../screens/CompletedTasksScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import EditTaskScreen from '../screens/EditTaskScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';

// Custom icons or simple vector symbols
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs flow for authenticated users
function AppTabs() {
  const { theme } = useTask();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'list-outline';
          else if (route.name === 'Completed') iconName = 'checkmark-circle-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          borderTopColor: isDark ? '#374151' : '#e5e7eb',
        },
        headerStyle: {
          backgroundColor: isDark ? '#111827' : '#f9fafb',
        },
        headerTintColor: isDark ? '#f3f4f6' : '#111827',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'My Tasks' }} />
      <Tab.Screen name="Completed" component={CompletedTasksScreen} options={{ title: 'Completed' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, theme } = useTask();
  const isDark = theme === 'dark';

  const themeConfig = {
    dark: isDark,
    colors: {
      primary: '#6366f1',
      background: isDark ? '#111827' : '#f3f4f6',
      card: isDark ? '#1f2937' : '#ffffff',
      text: isDark ? '#f3f4f6' : '#111827',
      border: isDark ? '#374151' : '#e5e7eb',
      notification: '#6366f1',
    }
  };

  return (
    <NavigationContainer theme={themeConfig}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
          },
          headerTintColor: isDark ? '#f3f4f6' : '#111827',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {user ? (
          // Protected Main Stack
          <>
            <Stack.Screen name="MainTabs" component={AppTabs} options={{ headerShown: false }} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'New Task' }} />
            <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'Edit Task' }} />
            <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{ title: 'Task Details' }} />
          </>
        ) : (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}`
  },
  {
    name: "HomeScreen.js",
    path: "src/screens/HomeScreen.js",
    language: "javascript",
    content: `import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTask } from '../context/TaskContext';
import { Ionicons } from '@expo/vector-icons';
import TaskCard from '../components/TaskCard';

export default function HomeScreen({ navigation }) {
  const { tasks, theme, loading, triggerPullToRefresh, toggleCompleteTask, deleteTask } = useTask();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['All', 'Work', 'Personal', 'Urgent'];

  // Staggered pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await triggerPullToRefresh();
    setRefreshing(false);
  };

  // Filter tasks based on Search, Completion status, and Categories
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                            task.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
      // Filter out completed tasks from HomeScreen (they have their own dedicated screen)
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
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Mini Stats Banner */}
      <View style={[styles.statsRow, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: '#6366f1' }]}>{stats.pending}</Text>
          <Text style={[styles.statLabel, isDark && styles.textDarkSecondary]}>Pending</Text>
        </View>
        <View style={[styles.divider, isDark && styles.dividerDark]} />
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: '#10b981' }]}>{stats.completed}</Text>
          <Text style={[styles.statLabel, isDark && styles.textDarkSecondary]}>Done</Text>
        </View>
        <View style={[styles.divider, isDark && styles.dividerDark]} />
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: '#f59e0b' }]}>{stats.completionRate}%</Text>
          <Text style={[styles.statLabel, isDark && styles.textDarkSecondary]}>Completed</Text>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={[styles.searchContainer, isDark ? styles.cardDark : styles.cardLight]}>
        <Ionicons name="search-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDark && styles.textDark]}
          placeholder="Search task title or details..."
          placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Category Selector */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.categoryPill,
                  isSelected ? styles.categoryPillActive : (isDark ? styles.categoryPillDark : styles.categoryPillLight)
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  isSelected ? styles.categoryTextActive : (isDark ? styles.textDarkSecondary : styles.textLightSecondary)
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Task List */}
      {loading && filteredTasks.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="journal-outline" size={56} color="#9ca3af" />
              <Text style={[styles.emptyTitle, isDark && styles.textDark]}>No active tasks</Text>
              <Text style={styles.emptySubtitle}>
                {search ? 'Try modifying your search filter.' : 'Tap the floating "+" to create your first task!'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
              onToggleComplete={() => toggleCompleteTask(item.id)}
              onDelete={() => deleteTask(item.id)}
              theme={theme}
            />
          )}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Ionicons name="add" size={30} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', paddingHorizontal: 16, paddingTop: 12 },
  containerDark: { backgroundColor: '#111827' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderRadius: 12, marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardLight: { backgroundColor: '#ffffff' },
  cardDark: { backgroundColor: '#1f2937' },
  statBox: { alignItems: 'center', flex: 1 },
  statNum: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  divider: { width: 1, height: '70%', backgroundColor: '#e5e7eb', alignSelf: 'center' },
  dividerDark: { backgroundColor: '#374151' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, marginBottom: 14, elevation: 1 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827', padding: 0 },
  textDark: { color: '#f3f4f6' },
  textDarkSecondary: { color: '#9ca3af' },
  textLightSecondary: { color: '#6b7280' },
  categoriesWrapper: { marginBottom: 14, height: 40 },
  categoryPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, height: 36, justifyContent: 'center' },
  categoryPillLight: { backgroundColor: '#e5e7eb' },
  categoryPillDark: { backgroundColor: '#374151' },
  categoryPillActive: { backgroundColor: '#6366f1' },
  categoryText: { fontSize: 13, fontWeight: '500' },
  categoryTextActive: { color: '#ffffff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 6 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#6366f1', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }
});`
  },
  {
    name: "TaskCard.js",
    path: "src/components/TaskCard.js",
    language: "javascript",
    content: `import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TaskCard({ task, onPress, onToggleComplete, onDelete, theme }) {
  const isDark = theme === 'dark';

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
        task.completed && styles.cardCompleted
      ]}
    >
      <View style={styles.row}>
        {/* Checkbox Trigger */}
        <TouchableOpacity style={styles.checkbox} onPress={onToggleComplete}>
          <Ionicons
            name={task.completed ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={task.completed ? "#10b981" : (isDark ? "#9ca3af" : "#6b7280")}
          />
        </TouchableOpacity>

        {/* Info Block */}
        <View style={styles.info}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              isDark ? styles.textDark : styles.textLight,
              task.completed && styles.textCompleted
            ]}
          >
            {task.title}
          </Text>
          <Text numberOfLines={1} style={styles.desc}>
            {task.description || 'No description provided.'}
          </Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Ionicons name="calendar-outline" size={12} color="#9ca3af" />
              <Text style={styles.metaText}>{task.dueDate}</Text>
            </View>
            <View style={[styles.metaBadge, styles.catBadge]}>
              <Text style={styles.catText}>{task.category}</Text>
            </View>
          </View>
        </View>

        {/* Priority Side indicator & Delete Action */}
        <View style={styles.rightSide}>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, borderLeftWidth: 4, borderLeftColor: '#6366f1' },
  cardLight: { backgroundColor: '#ffffff' },
  cardDark: { backgroundColor: '#1f2937', borderLeftColor: '#4f46e5' },
  cardCompleted: { opacity: 0.65, borderLeftColor: '#10b981' },
  row: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  textLight: { color: '#111827' },
  textDark: { color: '#f3f4f6' },
  textCompleted: { textDecorationLine: 'line-through', color: '#9ca3af' },
  desc: { fontSize: 12, color: '#6b7280', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  metaText: { fontSize: 10, color: '#6b7280', marginLeft: 3 },
  catBadge: { backgroundColor: '#e0e7ff' },
  catText: { fontSize: 10, color: '#4f46e5', fontWeight: '500' },
  rightSide: { alignItems: 'flex-end', justifyContent: 'space-between', height: 44, marginLeft: 8 },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  deleteButton: { padding: 4 }
});`
  },
  {
    name: "AddTaskScreen.js",
    path: "src/screens/AddTaskScreen.js",
    language: "javascript",
    content: `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTask } from '../context/TaskContext';

export default function AddTaskScreen({ navigation }) {
  const { addTask, theme } = useTask();
  const isDark = theme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const categories = ['Work', 'Personal', 'Urgent'];
  const priorities = ['Low', 'Medium', 'High'];

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter a task title.');
      return;
    }

    const success = await addTask({
      title,
      description,
      category,
      priority,
      dueDate,
      notes
    });

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to save the task.');
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.label, isDark && styles.textDark]}>Task Title *</Text>
      <TextInput
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
        placeholder="e.g. Design app dashboard"
        placeholderTextColor="#9ca3af"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.label, isDark && styles.textDark]}>Description</Text>
      <TextInput
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, styles.textArea]}
        placeholder="Explain task objective or bullet points..."
        placeholderTextColor="#9ca3af"
        multiline
        numberOfLines={3}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={[styles.label, isDark && styles.textDark]}>Category</Text>
      <View style={styles.selectorRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.choiceBtn,
              category === cat ? styles.choiceBtnActive : (isDark ? styles.choiceBtnDark : styles.choiceBtnLight)
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.choiceText, category === cat && styles.choiceTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, isDark && styles.textDark]}>Priority Level</Text>
      <View style={styles.selectorRow}>
        {priorities.map((prio) => (
          <TouchableOpacity
            key={prio}
            style={[
              styles.choiceBtn,
              priority === prio ? styles.choiceBtnActive : (isDark ? styles.choiceBtnDark : styles.choiceBtnLight)
            ]}
            onPress={() => setPriority(prio)}
          >
            <Text style={[styles.choiceText, priority === prio && styles.choiceTextActive]}>{prio}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, isDark && styles.textDark]}>Due Date (YYYY-MM-DD)</Text>
      <TextInput
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#9ca3af"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <Text style={[styles.label, isDark && styles.textDark]}>Additional Notes</Text>
      <TextInput
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, styles.textArea]}
        placeholder="Passwords, reference URLs, contact info, etc..."
        placeholderTextColor="#9ca3af"
        multiline
        numberOfLines={2}
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Create Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  containerDark: { backgroundColor: '#111827' },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  textDark: { color: '#f3f4f6' },
  input: { padding: 12, borderRadius: 8, fontSize: 14, marginBottom: 8, borderWidth: 1 },
  inputLight: { backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#111827' },
  inputDark: { backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' },
  textArea: { height: 80, textAlignVertical: 'top' },
  selectorRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  choiceBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  choiceBtnLight: { backgroundColor: '#e5e7eb' },
  choiceBtnDark: { backgroundColor: '#374151' },
  choiceBtnActive: { backgroundColor: '#6366f1', borderColor: '#4f46e5' },
  choiceText: { fontSize: 12, fontWeight: '500', color: '#4b5563' },
  choiceTextActive: { color: '#ffffff' },
  saveBtn: { backgroundColor: '#6366f1', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 50 },
  saveBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '600' }
});`
  },
  {
    name: "EditTaskScreen.js",
    path: "src/screens/EditTaskScreen.js",
    language: "javascript",
    content: `import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTask } from '../context/TaskContext';

export default function EditTaskScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { tasks, editTask, theme } = useTask();
  const isDark = theme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const categories = ['Work', 'Personal', 'Urgent'];
  const priorities = ['Low', 'Medium', 'High'];

  // Load current task properties
  useEffect(() => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategory(task.category);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setNotes(task.notes || '');
    }
  }, [taskId, tasks]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter a task title.');
      return;
    }

    const success = await editTask(taskId, {
      title,
      description,
      category,
      priority,
      dueDate,
      notes
    });

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to update task.');
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.label, isDark && styles.textDark]}>Task Title *</Text>
      <TextInput
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.label, isDark && styles.textDark]}>Description</Text>
      <TextInput
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, styles.textArea]}
        multiline
        numberOfLines={3}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={[styles.label, isDark && styles.textDark]}>Category</Text>
      <View style={styles.selectorRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.choiceBtn,
              category === cat ? styles.choiceBtnActive : (isDark ? styles.choiceBtnDark : styles.choiceBtnLight)
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.choiceText, category === cat && styles.choiceTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, isDark && styles.textDark]}>Priority Level</Text>
      <View style={styles.selectorRow}>
        {priorities.map((prio) => (
          <TouchableOpacity
            key={prio}
            style={[
              styles.choiceBtn,
              priority === prio ? styles.choiceBtnActive : (isDark ? styles.choiceBtnDark : styles.choiceBtnLight)
            ]}
            onPress={() => setPriority(prio)}
          >
            <Text style={[styles.choiceText, priority === prio && styles.choiceTextActive]}>{prio}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, isDark && styles.textDark]}>Due Date</Text>
      <TextInput
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
        value={dueDate}
        onChangeText={setDueDate}
      />

      <Text style={[styles.label, isDark && styles.textDark]}>Additional Notes</Text>
      <TextInput
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, styles.textArea]}
        multiline
        numberOfLines={2}
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  containerDark: { backgroundColor: '#111827' },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  textDark: { color: '#f3f4f6' },
  input: { padding: 12, borderRadius: 8, fontSize: 14, marginBottom: 8, borderWidth: 1 },
  inputLight: { backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#111827' },
  inputDark: { backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' },
  textArea: { height: 80, textAlignVertical: 'top' },
  selectorRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  choiceBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  choiceBtnLight: { backgroundColor: '#e5e7eb' },
  choiceBtnDark: { backgroundColor: '#374151' },
  choiceBtnActive: { backgroundColor: '#6366f1', borderColor: '#4f46e5' },
  choiceText: { fontSize: 12, fontWeight: '500', color: '#4b5563' },
  choiceTextActive: { color: '#ffffff' },
  saveBtn: { backgroundColor: '#6366f1', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 50 },
  saveBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '600' }
});`
  },
  {
    name: "TaskDetailsScreen.js",
    path: "src/screens/TaskDetailsScreen.js",
    language: "javascript",
    content: `import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTask } from '../context/TaskContext';
import { Ionicons } from '@expo/vector-icons';

export default function TaskDetailsScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { tasks, theme, toggleCompleteTask, deleteTask } = useTask();
  const isDark = theme === 'dark';

  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId]);

  if (!task) {
    return (
      <View style={[styles.centered, isDark && styles.containerDark]}>
        <Text style={[styles.errorText, isDark && styles.textDark]}>Task not found or was deleted.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to permanently delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
            navigation.goBack();
          } 
        }
      ]
    );
  };

  const handleToggleComplete = async () => {
    await toggleCompleteTask(task.id);
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      {/* Header Info */}
      <View style={[styles.headerCard, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: '#e0e7ff' }]}>
            <Text style={{ color: '#4f46e5', fontSize: 11, fontWeight: '600' }}>{task.category}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: task.priority === 'High' ? '#fee2e2' : task.priority === 'Medium' ? '#fef3c7' : '#dbeafe' }]}>
            <Text style={{ color: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#d97706' : '#2563eb', fontSize: 11, fontWeight: '600' }}>
              {task.priority} Priority
            </Text>
          </View>
        </View>

        <Text style={[styles.title, isDark && styles.textDark, task.completed && styles.textCompleted]}>
          {task.title}
        </Text>
        
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
          <Text style={styles.dueDateText}>Due date: {task.dueDate}</Text>
        </View>

        <View style={[styles.statusBanner, task.completed ? styles.statusSuccess : styles.statusPending]}>
          <Ionicons name={task.completed ? "checkmark-circle-outline" : "ellipse-outline"} size={18} color={task.completed ? "#10b981" : "#d97706"} />
          <Text style={[styles.statusText, { color: task.completed ? "#047857" : "#b45309" }]}>
            {task.completed ? 'Completed' : 'Pending Action'}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={[styles.sectionLabel, isDark && styles.textDark]}>DESCRIPTION</Text>
      <View style={[styles.sectionCard, isDark ? styles.cardDark : styles.cardLight]}>
        <Text style={[styles.descriptionText, isDark && styles.textDarkSecondary]}>
          {task.description || 'No detailed description specified.'}
        </Text>
      </View>

      {/* Additional Notes */}
      {task.notes && (
        <>
          <Text style={[styles.sectionLabel, isDark && styles.textDark]}>MEMO & NOTES</Text>
          <View style={[styles.sectionCard, isDark ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.notesText, isDark && styles.textDarkSecondary]}>{task.notes}</Text>
          </View>
        </>
      )}

      {/* Interactive Command Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.completeBtn]} onPress={handleToggleComplete}>
          <Ionicons name={task.completed ? "arrow-undo-outline" : "checkmark-done"} size={20} color="#ffffff" />
          <Text style={styles.actionBtnText}>{task.completed ? 'Reopen' : 'Complete'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={() => navigation.navigate('EditTask', { taskId: task.id })}>
          <Ionicons name="create-outline" size={20} color="#ffffff" />
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#ffffff" />
          <Text style={styles.actionBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  containerDark: { backgroundColor: '#111827' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: 16, color: '#6b7280', marginBottom: 12 },
  backBtn: { backgroundColor: '#6366f1', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  backBtnText: { color: '#ffffff', fontWeight: '500' },
  headerCard: { padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardLight: { backgroundColor: '#ffffff' },
  cardDark: { backgroundColor: '#1f2937' },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 10 },
  textDark: { color: '#f3f4f6' },
  textDarkSecondary: { color: '#9ca3af' },
  textCompleted: { textDecorationLine: 'line-through', color: '#9ca3af' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  dueDateText: { fontSize: 13, color: '#6b7280' },
  statusBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, alignSelf: 'flex-start' },
  statusSuccess: { backgroundColor: '#d1fae5' },
  statusPending: { backgroundColor: '#fef3c7' },
  statusText: { fontSize: 12, fontWeight: '600' },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#6b7280', marginTop: 12, marginBottom: 6, letterSpacing: 1 },
  sectionCard: { padding: 14, borderRadius: 10, marginBottom: 14 },
  descriptionText: { fontSize: 14, color: '#4b5563', lineHeight: 20 },
  notesText: { fontSize: 13, color: '#4b5563', fontFamily: 'monospace' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 24, marginBottom: 50 },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 12, borderRadius: 8, elevation: 2 },
  completeBtn: { backgroundColor: '#10b981' },
  editBtn: { backgroundColor: '#6366f1' },
  deleteBtn: { backgroundColor: '#ef4444' },
  actionBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '600' }
});`
  },
  {
    name: "CompletedTasksScreen.js",
    path: "src/screens/CompletedTasksScreen.js",
    language: "javascript",
    content: `import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTask } from '../context/TaskContext';
import { Ionicons } from '@expo/vector-icons';
import TaskCard from '../components/TaskCard';

export default function CompletedTasksScreen({ navigation }) {
  const { tasks, theme, toggleCompleteTask, deleteTask } = useTask();
  const isDark = theme === 'dark';

  const completedTasks = useMemo(() => {
    return tasks.filter(task => task.completed);
  }, [tasks]);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={56} color="#9ca3af" />
            <Text style={[styles.emptyTitle, isDark && styles.textDark]}>No tasks completed yet</Text>
            <Text style={styles.emptySubtitle}>
              Keep pushing! Once you finish active tasks, they will appear securely archived here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
            onToggleComplete={() => toggleCompleteTask(item.id)}
            onDelete={() => deleteTask(item.id)}
            theme={theme}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', paddingHorizontal: 16, paddingTop: 12 },
  containerDark: { backgroundColor: '#111827' },
  emptyContainer: { alignItems: 'center', marginTop: 100, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 6 },
  textDark: { color: '#f3f4f6' }
});`
  },
  {
    name: "ProfileScreen.js",
    path: "src/screens/ProfileScreen.js",
    language: "javascript",
    content: `import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useTask } from '../context/TaskContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout, theme, toggleTheme, tasks } = useTask();
  const isDark = theme === 'dark';

  // Calculate high-fidelity profile task statistics
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
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Profile Bio Card */}
      <View style={[styles.profileCard, isDark ? styles.cardDark : styles.cardLight]}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={[styles.name, isDark && styles.textDark]}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Preferences Section */}
      <Text style={[styles.sectionTitle, isDark && styles.textDark]}>PREFERENCES</Text>
      <View style={[styles.prefCard, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.prefRow}>
          <View style={styles.prefLeft}>
            <Ionicons name="moon-outline" size={20} color={isDark ? '#f3f4f6' : '#111827'} />
            <Text style={[styles.prefText, isDark && styles.textDark]}>Dark Mode</Text>
          </View>
          <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#767577', true: '#818cf8' }} thumbColor={isDark ? '#6366f1' : '#f4f3f4'} />
        </View>
      </View>

      {/* Task Breakdown Stats */}
      <Text style={[styles.sectionTitle, isDark && styles.textDark]}>PERFORMANCE ANALYSIS</Text>
      <View style={[styles.statsCard, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.statBreakdownRow}>
          <Text style={[styles.breakdownLabel, isDark && styles.textDarkSecondary]}>Total Tasks Created</Text>
          <Text style={[styles.breakdownValue, isDark && styles.textDark]}>{stats.total}</Text>
        </View>
        <View style={[styles.itemDivider, isDark && styles.itemDividerDark]} />
        <View style={styles.statBreakdownRow}>
          <Text style={[styles.breakdownLabel, isDark && styles.textDarkSecondary]}>Total Completed Archive</Text>
          <Text style={[styles.breakdownValue, { color: '#10b981' }]}>{stats.completed}</Text>
        </View>
        <View style={[styles.itemDivider, isDark && styles.itemDividerDark]} />
        <View style={styles.statBreakdownRow}>
          <Text style={[styles.breakdownLabel, isDark && styles.textDarkSecondary]}>Work Category</Text>
          <Text style={[styles.breakdownValue, isDark && styles.textDark]}>{stats.workCount} tasks</Text>
        </View>
        <View style={[styles.itemDivider, isDark && styles.itemDividerDark]} />
        <View style={styles.statBreakdownRow}>
          <Text style={[styles.breakdownLabel, isDark && styles.textDarkSecondary]}>Personal Category</Text>
          <Text style={[styles.breakdownValue, isDark && styles.textDark]}>{stats.personalCount} tasks</Text>
        </View>
        <View style={[styles.itemDivider, isDark && styles.itemDividerDark]} />
        <View style={styles.statBreakdownRow}>
          <Text style={[styles.breakdownLabel, isDark && styles.textDarkSecondary]}>Urgent Category</Text>
          <Text style={[styles.breakdownValue, { color: '#ef4444', fontWeight: 'bold' }]}>{stats.urgentCount} tasks</Text>
        </View>
      </View>

      {/* Logout Action */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#ffffff" style={{ marginRight: 6 }} />
        <Text style={styles.logoutText}>Sign Out Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  containerDark: { backgroundColor: '#111827' },
  profileCard: { padding: 24, borderRadius: 12, alignItems: 'center', marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardLight: { backgroundColor: '#ffffff' },
  cardDark: { backgroundColor: '#1f2937' },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12, borderWidth: 2, borderColor: '#6366f1' },
  name: { fontSize: 18, fontWeight: '700', color: '#111827' },
  email: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 1, marginBottom: 8, marginTop: 12 },
  prefCard: { borderRadius: 10, padding: 12, marginBottom: 16 },
  prefRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prefLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  prefText: { fontSize: 14, fontWeight: '500', color: '#111827' },
  statsCard: { borderRadius: 10, padding: 16, marginBottom: 24 },
  statBreakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  breakdownLabel: { fontSize: 13, color: '#4b5563' },
  breakdownValue: { fontSize: 13, fontWeight: '600', color: '#111827' },
  itemDivider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 8 },
  itemDividerDark: { backgroundColor: '#374151' },
  logoutBtn: { backgroundColor: '#ef4444', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 10, marginTop: 10 },
  logoutText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  textDark: { color: '#f3f4f6' },
  textDarkSecondary: { color: '#9ca3af' }
});`
  },
  {
    name: "LoginScreen.js",
    path: "src/screens/LoginScreen.js",
    language: "javascript",
    content: `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { useTask } from '../context/TaskContext';

export default function LoginScreen({ navigation }) {
  const { login, error, loading } = useTask();
  const [email, setEmail] = useState('developer@taskflow.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both your email and password.');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      Alert.alert('Login Failed', error || 'Invalid email or password.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Branding Logo Block */}
      <View style={styles.logoBlock}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80' }}
          style={styles.logoImage}
        />
        <Text style={styles.logoTitle}>TaskFlow</Text>
        <Text style={styles.logoSubtitle}>A Resume Portfolio Mobile Project Workspace</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in with your mock credentials below</Text>

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholder="developer@taskflow.com"
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.loginText}>Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.regTrigger} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.regTriggerText}>Don't have an account? <Text style={{ color: '#6366f1', fontWeight: 'bold' }}>Register Here</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', justifyContent: 'center', padding: 20 },
  logoBlock: { alignItems: 'center', marginBottom: 24 },
  logoImage: { width: 64, height: 64, borderRadius: 16, marginBottom: 8 },
  logoTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  logoSubtitle: { fontSize: 11, color: '#6b7280', letterSpacing: 0.5 },
  formCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#6b7280', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 4 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#111827', marginBottom: 14 },
  errorText: { color: '#ef4444', fontSize: 12, marginBottom: 14, fontWeight: '500' },
  loginButton: { backgroundColor: '#6366f1', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  loginText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  regTrigger: { marginTop: 16, alignItems: 'center' },
  regTriggerText: { fontSize: 12, color: '#4b5563' }
});`
  },
  {
    name: "RegisterScreen.js",
    path: "src/screens/RegisterScreen.js",
    language: "javascript",
    content: `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useTask } from '../context/TaskContext';

export default function RegisterScreen({ navigation }) {
  const { register, error, loading } = useTask();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please fill in all registration fields.');
      return;
    }

    const success = await register(name, email, password);
    if (!success) {
      Alert.alert('Registration Failed', error || 'Failed to register account.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.title}>Register Account</Text>
        <Text style={styles.subtitle}>Create a new mock user session for testing</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Jane Doe"
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholder="developer@taskflow.com"
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          placeholder="Min 6 characters"
          placeholderTextColor="#9ca3af"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.registerText}>Register & Log In</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', justifyContent: 'center', padding: 20 },
  formCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#6b7280', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 4 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#111827', marginBottom: 14 },
  errorText: { color: '#ef4444', fontSize: 12, marginBottom: 14, fontWeight: '500' },
  registerButton: { backgroundColor: '#6366f1', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  registerText: { color: '#ffffff', fontSize: 15, fontWeight: '600' }
});`
  }
];
