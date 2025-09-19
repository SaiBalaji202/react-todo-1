import React from "react";
import useTodos from "./hooks/useTodos";

const TodoList = () => {
  const { data: todos, isLoading, error } = useTodos();

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            {todo.title} {todo.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
