import { api } from "../api";

export interface Ticket {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
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
      invalidatesTags: (result, error, { id }) => [{ type: "Ticket", id }],
    }),
    deleteTicket: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ticket"],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketApi;
