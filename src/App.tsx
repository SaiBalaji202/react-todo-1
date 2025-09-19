import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            📝 Todo App
          </h1>
          <p className="text-muted-foreground">
            Organize your tasks efficiently
          </p>
        </header>

        <div className="max-w-2xl mx-auto space-y-6">
          <TodoForm />
          <TodoList />
        </div>
      </div>
    </div>
  );
}

export default App;
