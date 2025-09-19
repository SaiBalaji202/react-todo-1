# Accessibility Rules

## Semantic HTML
- Use proper heading hierarchy (h1, h2, h3, etc.)
- Use semantic elements (nav, main, section, article)
- Provide alt text for images
- Use proper form labels

## ARIA Attributes
```typescript
// ✅ Good: Proper ARIA labels
<button
  aria-label="Delete todo item"
  aria-describedby="delete-help"
  onClick={() => onDelete(todo.id)}
>
  <TrashIcon />
</button>

// ❌ Bad: No accessibility attributes
<button onClick={() => onDelete(todo.id)}>
  <TrashIcon />
</button>
```

## Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Provide focus indicators
- Use proper tab order
- Support keyboard shortcuts

## Screen Reader Support
```typescript
// ✅ Good: Screen reader friendly
<div role="status" aria-live="polite">
  {isLoading && "Loading todos..."}
  {error && `Error: ${error.message}`}
</div>

// ❌ Bad: No screen reader support
<div>
  {isLoading && "Loading todos..."}
  {error && `Error: ${error.message}`}
</div>
```

## Color Contrast
- Ensure sufficient color contrast (4.5:1 for normal text)
- Don't rely solely on color to convey information
- Provide alternative indicators (icons, text)

## Focus Management
- Manage focus for dynamic content
- Provide skip links
- Ensure focus is visible
- Handle focus trapping in modals
