# TypeScript Rules

## Type Safety
- Always use explicit types for function parameters and return values
- Prefer `interface` over `type` for object shapes
- Use `const assertions` for immutable data
- Avoid `any` type - use `unknown` or proper typing instead

## React Components
```typescript
// ✅ Good: Proper component typing
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  // Component implementation
};

// ❌ Bad: Missing types
const TodoItem = ({ todo, onToggle, onDelete }) => {
  // Component implementation
};
```

## Hooks
```typescript
// ✅ Good: Typed custom hooks
const useTodos = (): {
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;
  addTodo: (todo: Omit<Todo, 'id'>) => void;
} => {
  // Hook implementation
};

// ❌ Bad: Untyped return
const useTodos = () => {
  // Hook implementation
};
```

## Error Handling
```typescript
// ✅ Good: Proper error typing
const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await fetch('/api/todos');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    throw error;
  }
};
```
