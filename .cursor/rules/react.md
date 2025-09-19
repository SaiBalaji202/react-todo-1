# React Rules

## Component Structure
- Use functional components with hooks
- Keep components small and focused (single responsibility)
- Extract complex logic into custom hooks
- Use proper key props for list items

## Performance Optimization
```typescript
// ✅ Good: Memoized components
const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [todo.id, onToggle]);

  return (
    <div className="flex items-center justify-between p-4">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      <span>{todo.title}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});

// ❌ Bad: Unnecessary re-renders
const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)} // New function every render
      />
      <span>{todo.title}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
};
```

## State Management
- Use `useState` for local component state
- Use `useReducer` for complex state logic
- Use React Query for server state
- Avoid prop drilling - use context when needed

## Event Handling
```typescript
// ✅ Good: Proper event handling
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Handle form submission
};

// ❌ Bad: Missing event type
const handleSubmit = (e) => {
  e.preventDefault();
  // Handle form submission
};
```
