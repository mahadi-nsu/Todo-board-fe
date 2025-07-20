import { api } from "../api";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  boardId: string;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  priority?: "low" | "medium" | "high";
  boardId: string;
  assignedTo?: string;
  dueDate?: string;
}

export interface UpdateTodoRequest {
  id: string;
  title?: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  priority?: "low" | "medium" | "high";
  assignedTo?: string;
  dueDate?: string;
}

export const todoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], string>({
      query: (boardId) => `/boards/${boardId}/todos`,
      providesTags: (result) => [
        { type: "Todo", id: "LIST" },
        ...(result?.map(({ id }) => ({ type: "Todo" as const, id })) ?? []),
      ],
    }),
    getTodo: builder.query<Todo, string>({
      query: (id) => `/todos/${id}`,
      providesTags: (result, error, id) => [{ type: "Todo", id }],
    }),
    createTodo: builder.mutation<Todo, CreateTodoRequest>({
      query: (todoData) => ({
        url: `/boards/${todoData.boardId}/todos`,
        method: "POST",
        body: todoData,
      }),
      invalidatesTags: [{ type: "Todo", id: "LIST" }],
    }),
    updateTodo: builder.mutation<Todo, UpdateTodoRequest>({
      query: ({ id, ...todoData }) => ({
        url: `/todos/${id}`,
        method: "PUT",
        body: todoData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Todo", id },
        { type: "Todo", id: "LIST" },
      ],
    }),
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Todo", id: "LIST" }],
    }),
    moveTodo: builder.mutation<Todo, { id: string; boardId: string }>({
      query: ({ id, boardId }) => ({
        url: `/todos/${id}/move`,
        method: "PATCH",
        body: { boardId },
      }),
      invalidatesTags: [{ type: "Todo", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useMoveTodoMutation,
} = todoApi;
