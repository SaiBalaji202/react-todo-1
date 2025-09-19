import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TodoStatsProps {
  todos: any[];
  filteredTodos: any[];
}

const TodoStats: React.FC<TodoStatsProps> = ({ todos, filteredTodos }) => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  });

  // BUG: This effect runs on every render, causing performance issues
  useEffect(() => {
    if (!todos) return;
    
    // BUG: Inefficient calculation - should be memoized
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    setStats({ total, completed, pending, completionRate });
  }, [todos]); // BUG: Missing filteredTodos dependency

  // BUG: Memory leak - this interval is never cleaned up
  useEffect(() => {
    const interval = setInterval(() => {
      // BUG: This causes unnecessary re-renders every second
      setStats(prevStats => ({
        ...prevStats,
        lastUpdated: Date.now()
      }));
    }, 1000);

    // BUG: Missing cleanup function
    // return () => clearInterval(interval);
  }, []);

  // BUG: This function is recreated on every render
  const handleRefresh = () => {
    // BUG: This doesn't actually refresh anything
    console.log('Refreshing stats...');
    setStats(prevStats => ({ ...prevStats }));
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Todo Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.completionRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
        
        {/* BUG: This button causes unnecessary re-renders */}
        <button 
          onClick={handleRefresh}
          className="mt-4 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Refresh Stats
        </button>
        
        {/* BUG: This shows filtered count but doesn't update when filteredTodos changes */}
        <div className="mt-2 text-sm text-gray-500 text-center">
          Showing {filteredTodos?.length || 0} of {stats.total} todos
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoStats;
