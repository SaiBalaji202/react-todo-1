# Snake Case Variable Naming Rule

## Overview

All variables in TSX files must use snake_case naming convention instead of camelCase.

## Rule

- **File Pattern**: `**/*.tsx`
- **Enforcement**: Error
- **Naming Convention**: snake_case

## Examples

### ✅ Correct (snake_case)

```tsx
const user_name = "John";
const is_loading = true;
const todo_list = [];
const current_user_id = 123;
```

### ❌ Incorrect (camelCase)

```tsx
const userName = "John"; // Should be: user_name
const isLoading = true; // Should be: is_loading
const todoList = []; // Should be: todo_list
const currentUserId = 123; // Should be: current_user_id
```

## Exceptions

- Component names should remain PascalCase (e.g., `TodoList`, `UserCard`)
- Function names should remain camelCase (e.g., `handleClick`, `fetchData`)
- Constants should remain UPPER_SNAKE_CASE (e.g., `API_URL`, `MAX_ITEMS`)

## Rationale

Snake_case improves readability and consistency across the codebase, especially when working with data from APIs that often use snake_case naming conventions.
