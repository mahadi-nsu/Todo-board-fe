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
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi;
