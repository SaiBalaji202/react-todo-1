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
    <>
      {addTodo.error && (
        <div className="text-red-500">{addTodo.error.message}</div>
      )}

      <div className="flex justify-center" onSubmit={handleSubmit}>
        <form className="flex gap-2">
          <Input type="text" ref={todoRef} placeholder="Add a new todo" />
          <Button type="submit" disabled={addTodo.isPending}>
            {addTodo.isPending ? "Adding..." : "Add"}
          </Button>
        </form>
      </div>
    </>
  );
}
