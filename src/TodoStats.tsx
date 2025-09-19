import React, { useState, useEffect, useMemo } from "react";

interface TodoStatsProps {
  todos: any[];
  filteredTodos: any[];
}

const TodoStats: React.FC<TodoStatsProps> = ({ todos, filteredTodos }) => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
    lastUpdated: Date.now(),
  });

  // Memoized calculation to prevent unnecessary recalculations
  const calculatedStats = useMemo(() => {
    if (!todos)
      return { total: 0, completed: 0, pending: 0, completionRate: 0 };

    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return { total, completed, pending, completionRate };
  }, [todos]);

  // Update stats when calculations change
  useEffect(() => {
    setStats((prevStats) => ({
      ...calculatedStats,
      lastUpdated: prevStats.lastUpdated, // Preserve lastUpdated
    }));
  }, [calculatedStats]);

  // Fixed memory leak - properly cleanup interval
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) => ({
        ...prevStats,
        lastUpdated: Date.now(),
      }));
    }, 1000);

    // Properly cleanup the interval to prevent memory leak
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        📊 Task Statistics
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-100 rounded-lg border border-blue-200">
          <div className="text-3xl font-bold text-blue-800 mb-1">
            {stats.total}
          </div>
          <div className="text-sm font-bold text-blue-900">📋 Total Tasks</div>
        </div>
        <div className="text-center p-4 bg-green-100 rounded-lg border border-green-200">
          <div className="text-3xl font-bold text-green-800 mb-1">
            {stats.completed}
          </div>
          <div className="text-sm font-bold text-green-900">✅ Completed</div>
        </div>
        <div className="text-center p-4 bg-orange-100 rounded-lg border border-orange-200">
          <div className="text-3xl font-bold text-orange-800 mb-1">
            {stats.pending}
          </div>
          <div className="text-sm font-bold text-orange-900">⏳ Pending</div>
        </div>
        <div className="text-center p-4 bg-purple-100 rounded-lg border border-purple-200">
          <div className="text-3xl font-bold text-purple-800 mb-1">
            {stats.completionRate.toFixed(1)}%
          </div>
          <div className="text-sm font-bold text-purple-900">🎯 Progress</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="font-medium text-gray-700">Overall Progress</span>
          <span className="text-gray-500">
            {stats.completionRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Filter Status */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-center text-gray-600">
          <span className="font-medium">
            📋 Showing {filteredTodos?.length || 0} of {stats.total} tasks
          </span>
        </div>
      </div>
    </div>
  );
};

export default TodoStats;
