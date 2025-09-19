# Naming Conventions Rules

## Component Naming

- Use PascalCase for component names
- Use descriptive names that indicate purpose
- Avoid abbreviations unless widely understood
- Use consistent naming patterns

## Variable Naming

- Use camelCase for variables and functions
- Use descriptive names that explain intent
- Avoid single letter variables (except in loops)
- Use boolean prefixes (is, has, can, should)

## File Naming

- Use kebab-case for file names
- Match component name with file name
- Use descriptive suffixes (.component, .hook, .util)

## Examples

### ✅ Good Naming

```typescript
// Component
const TodoItem = () => {
  /* ... */
};

// Variables
const isCompleted = true;
const hasError = false;
const todoCount = 5;
const userPreferences = {};

// Files
// todo-item.component.tsx
// use-todos.hook.ts
// todo.utils.ts
```

### ❌ Bad Naming

```typescript
// Component - should be PascalCase
const todoitem = () => {
  /* ... */
};

// Variables - unclear purpose
const flag = true;
const data = [];
const x = 5;

// Files - inconsistent naming
// TodoItem.tsx (should be todo-item.component.tsx)
```
