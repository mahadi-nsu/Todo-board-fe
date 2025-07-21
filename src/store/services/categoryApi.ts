import { api } from "../api";

export interface Category {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
