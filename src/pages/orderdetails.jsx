import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Descriptions, Spin, Table, Tag, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

import OrderService from "../sevice/order";
import useAsync from "../hooks/useAsync";

const { Title, Text } = Typography;

const OrderDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { data: orderData, loading } = useAsync(() =>
    OrderService.getOrderById(state)
  );

  const order = orderData?.data?.data ?? orderData?.data ?? orderData ?? null;

  console.log(order);

  const formatPrice = (price, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(Number(price ?? 0));

  const columns = [
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      render: (sku) => sku || "—",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => formatPrice(price, order?.currency),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => formatPrice(price, order?.currency),
    },
  ];


  if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spin size="large" tip="Loading order details..." />
    </div>
  );
}
  

  if (!order) {
    return (
      <>
        <div className="p-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Back to Orders
          </Button>
          <Text className="mt-4 block">Order not found.</Text>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/")}
          >
            Back to Orders
          </Button>

          <Title level={2} className="!mt-4 !mb-1">
            Order {order.orderNumber}
          </Title>

          <Text type="secondary">
            Created:{" "}
            {order.shopifyCreatedAt
              ? new Date(order.shopifyCreatedAt).toLocaleString()
              : new Date(order.createdAt).toLocaleString()}
          </Text>
        </div>

        <Card title="Order Information">
          <Descriptions bordered column={{ xs: 1, sm: 2, lg: 3 }}>
            <Descriptions.Item label="Order Number">
              {order.orderNumber}
            </Descriptions.Item>

            <Descriptions.Item label="Shopify Order ID">
              {order.shopifyOrderId}
            </Descriptions.Item>

            <Descriptions.Item label="Payment Status">
              <Tag color="blue">
                {order.financialStatus || "Unknown"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Fulfillment Status">
              <Tag color="processing">
                {order.fulfillmentStatus || "Unfulfilled"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Total Amount">
              <Text strong>
                {formatPrice(order.totalPrice, order.currency)}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item label="Currency">
              {order.currency}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Customer Information">
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Customer Name">
              {order.customerName || "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {order.email || "—"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Order Items">
          <Table
            rowKey={(item) => item.id || item.shopifyLineItemId}
            columns={columns}
            dataSource={order.items || []}
            pagination={false}
            scroll={{ x: 700 }}
          />

          <div className="mt-4 flex justify-end">
            <Title level={4}>
              Total: {formatPrice(order.totalPrice, order.currency)}
            </Title>
          </div>
        </Card>
      </div>
    </>
  );
};

export default OrderDetails;
