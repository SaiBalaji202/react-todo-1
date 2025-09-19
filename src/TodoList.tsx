import { useState, useMemo, useEffect } from "react";
import useTodos from "./hooks/useTodos";
import useLocalStorage from "./hooks/useLocalStorage";
import TodoStats from "./TodoStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TodoList = () => {
  const { data: todos, isLoading, isRefetching, error } = useTodos();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "pending"
  >("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());

  // BUG: Performance issue - storing large objects in localStorage on every render
  const [, setUserPreferences] = useLocalStorage("todo-preferences", {
    searchTerm: "",
    filterStatus: "all",
    sortOrder: "asc",
    selectedTodos: [] as number[],
    lastUpdated: Date.now(),
  });

  // BUG: Performance issue - this effect runs on every render and causes unnecessary re-renders
  useEffect(() => {
    // BUG: This creates a new object on every render, causing infinite re-renders
    setUserPreferences({
      searchTerm,
      filterStatus,
      sortOrder,
      selectedTodos: Array.from(selectedTodos),
      lastUpdated: Date.now(),
    });
  }, [searchTerm, filterStatus, sortOrder, selectedTodos, setUserPreferences]);

  // BUG: Performance issue - expensive computation on every render
  const expensiveComputation = useMemo(() => {
    // Simulate expensive computation that should be memoized properly
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  }, [todos]); // BUG: Should depend on todos but computation doesn't use todos

  console.log(
    "Refetching",
    isRefetching,
    "Expensive result:",
    expensiveComputation
  );

  // BUG: Case-sensitive search - should be case-insensitive
  const filteredTodos = useMemo(() => {
    if (!todos) return [];

    let filtered = todos.filter((todo) => {
      // BUG: This is case-sensitive, should use toLowerCase()
      const matchesSearch = todo.title.includes(searchTerm);
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "completed" && todo.completed) ||
        (filterStatus === "pending" && !todo.completed);

      return matchesSearch && matchesFilter;
    });

    // BUG: Sort order is reversed - asc should be A-Z, desc should be Z-A
    filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return b.title.localeCompare(a.title); // BUG: Should be a.title.localeCompare(b.title)
      } else {
        return a.title.localeCompare(b.title); // BUG: Should be b.title.localeCompare(a.title)
      }
    });

    return filtered;
  }, [todos, searchTerm, filterStatus, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Todo Manager
          </h1>
          <p className="text-gray-600">
            Stay organized and productive with your tasks
          </p>
        </div>

        {/* BUG: TodoStats component has multiple performance issues */}
        <TodoStats todos={todos || []} filteredTodos={filteredTodos} />

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Tasks</h2>
          <CardContent className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="🔍 Search your tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 h-12 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors shadow-sm"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(
                        e.target.value as "all" | "completed" | "pending"
                      )
                    }
                    className="px-4 py-3 h-12 border-2 border-gray-300 rounded-lg bg-white text-gray-900 hover:border-blue-400 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer shadow-sm font-medium"
                  >
                    <option value="all">📋 All Tasks</option>
                    <option value="completed">✅ Completed</option>
                    <option value="pending">⏳ Pending</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value as "asc" | "desc")
                    }
                    className="px-4 py-3 h-12 border-2 border-gray-300 rounded-lg bg-white text-gray-900 hover:border-blue-400 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer shadow-sm font-medium"
                  >
                    <option value="asc">🔤 A-Z</option>
                    <option value="desc">🔤 Z-A</option>
                  </select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedTodos.size > 0 && (
                <div className="flex items-center justify-between gap-4 p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-800">
                      🎯 {selectedTodos.size} task
                      {selectedTodos.size > 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        // BUG: Memory leak - not clearing selectedTodos after deletion
                        console.log(
                          "Deleting todos:",
                          Array.from(selectedTodos)
                        );
                        // In a real app, this would call a delete API
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      🗑️ Delete Selected
                    </button>
                    <button
                      onClick={() => setSelectedTodos(new Set())}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition-colors"
                    >
                      ✨ Clear Selection
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg">Loading your tasks...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="inline-flex flex-col items-center gap-3 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <span className="text-2xl">⚠️</span>
                  <div className="text-red-700 dark:text-red-300">
                    <div className="font-semibold">
                      Oops! Something went wrong
                    </div>
                    <div className="text-sm">{error.message}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedTodos.has(todo.id)
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  } ${todo.completed ? "bg-gray-50" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedTodos.has(todo.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedTodos);
                          if (e.target.checked) {
                            newSelected.add(todo.id);
                          } else {
                            newSelected.delete(todo.id);
                          }
                          setSelectedTodos(newSelected);
                        }}
                        className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                      />
                      <div className="flex-1">
                        <span
                          className={`text-lg font-medium ${
                            todo.completed
                              ? "line-through text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {todo.title}
                        </span>
                        {todo.completed && (
                          <div className="text-sm text-green-700 mt-1 font-medium">
                            ✨ Completed!
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          todo.completed
                            ? "bg-green-200 text-green-800"
                            : "bg-orange-200 text-orange-800"
                        }`}
                      >
                        {todo.completed ? "✅ Done" : "⏳ Pending"}
                      </div>
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          todo.completed
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {todo.completed ? "↩️ Undo" : "✅ Complete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredTodos.length === 0 && !isLoading && (
                <div className="text-center py-16">
                  <div className="inline-flex flex-col items-center gap-4 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="text-6xl">
                      {searchTerm || filterStatus !== "all" ? "🔍" : "📝"}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                        {searchTerm || filterStatus !== "all"
                          ? "No tasks match your criteria"
                          : "No tasks yet"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchTerm || filterStatus !== "all"
                          ? "Try adjusting your search or filter settings"
                          : "Create your first task to get started!"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
