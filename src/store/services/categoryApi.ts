import { api } from "../api";

export interface Category {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  title: string;
}

export interface UpdateCategoryRequest {
  id: number;
  title: string;
}

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (categoryData) => ({
        url: "/categories",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<Category, UpdateCategoryRequest>({
      query: ({ id, ...patch }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Category", id }],
    }),
    deleteCategory: builder.mutation<
      void,
      { id: number; moveExistingTicketsToCategoryId: number }
    >({
      query: ({ id, moveExistingTicketsToCategoryId }) => ({
        url: `/categories/${id}?moveExistingTicketsToCategoryId=${moveExistingTicketsToCategoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    swapCategoryOrder: builder.mutation<
      void,
      { id: number; categoryId2: number }
    >({
      query: ({ id, categoryId2 }) => ({
        url: `/categories/${id}/swap-order/${categoryId2}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useSwapCategoryOrderMutation,
} = categoryApi;
