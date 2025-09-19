# Testing Rules

## Test Structure
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Test behavior, not implementation
- Keep tests simple and focused

## Unit Tests
```typescript
// ✅ Good: Testing behavior
describe('TodoItem', () => {
  it('should toggle completion when checkbox is clicked', () => {
    const mockToggle = jest.fn();
    const todo = { id: '1', title: 'Test todo', completed: false };
    
    render(<TodoItem todo={todo} onToggle={mockToggle} onDelete={jest.fn()} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockToggle).toHaveBeenCalledWith('1');
  });
});

// ❌ Bad: Testing implementation
describe('TodoItem', () => {
  it('should call onToggle with correct id', () => {
    // Testing internal implementation details
  });
});
```

## Integration Tests
- Test component interactions
- Mock external dependencies
- Test user workflows
- Verify API integrations

## E2E Tests
- Test critical user journeys
- Use realistic test data
- Test across different browsers
- Include accessibility testing

## Test Coverage
- Aim for >80% code coverage
- Focus on critical paths
- Test error scenarios
- Include edge cases
