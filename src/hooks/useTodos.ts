import { useQuery } from "@tanstack/react-query";
import todosApi, { type Todo } from "@/services/todo";
import { QUERY_KEYS } from "@/constants";

const useTodos = () => {
  return useQuery<Todo[], Error>({
    queryKey: QUERY_KEYS.TODOS,
    queryFn: todosApi.getAll,
  });
};

export default useTodos;
