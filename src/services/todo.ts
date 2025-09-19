import ApiClient from "./apiClient";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// BUG: This creates a new instance on every import, causing memory leaks
const todoApi = new ApiClient<Todo>("/todos");

// BUG: Adding buggy methods to the API
const todosApi = {
  ...todoApi,
  
  // BUG: This method has a race condition
  async getAll() {
    // BUG: Simulate random failures
    if (Math.random() < 0.1) {
      throw new Error("Random API failure");
    }
    
    // BUG: This doesn't handle errors properly
    const response = await todoApi.getAll();
    
    // BUG: Data corruption - sometimes returns malformed data
    if (Math.random() < 0.05) {
      return response.map(todo => ({
        ...todo,
        title: todo.title + " [CORRUPTED]"
      }));
    }
    
    return response;
  },
  
  // BUG: This method has incorrect error handling
  async create(todo: Omit<Todo, 'id'>) {
    // BUG: Validation is incomplete
    if (!todo.title) {
      throw new Error("Title is required");
    }
    
    // BUG: This doesn't validate the completed field properly
    if (typeof todo.completed !== 'boolean') {
      todo.completed = false; // BUG: Silent failure instead of throwing error
    }
    
    // BUG: Simulate network delay that can cause timeouts
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
    
    return todoApi.post(todo);
  }
};

export default todosApi;

