import { useQuery } from "@tanstack/react-query";
import todosApi, { type Todo } from "@/services/todo";

const useTodos = () => {
  return useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: todosApi.getAll,
  });
};

export default useTodos;
