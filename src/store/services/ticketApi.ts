import { api } from "../api";

export interface Ticket {
  id: number;
  title: string;
  description?: string;
  categoryId?: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  labels?: Array<{
    label: {
      id: number;
      title: string;
    };
  }>;
  category?: {
    id: number;
    title: string;
  };
  history?: Array<{
    createdAt: string;
    category: {
      id: number;
      title: string;
    };
  }>;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  expiresAt: string;
  categoryId: number;
}

export interface UpdateTicketRequest {
  id: number;
  title?: string;
  description?: string;
  expiresAt?: string;
  categoryId?: number;
}

export const ticketApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<Ticket[], void>({
      query: () => "/tickets",
      providesTags: ["Ticket"],
    }),
    getTicket: builder.query<Ticket, number>({
      query: (id) => `/tickets/get/${id}`,
      providesTags: (result, error, id) => [{ type: "Ticket", id }],
    }),

    createTicket: builder.mutation<Ticket, CreateTicketRequest>({
      query: (ticketData) => ({
        url: "/tickets",
        method: "POST",
        body: ticketData,
      }),
      invalidatesTags: ["Ticket"],
    }),
    updateTicket: builder.mutation<Ticket, UpdateTicketRequest>({
      query: ({ id, ...patch }) => ({
        url: `/tickets/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Ticket", id },
        "Ticket", // Also invalidate the general tickets list
      ],
    }),
    deleteTicket: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ticket"],
    }),
    addLabelToTicket: builder.mutation<
      void,
      { ticketId: number; labelId: number }
    >({
      query: ({ ticketId, labelId }) => ({
        url: `/tickets/${ticketId}/labels`,
        method: "POST",
        body: { labelId },
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        { type: "Ticket", id: ticketId },
        "Ticket",
      ],
    }),
    removeLabelFromTicket: builder.mutation<
      void,
      { ticketId: number; labelId: number }
    >({
      query: ({ ticketId, labelId }) => ({
        url: `/tickets/${ticketId}/labels/${labelId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        { type: "Ticket", id: ticketId },
        "Ticket",
      ],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useAddLabelToTicketMutation,
  useRemoveLabelFromTicketMutation,
} = ticketApi;
