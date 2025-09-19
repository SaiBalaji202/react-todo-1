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
    <div className="space-y-4">
      {addTodo.error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {addTodo.error.message}
        </div>
      )}

      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          type="text"
          ref={todoRef}
          placeholder="Add a new todo..."
          className="flex-1"
        />
        <Button type="submit" disabled={addTodo.isPending}>
          {addTodo.isPending ? "Adding..." : "Add Todo"}
        </Button>
      </form>
    </div>
  );
}
