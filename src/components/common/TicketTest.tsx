import React from "react";
import { Button, Input, DatePicker, Select, message } from "antd";
import dayjs from "dayjs";
import {
  useGetTicketsQuery,
  useGetTicketQuery,
  useGetTicketHistoryQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useAddLabelToTicketMutation,
  useRemoveLabelFromTicketMutation,
} from "@/store/services/ticketApi";
import { useGetCategoriesQuery } from "@/store/services/categoryApi";
import { useGetLabelsQuery } from "@/store/services/labelApi";

const TicketTest: React.FC = () => {
  const { data: tickets, error, isLoading } = useGetTicketsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const { data: labels } = useGetLabelsQuery();
  const { data: ticketHistory, isLoading: isLoadingHistory } =
    useGetTicketHistoryQuery();
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation();
  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();
  const [addLabelToTicket, { isLoading: isAddingLabel }] =
    useAddLabelToTicketMutation();
  const [removeLabelFromTicket, { isLoading: isRemovingLabel }] =
    useRemoveLabelFromTicketMutation();

  const [newTicket, setNewTicket] = React.useState({
    title: "",
    description: "",
    expiresAt: "",
    categoryId: undefined as number | undefined,
  });

  const [editingTicket, setEditingTicket] = React.useState<{
    id: number;
    title: string;
    description: string;
    expiresAt: string;
    categoryId: number;
  } | null>(null);

  const [viewingTicketId, setViewingTicketId] = React.useState<number | null>(
    null
  );

  const { data: singleTicket, isLoading: isLoadingSingle } = useGetTicketQuery(
    viewingTicketId!,
    { skip: !viewingTicketId }
  );

  const handleCreateTicket = async () => {
    if (
      !newTicket.title.trim() ||
      !newTicket.description.trim() ||
      !newTicket.expiresAt ||
      !newTicket.categoryId
    ) {
      message.warning("Please fill all fields");
      return;
    }

    try {
      await createTicket({
        title: newTicket.title.trim(),
        description: newTicket.description.trim(),
        expiresAt: newTicket.expiresAt,
        categoryId: newTicket.categoryId,
      }).unwrap();
      message.success("Ticket created successfully!");
      setNewTicket({
        title: "",
        description: "",
        expiresAt: "",
        categoryId: undefined,
      });
    } catch (error) {
      message.error("Failed to create ticket");
    }
  };

  const handleUpdateTicket = async () => {
    if (!editingTicket) return;

    try {
      await updateTicket({
        id: editingTicket.id,
        title: editingTicket.title.trim(),
        description: editingTicket.description.trim(),
        expiresAt: editingTicket.expiresAt,
        categoryId: editingTicket.categoryId,
      }).unwrap();
      message.success("Ticket updated successfully!");
      setEditingTicket(null);
    } catch (error) {
      message.error("Failed to update ticket");
    }
  };

  const startEditing = (ticket: any) => {
    setEditingTicket({
      id: ticket.id,
      title: ticket.title || "",
      description: ticket.description || "",
      expiresAt: ticket.expiresAt || "",
      categoryId: ticket.categoryId || 1,
    });
  };

  const handleDeleteTicket = async (ticketId: number) => {
    try {
      await deleteTicket(ticketId).unwrap();
      message.success("Ticket deleted successfully!");
    } catch (error) {
      message.error("Failed to delete ticket");
    }
  };

  const handleAddLabelToTicket = async (ticketId: number, labelId: number) => {
    try {
      await addLabelToTicket({ ticketId, labelId }).unwrap();
      message.success("Label added to ticket successfully!");
    } catch (error) {
      message.error("Failed to add label to ticket");
    }
  };

  const handleRemoveLabelFromTicket = async (
    ticketId: number,
    labelId: number
  ) => {
    try {
      await removeLabelFromTicket({ ticketId, labelId }).unwrap();
      message.success("Label removed from ticket successfully!");
    } catch (error) {
      message.error("Failed to remove label from ticket");
    }
  };

  const formatDateForPicker = (dateString: string) => {
    if (!dateString) return null;
    try {
      const date = dayjs(dateString);
      return date.isValid() ? date : null;
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return <div>Loading tickets...</div>;
  }

  if (error) {
    return (
      <div
        style={{
          color: "red",
          padding: "10px",
          border: "1px solid red",
          margin: "10px",
        }}
      >
        <h3>Tickets Error</h3>
        <p>
          Message:{" "}
          {"status" in error
            ? (error.data as any)?.message || `HTTP ${error.status}`
            : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        color: "blue",
        padding: "10px",
        border: "1px solid blue",
        margin: "10px",
      }}
    >
      <h3>Tickets Test</h3>

      <div style={{ marginBottom: "15px" }}>
        <h4>Create New Ticket:</h4>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <Input
            placeholder="Enter ticket title"
            value={newTicket.title}
            onChange={(e) =>
              setNewTicket({ ...newTicket, title: e.target.value })
            }
          />
          <Input.TextArea
            placeholder="Enter ticket description"
            value={newTicket.description}
            onChange={(e) =>
              setNewTicket({ ...newTicket, description: e.target.value })
            }
            rows={3}
          />
          <DatePicker
            placeholder="Select expiry date"
            onChange={(date) =>
              setNewTicket({
                ...newTicket,
                expiresAt: date?.toISOString() || "",
              })
            }
            style={{ width: "100%" }}
          />
          <Select
            placeholder="Select category"
            value={newTicket.categoryId}
            onChange={(value) =>
              setNewTicket({ ...newTicket, categoryId: value })
            }
            options={categories?.map((cat) => ({
              label: cat.title,
              value: cat.id,
            }))}
          />
          <Button
            type="primary"
            onClick={handleCreateTicket}
            loading={isCreating}
          >
            Create Ticket
          </Button>
        </div>
      </div>

      {editingTicket && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            border: "1px solid orange",
            borderRadius: "4px",
          }}
        >
          <h4>Edit Ticket:</h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <Input
              placeholder="Enter ticket title"
              value={editingTicket.title}
              onChange={(e) =>
                setEditingTicket({ ...editingTicket, title: e.target.value })
              }
            />
            <Input.TextArea
              placeholder="Enter ticket description"
              value={editingTicket.description}
              onChange={(e) =>
                setEditingTicket({
                  ...editingTicket,
                  description: e.target.value,
                })
              }
              rows={3}
            />
            <DatePicker
              placeholder="Select expiry date"
              value={formatDateForPicker(editingTicket.expiresAt)}
              onChange={(date) =>
                setEditingTicket({
                  ...editingTicket,
                  expiresAt: date?.toISOString() || "",
                })
              }
              style={{ width: "100%" }}
            />
            <Select
              placeholder="Select category"
              value={editingTicket.categoryId}
              onChange={(value) =>
                setEditingTicket({ ...editingTicket, categoryId: value })
              }
              options={categories?.map((cat) => ({
                label: cat.title,
                value: cat.id,
              }))}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                type="primary"
                onClick={handleUpdateTicket}
                loading={isUpdating}
              >
                Update Ticket
              </Button>
              <Button onClick={() => setEditingTicket(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {singleTicket && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            border: "1px solid green",
            borderRadius: "4px",
          }}
        >
          <h4>Viewing Ticket:</h4>
          <div>
            <p>
              <strong>ID:</strong> {singleTicket.id}
            </p>
            <p>
              <strong>Title:</strong> {singleTicket.title}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(singleTicket.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated:</strong>{" "}
              {new Date(singleTicket.updatedAt).toLocaleString()}
            </p>
            <Button size="small" onClick={() => setViewingTicketId(null)}>
              Close
            </Button>
          </div>
        </div>
      )}

      <div>
        <h4>Ticket History ({ticketHistory?.length || 0}):</h4>
        {isLoadingHistory ? (
          <p>Loading ticket history...</p>
        ) : (
          <ul>
            {ticketHistory?.map((ticket) => (
              <li key={ticket.id} style={{ marginBottom: "8px" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>
                    {ticket.title} (ID: {ticket.id})
                  </span>
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </span>
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    Updated: {new Date(ticket.updatedAt).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h4>Existing Tickets ({tickets?.length || 0}):</h4>
        <ul>
          {tickets?.map((ticket) => (
            <li key={ticket.id} style={{ marginBottom: "8px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>
                  {ticket.title} (ID: {ticket.id})
                </span>
                <Button size="small" onClick={() => startEditing(ticket)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => handleDeleteTicket(ticket.id)}
                  loading={isDeleting}
                >
                  Delete
                </Button>
                <Button
                  size="small"
                  type="default"
                  onClick={() => setViewingTicketId(ticket.id)}
                >
                  View
                </Button>
                <Select
                  size="small"
                  placeholder="Add tag"
                  style={{ width: 120 }}
                  onChange={(labelId) =>
                    handleAddLabelToTicket(ticket.id, labelId)
                  }
                  options={labels?.map((label) => ({
                    label: label.title,
                    value: label.id,
                  }))}
                />
                <Select
                  size="small"
                  placeholder="Remove tag"
                  style={{ width: 120 }}
                  onChange={(labelId) =>
                    handleRemoveLabelFromTicket(ticket.id, labelId)
                  }
                  options={labels?.map((label) => ({
                    label: label.title,
                    value: label.id,
                  }))}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TicketTest;
