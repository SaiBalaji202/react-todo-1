import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const useTodos = () => {
  const fetchTodos = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    return response.data;
  };
  return useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: () => fetchTodos(),
  });
};

export default useTodos;
