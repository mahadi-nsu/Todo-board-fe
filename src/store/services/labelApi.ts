import { api } from "../api";

export interface Label {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabelRequest {
  title: string;
}

export interface UpdateLabelRequest {
  id: number;
  title: string;
}

export const labelApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLabels: builder.query<Label[], void>({
      query: () => "/labels",
      providesTags: ["Label"],
    }),
    createLabel: builder.mutation<Label, CreateLabelRequest>({
      query: (labelData) => ({
        url: "/labels",
        method: "POST",
        body: labelData,
      }),
      invalidatesTags: ["Label"],
    }),
    updateLabel: builder.mutation<Label, UpdateLabelRequest>({
      query: ({ id, ...patch }) => ({
        url: `/labels/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Label", id }],
    }),
    deleteLabel: builder.mutation<void, number>({
      query: (id) => ({
        url: `/labels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Label"],
    }),
  }),
});

export const {
  useGetLabelsQuery,
  useCreateLabelMutation,
  useUpdateLabelMutation,
  useDeleteLabelMutation,
} = labelApi;
