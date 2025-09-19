import { QUERY_KEYS } from "@/constants";
import todoApi, { type Todo } from "@/services/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TodoContext {
    previousTodos: Todo[];
  }

export const useAddTodo = (onAddTodo: (todo: Todo) => void) => {
    const queryClient = useQueryClient();

    return useMutation<Todo, Error, Todo, TodoContext>({
        mutationFn: todoApi.post,
        onMutate: (todo) => {
          const previousTodos = queryClient.getQueryData<Todo[]>(QUERY_KEYS.TODOS) || [];
    
          queryClient.setQueryData(QUERY_KEYS.TODOS, (old: Todo[]) => {
            return [todo, ...old];
          });
    
          onAddTodo(todo);
    
          return { previousTodos };
        },
        onSuccess: (savedTodo, localyAddedTodo) => {
          console.log({ savedTodo, localyAddedTodo });
    
          // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODOS });
    
          queryClient.setQueryData(QUERY_KEYS.TODOS, (todos: Todo[]) => {
            return todos.map((todo) =>
              todo !== localyAddedTodo ? todo : savedTodo
            );
          });
        },
        onError: (error, _, context) => {
          if (!context) return;
    
          console.log(error.message);
          queryClient.setQueryData(QUERY_KEYS.TODOS, context.previousTodos);
        },
      })
}