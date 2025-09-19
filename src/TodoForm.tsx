import React, { useRef } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useAddTodo } from "./hooks/useAddTodo";

export default function TodoForm() {
  const todoRef = useRef<HTMLInputElement>(null);
  const addTodo = useAddTodo(() => {
    if (todoRef.current) {
      todoRef.current.value = "";
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (todoRef.current?.value) {
      addTodo.mutate({
        id: 0,
        title: todoRef.current.value,
        completed: false,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {addTodo.error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          ⚠️ {addTodo.error.message}
        </div>
      )}

      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-md">
          <Input
            type="text"
            ref={todoRef}
            placeholder="✨ Add a new task..."
            className="flex-1 h-11 border-2 focus:border-blue-500 transition-colors"
            disabled={addTodo.isPending}
          />
          <Button
            type="submit"
            disabled={addTodo.isPending}
            className="h-11 px-6 hover:scale-105 transition-transform"
          >
            {addTodo.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </>
            ) : (
              "➕ Add"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
