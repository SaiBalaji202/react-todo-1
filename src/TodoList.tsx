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
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());
  
  // BUG: Performance issue - storing large objects in localStorage on every render
  const [, setUserPreferences] = useLocalStorage('todo-preferences', {
    searchTerm: '',
    filterStatus: 'all',
    sortOrder: 'asc',
    selectedTodos: [] as number[],
    lastUpdated: Date.now()
  });
  
  // BUG: Performance issue - this effect runs on every render and causes unnecessary re-renders
  useEffect(() => {
    // BUG: This creates a new object on every render, causing infinite re-renders
    setUserPreferences({
      searchTerm,
      filterStatus,
      sortOrder,
      selectedTodos: Array.from(selectedTodos),
      lastUpdated: Date.now()
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
  
  console.log("Refetching", isRefetching, "Expensive result:", expensiveComputation);

  // BUG: Case-sensitive search - should be case-insensitive
  const filteredTodos = useMemo(() => {
    if (!todos) return [];
    
    let filtered = todos.filter(todo => {
      // BUG: This is case-sensitive, should use toLowerCase()
      const matchesSearch = todo.title.includes(searchTerm);
      const matchesFilter = filterStatus === "all" || 
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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* BUG: TodoStats component has multiple performance issues */}
      <TodoStats todos={todos || []} filteredTodos={filteredTodos} />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Todo List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search todos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "completed" | "pending")}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="px-3 py-2 border rounded-md"
              >
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>
            
            {/* Bulk Actions */}
            {selectedTodos.size > 0 && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                <span className="text-sm text-blue-700">
                  {selectedTodos.size} selected
                </span>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    // BUG: Memory leak - not clearing selectedTodos after deletion
                    console.log("Deleting todos:", Array.from(selectedTodos));
                    // In a real app, this would call a delete API
                  }}
                >
                  Delete Selected
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedTodos(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              Loading todos...
            </div>
          )}

          {error && (
            <div className="text-center py-4 text-destructive">
              Error: {error.message}
            </div>
          )}

          <div className="space-y-2">
            {filteredTodos.map((todo, index) => (
              <Card 
                key={todo.id} 
                className={`p-4 transition-all duration-300 ${
                  selectedTodos.has(todo.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                style={{
                  // BUG: Performance issue - inline styles cause re-renders
                  animationDelay: `${index * 100}ms`,
                  // BUG: This creates a new object on every render
                  transform: `translateY(${Math.sin(Date.now() / 1000 + index) * 2}px)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                      className="w-4 h-4"
                    />
                    <span
                      className={
                        todo.completed ? "line-through text-muted-foreground" : ""
                      }
                    >
                      {todo.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {todo.completed ? "✅" : "❌"}
                    </span>
                    <Button variant="outline" size="sm">
                      {todo.completed ? "Undo" : "Complete"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {filteredTodos.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || filterStatus !== "all" 
                  ? "No todos match your criteria" 
                  : "No todos found"
                }
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoList;
