import React, { useState, useEffect } from "react";
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
    completionRate: 0,
  });

  // BUG: This effect runs on every render, causing performance issues
  useEffect(() => {
    if (!todos) return;

    // BUG: Inefficient calculation - should be memoized
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    setStats({ total, completed, pending, completionRate });
  }, [todos]); // BUG: Missing filteredTodos dependency

  // BUG: Memory leak - this interval is never cleaned up
  useEffect(() => {
    const interval = setInterval(() => {
      // BUG: This causes unnecessary re-renders every second
      setStats((prevStats) => ({
        ...prevStats,
        lastUpdated: Date.now(),
      }));
    }, 1000);

    // BUG: Missing cleanup function
    // return () => clearInterval(interval);
  }, []);

  // BUG: This function is recreated on every render
  const handleRefresh = () => {
    // BUG: This doesn't actually refresh anything
    console.log("Refreshing stats...");
    setStats((prevStats) => ({ ...prevStats }));
  };

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
