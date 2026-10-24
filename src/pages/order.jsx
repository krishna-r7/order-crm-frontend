
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Empty,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import useFilter from "../hooks/useFilter";
import OrderService from "../sevice/order";

const { Title, Text } = Typography;

const DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  status: "all",
};

const Orders = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const {
    data: orderData,
    loading,
    error,
    filters,
    updateFilter,
    refresh,
  } = useFilter(OrderService.getOrders, DEFAULT_FILTERS);


  const orders = Array.isArray(orderData)
    ? orderData
    : Array.isArray(orderData?.data)
      ? orderData.data
      : [];

  const pagination = orderData?.pagination || {};

  const totalOrders = Number(
    pagination.total ?? (Array.isArray(orderData) ? orderData.length : 0)
  );

  const columns = [
    {
      title: "Order",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (value) => (
        <Text strong>{value || "—"}</Text>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <div>
          <Text strong>
            {record.customerName || "Unknown customer"}
          </Text>
          <br />
          <Text type="secondary" className="text-xs">
            {record.email || "No email"}
          </Text>
        </div>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "shopifyCreatedAt",
      key: "shopifyCreatedAt",
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—",
    },
    {
      title: "Payment Status",
      dataIndex: "financialStatus",
      key: "financialStatus",
      render: (value) => {
        const status = value || "unknown";

        const colors = {
          paid: "green",
          pending: "orange",
          authorized: "blue",
          refunded: "purple",
          partially_refunded: "purple",
          voided: "red",
          unpaid: "red",
        };

        return (
          <Tag color={colors[status.toLowerCase()] || "default"}>
            {status.replaceAll("_", " ").toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Fulfillment",
      dataIndex: "fulfillmentStatus",
      key: "fulfillmentStatus",
      render: (value) => {
        if (!value) {
          return <Tag>Unfulfilled</Tag>;
        }

        const status = value.toLowerCase();

        return (
          <Tag
            color={
              status === "fulfilled"
                ? "green"
                : status === "partial"
                  ? "orange"
                  : "default"
            }
          >
            {value.replaceAll("_", " ").toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Total",
      key: "totalPrice",
      align: "right",
      render: (_, record) => {
        const amount = Number(record.totalPrice || 0);

        return (
          <Text strong>
            {record.currency || "USD"} {amount.toFixed(2)}
          </Text>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => navigate(`/orders`, { state: record.id })}
        >
          View
        </Button>
      ),
    },
  ];

  const handleSearch = (value) => {
    const search = (value ?? searchInput).trim();

    updateFilter({
      search,
      page: 1,
    });
  };

  const handleStatusChange = (status) => {
    updateFilter({
      status,
      page: 1,
    });
  };

  const handleTableChange = (paginationConfig) => {
    updateFilter({
      page: paginationConfig.current,
      limit: paginationConfig.pageSize,
    });
  };

  const handleRefresh = () => {
    refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <Card>
          {/* Page heading */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Title level={3} className="!mb-1">
                <ShoppingCartOutlined className="mr-2" />
                Order Management
              </Title>

              <Text type="secondary">
                Manage and track orders synchronized from Shopify.
              </Text>
            </div>

            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>
          </div>

          {/* Error message */}
          {error && (
            <Alert
              className="mb-4"
              type="error"
              showIcon
              message="Failed to load orders"
              description={
                typeof error === "string"
                  ? error
                  : error.message || "Please try again."
              }
            />
          )}

          {/* Search and filters */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Space wrap>
              <Input.Search
                placeholder="Search order, customer, or email"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
                onSearch={handleSearch}
                allowClear
                enterButton={<SearchOutlined />}
                style={{ width: 320, maxWidth: "100%" }}
              />

              <Select
                value={filters.status}
                onChange={handleStatusChange}
                style={{ width: 170 }}
                options={[
                  { label: "All payments", value: "all" },
                  { label: "Paid", value: "paid" },
                  { label: "Pending", value: "pending" },
                  { label: "Authorized", value: "authorized" },
                  { label: "Refunded", value: "refunded" },
                  { label: "Voided", value: "voided" },
                  { label: "Unpaid", value: "unpaid" },
                ]}
              />
            </Space>

            <Text type="secondary">
              {totalOrders} orders found
            </Text>
          </div>

          {/* Orders table */}
          <Table
            rowKey={(record) => record.id || record.shopifyOrderId}
            columns={columns}
            dataSource={orders}
            loading={loading}
            scroll={{ x: 1000 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    error
                      ? "Unable to load orders"
                      : "No orders found"
                  }
                />
              ),
            }}
            pagination={{
              current: Number(pagination.page ?? filters.page),
              pageSize: Number(pagination.limit ?? filters.limit),
              total: totalOrders,
              showSizeChanger: true,
              pageSizeOptions: ["10", "16", "20", "50"],
              showTotal: (total, range) =>
                `${range[0]}–${range[1]} of ${total} orders`,
            }}
            onChange={handleTableChange}
          />
        </Card>
      </div>
    </div>
  );
};

export default Orders;
