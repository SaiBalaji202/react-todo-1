# 🐛 BugBot Review Guidelines

## Overview

This document outlines the review guidelines and best practices for the Todo App project. Use this as a reference when conducting code reviews, identifying issues, and maintaining code quality.

## 🎯 Review Checklist

### Code Quality

- [ ] **TypeScript**: All components are properly typed
- [ ] **React Best Practices**: Hooks are used correctly, no unnecessary re-renders
- [ ] **Performance**: Components are optimized with proper memoization
- [ ] **Accessibility**: ARIA labels and semantic HTML are used
- [ ] **Error Handling**: Proper error boundaries and user feedback

### Styling & UI

- [ ] **Tailwind CSS**: Classes are used consistently and efficiently
- [ ] **Responsive Design**: Components work across all screen sizes
- [ ] **Design System**: Colors, spacing, and typography follow the design tokens
- [ ] **Dark Mode**: Proper color scheme support
- [ ] **Animations**: Smooth transitions and loading states

### Functionality

- [ ] **Todo CRUD**: Create, Read, Update, Delete operations work correctly
- [ ] **State Management**: React Query is used properly for server state
- [ ] **Form Validation**: Input validation and error messages
- [ ] **Loading States**: Proper loading indicators
- [ ] **Error States**: User-friendly error messages

## 🔍 Common Issues to Watch For

### Performance Issues

```typescript
// ❌ Bad: Unnecessary re-renders
const TodoList = () => {
  const [todos, setTodos] = useState([]);

  // This creates a new function on every render
  const handleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onComplete={handleComplete} // New function every render
        />
      ))}
    </div>
  );
};

// ✅ Good: Memoized callback
const TodoList = () => {
  const [todos, setTodos] = useState([]);

  const handleComplete = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onComplete={handleComplete} // Stable reference
        />
      ))}
    </div>
  );
};
```

### Styling Issues

```typescript
// ❌ Bad: Inline styles and inconsistent spacing
<div style={{ padding: '10px', margin: '5px' }}>
  <button className="bg-blue-500 text-white px-4 py-2">
    Add Todo
  </button>
</div>

// ✅ Good: Consistent Tailwind classes
<div className="p-4 m-2">
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
    Add Todo
  </button>
</div>
```

### Error Handling

```typescript
// ❌ Bad: No error handling
const TodoForm = () => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTodo({ title }); // Could throw
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
};

// ✅ Good: Proper error handling
const TodoForm = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await addTodo({ title });
      setTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-destructive text-sm mb-2">{error}</div>}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
        className="border border-input rounded-md px-3 py-2"
      />
      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md disabled:opacity-50"
      >
        {isLoading ? "Adding..." : "Add"}
      </button>
    </form>
  );
};
```

## 🚀 Best Practices

### Component Structure

```typescript
// ✅ Good: Proper component organization
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-4 h-4 text-primary"
        />
        <span
          className={todo.completed ? "line-through text-muted-foreground" : ""}
        >
          {todo.title}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-destructive hover:text-destructive/80"
      >
        Delete
      </button>
    </div>
  );
};
```

### Custom Hooks

```typescript
// ✅ Good: Custom hook for todo operations
const useTodos = () => {
  const queryClient = useQueryClient();

  const {
    data: todos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const toggleTodoMutation = useMutation({
    mutationFn: toggleTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return {
    todos,
    isLoading,
    error,
    addTodo: addTodoMutation.mutate,
    toggleTodo: toggleTodoMutation.mutate,
    isAdding: addTodoMutation.isPending,
    isToggling: toggleTodoMutation.isPending,
  };
};
```

## 🎨 Design System Guidelines

### Color Usage

- **Primary**: `hsl(222.2 47.4% 11.2%)` - Main actions, buttons
- **Secondary**: `hsl(210 40% 96%)` - Secondary actions
- **Destructive**: `hsl(0 84.2% 60.2%)` - Delete actions, errors
- **Muted**: `hsl(210 40% 96%)` - Disabled states, secondary text

### Spacing Scale

- **xs**: `0.25rem` (4px)
- **sm**: `0.5rem` (8px)
- **md**: `1rem` (16px)
- **lg**: `1.5rem` (24px)
- **xl**: `2rem` (32px)

### Typography

- **Headings**: `font-bold text-foreground`
- **Body**: `text-foreground`
- **Muted**: `text-muted-foreground`
- **Small**: `text-sm`

## 🐛 Bug Report Template

### Critical Issues (P0)

- **Description**: Brief description of the issue
- **Steps to Reproduce**:
  1. Step 1
  2. Step 2
  3. Step 3
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, etc.
- **Screenshots**: If applicable

### Enhancement Requests (P1-P2)

- **Feature**: Description of the enhancement
- **Use Case**: Why this would be valuable
- **Acceptance Criteria**:
  - [ ] Criteria 1
  - [ ] Criteria 2
- **Design Mockups**: If applicable

## 📝 Code Review Comments

### Positive Feedback

- ✅ "Great use of TypeScript interfaces!"
- ✅ "Excellent error handling implementation"
- ✅ "Clean component structure"
- ✅ "Good performance optimization with useMemo"

### Constructive Feedback

- 🔄 "Consider extracting this logic into a custom hook"
- 🔄 "This could benefit from better error boundaries"
- 🔄 "Consider adding loading states for better UX"
- 🔄 "The styling could be more consistent with the design system"

### Issues to Address

- ❌ "This will cause unnecessary re-renders"
- ❌ "Missing accessibility attributes"
- ❌ "Error handling is incomplete"
- ❌ "This violates the DRY principle"

## 🚦 Review Process

1. **Self Review**: Check your own code first
2. **Automated Checks**: Ensure linting and tests pass
3. **Peer Review**: Get feedback from team members
4. **Design Review**: Ensure UI/UX consistency
5. **Final Approval**: Merge when all criteria are met

## 📊 Metrics to Track

- **Code Coverage**: Aim for >80%
- **Bundle Size**: Monitor build output
- **Performance**: Core Web Vitals
- **Accessibility**: WCAG 2.1 AA compliance
- **Type Safety**: Zero TypeScript errors

---

_Remember: The goal is to maintain high code quality while fostering a collaborative environment. Be constructive, specific, and helpful in your feedback._
