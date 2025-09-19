# Tailwind CSS Rules

## Class Organization
- Group classes logically: layout, spacing, colors, typography
- Use consistent spacing scale (xs, sm, md, lg, xl)
- Prefer utility classes over custom CSS

## Design System Compliance
```typescript
// ✅ Good: Using design tokens
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
  Add Todo
</button>

// ❌ Bad: Hardcoded colors
<button className="bg-blue-500 text-white px-4 py-2 rounded-md">
  Add Todo
</button>
```

## Responsive Design
```typescript
// ✅ Good: Mobile-first approach
<div className="flex flex-col md:flex-row gap-4 p-4">
  <div className="w-full md:w-1/2">Content</div>
  <div className="w-full md:w-1/2">Sidebar</div>
</div>

// ❌ Bad: Desktop-first
<div className="flex-row flex-col gap-4 p-4">
  <div className="w-1/2 w-full">Content</div>
  <div className="w-1/2 w-full">Sidebar</div>
</div>
```

## Dark Mode Support
```typescript
// ✅ Good: Dark mode classes
<div className="bg-background text-foreground dark:bg-background dark:text-foreground">
  Content
</div>

// ❌ Bad: No dark mode support
<div className="bg-white text-black">
  Content
</div>
```

## Performance
- Use `@apply` sparingly
- Prefer utility classes over custom CSS
- Use `@layer` for custom components
- Avoid deep nesting in CSS
