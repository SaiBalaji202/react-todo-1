import useTodos from "./hooks/useTodos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TodoList = () => {
  const { data: todos, isLoading, isRefetching, error } = useTodos();
  console.log("Refetching", isRefetching);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Todo List
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              Loading todos...
            </div>
          )}

          {error && (
            <div className="text-center py-4 text-destructive">
              Error: {error.message}
            </div>
          )}

          <div className="space-y-2">
            {todos?.map((todo) => (
              <Card key={1} className="p-4">
                <div className="flex items-center justify-between">
                  <span
                    className={
                      todo.completed ? "line-through text-muted-foreground" : ""
                    }
                  >
                    {todo.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {todo.completed ? "✅" : "❌"}
                    </span>
                    <Button variant="outline" size="sm">
                      {todo.completed ? "Undo" : "Complete"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoList;
