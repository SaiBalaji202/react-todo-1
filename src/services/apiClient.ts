import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    "Content-Type": "application/json",
  },
});

class ApiClient<T> {
  private readonly endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = () => {
    return apiClient.get<T[]>(this.endpoint).then((res) => res.data);
  };

  post = (data: T) => {
    return apiClient.post<T>(this.endpoint, data).then((res) => res.data);
  };

  put = (id: string, data: T) => {
    return apiClient
      .put<T>(`${this.endpoint}/${id}`, data)
      .then((res) => res.data);
  };

  delete = (id: string) => {
    return apiClient
      .delete<T>(`${this.endpoint}/${id}`)
      .then((res) => res.data);
  };

  patch = (id: string, data: T) => {
    return apiClient
      .patch<T>(`${this.endpoint}/${id}`, data)
      .then((res) => res.data);
  };

  getById = (id: string) => {
    return apiClient.get<T>(`${this.endpoint}/${id}`).then((res) => res.data);
  };
}

export default ApiClient;
