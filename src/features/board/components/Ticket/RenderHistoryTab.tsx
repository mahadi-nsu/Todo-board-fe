import React from "react";
import { Timeline, Tag } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface RenderHistoryTabProps {
  isLoadingHistory: boolean;
  historyError: any;
  ticketData: any;
}

const RenderHistoryTab: React.FC<RenderHistoryTabProps> = ({
  isLoadingHistory,
  historyError,
  ticketData,
}) => {
  if (isLoadingHistory) {
    return (
      <div style={{ padding: "16px 0", textAlign: "center" }}>
        Loading ticket history...
      </div>
    );
  }

  if (historyError) {
    return (
      <div style={{ padding: "16px 0", textAlign: "center", color: "#ff4d4f" }}>
        Failed to load ticket history
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div style={{ padding: "16px 0", textAlign: "center", color: "#999" }}>
        Loading ticket data...
      </div>
    );
  }

  if (!ticketData.history || ticketData.history.length === 0) {
    // Show creation information for tickets without history
    return (
      <div
        style={{
          padding: "20px 0",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            padding: "16px 0",
            minHeight: "60px",
            width: "100%",
          }}
        >
          {/* Timestamp */}
          <div
            style={{
              fontSize: "11px",
              color: "666",
              whiteSpace: "nowrap",
              minWidth: "80px",
              flexShrink: 0,
              fontWeight: "500",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "2px",
              marginTop: "0px",
              paddingTop: "3px",
            }}
          >
            <div>{dayjs(ticketData?.createdAt || "").format("MMM DD")}</div>
            <div>{dayjs(ticketData?.createdAt || "").format("h:mm A")}</div>
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontWeight: "500",
                fontSize: "15px",
                lineHeight: "1.4",
                wordBreak: "break-word",
                color: "#333",
              }}
            >
              Created in {ticketData?.category?.title || "Unknown"}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "#666",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Tag
                color="green"
                style={{
                  margin: 0,
                  padding: "4px 12px",
                  fontSize: "12px",
                }}
              >
                {ticketData?.category?.title || "Unknown"}
              </Tag>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format history to show category movements
  const historyItems = (ticketData.history || []).map(
    (historyItem: any, index: number) => {
      const nextItem = (ticketData.history || [])[index + 1];
      const fromCategory = nextItem?.category || null;
      const toCategory = historyItem.category;

      return {
        color: "#1890ff",
        dot: null,
        children: (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              padding: "16px 0",
              minHeight: "60px",
              width: "100%",
            }}
          >
            {/* Timestamp */}
            <div
              style={{
                fontSize: "11px",
                color: "#666",
                whiteSpace: "nowrap",
                minWidth: "80px",
                flexShrink: 0,
                fontWeight: "500",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "2px",
                marginTop: "0px",
                paddingTop: "3px",
              }}
            >
              <div>{dayjs(historyItem.createdAt).format("MMM DD")}</div>
              <div>{dayjs(historyItem.createdAt).format("h:mm A")}</div>
            </div>

            {/* Content */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontWeight: "500",
                  fontSize: "15px",
                  lineHeight: "1.4",
                  wordBreak: "break-word",
                  color: "#333",
                }}
              >
                {fromCategory
                  ? `Moved from ${fromCategory.title} to ${toCategory.title}`
                  : `Created in ${toCategory.title}`}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {fromCategory ? (
                  <>
                    <Tag
                      color="default"
                      style={{
                        margin: 0,
                        padding: "4px 12px",
                        fontSize: "12px",
                      }}
                    >
                      {fromCategory.title}
                    </Tag>
                    <ArrowRightOutlined
                      style={{ color: "#999", fontSize: "14px" }}
                    />
                    <Tag
                      color="blue"
                      style={{
                        margin: 0,
                        padding: "4px 12px",
                        fontSize: "12px",
                      }}
                    >
                      {toCategory.title}
                    </Tag>
                  </>
                ) : (
                  <Tag
                    color="green"
                    style={{
                      margin: 0,
                      padding: "4px 12px",
                      fontSize: "12px",
                    }}
                  >
                    {toCategory.title}
                  </Tag>
                )}
              </div>
            </div>
          </div>
        ),
      };
    }
  );

  return (
    <div
      style={{
        padding: "20px 0",
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      <Timeline
        items={historyItems}
        style={{
          paddingLeft: "0",
        }}
        className="ticket-history-timeline"
      />
    </div>
  );
};

export default RenderHistoryTab;
