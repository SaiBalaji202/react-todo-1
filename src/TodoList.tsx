import useTodos from "./hooks/useTodos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TodoList = () => {
  const { data: todos, isLoading, isRefetching, error } = useTodos();
  console.log("Refetching", isRefetching);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          📋 Todo List
          {todos && (
            <span className="text-sm font-normal text-muted-foreground">
              ({todos.length} {todos.length === 1 ? "task" : "tasks"})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading todos...
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="font-medium mb-1">Error loading todos</div>
            <div className="text-sm">{error.message}</div>
          </div>
        )}

        {!isLoading && !error && todos && todos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📝</div>
            <div className="font-medium">No todos yet</div>
            <div className="text-sm">
              Add your first todo above to get started!
            </div>
          </div>
        )}

        {todos && todos.length > 0 && (
          <div className="space-y-2">
            {todos.map((todo) => (
              <Card
                key={todo.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {todo.title}
                  </span>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm">
                      {todo.completed ? "✅" : "⏳"}
                    </span>
                    <Button
                      variant={todo.completed ? "secondary" : "default"}
                      size="sm"
                    >
                      {todo.completed ? "Undo" : "Complete"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoList;
