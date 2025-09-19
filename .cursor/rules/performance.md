# Performance Rules

## Bundle Optimization
- Use dynamic imports for code splitting
- Optimize images and assets
- Minimize bundle size
- Use tree shaking

## React Performance
```typescript
// ✅ Good: Memoized expensive calculations
const TodoList = ({ todos }) => {
  const completedCount = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  return (
    <div>
      <p>Completed: {completedCount}</p>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

// ❌ Bad: Recalculating on every render
const TodoList = ({ todos }) => {
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div>
      <p>Completed: {completedCount}</p>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
```

## Network Optimization
- Use React Query for caching
- Implement proper loading states
- Handle offline scenarios
- Optimize API calls

## Memory Management
- Clean up event listeners
- Avoid memory leaks
- Use proper cleanup in useEffect
- Dispose of subscriptions

## Rendering Optimization
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Optimize re-renders
- Use proper key props
