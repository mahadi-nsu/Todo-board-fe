import { api } from "../api";

export interface Board {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateBoardRequest {
  title: string;
  description?: string;
}

export interface UpdateBoardRequest {
  id: string;
  title?: string;
  description?: string;
}

export const boardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBoards: builder.query<Board[], void>({
      query: () => "/boards",
      providesTags: ["Board"],
    }),
    getBoard: builder.query<Board, string>({
      query: (id) => `/boards/${id}`,
      providesTags: (result, error, id) => [{ type: "Board", id }],
    }),
    createBoard: builder.mutation<Board, CreateBoardRequest>({
      query: (boardData) => ({
        url: "/boards",
        method: "POST",
        body: boardData,
      }),
      invalidatesTags: ["Board"],
    }),
    updateBoard: builder.mutation<Board, UpdateBoardRequest>({
      query: ({ id, ...boardData }) => ({
        url: `/boards/${id}`,
        method: "PUT",
        body: boardData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Board", id },
        "Board",
      ],
    }),
    deleteBoard: builder.mutation<void, string>({
      query: (id) => ({
        url: `/boards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Board"],
    }),
  }),
});

export const {
  useGetBoardsQuery,
  useGetBoardQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} = boardApi;
