import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetail } from "../api/orderApi";

const paymentMethods = {
  Momo: "Trả trước bằng Momo",
  "Cash On Delivery": "Thanh toán khi nhận được hàng",
};

const paymentStatus = {
  Paid: "Đã thanh toán",
  Unpaid: "Chưa thanh toán",
};

const STATUS = {
  Pending: "Đang chờ xử lý",
  Processed: "Đã xử lý và đang chuẩn bị giao hàng",
  Delivered: "Đã giao hàng thành công",
  Cancelled: "Đơn hàng bị hủy",
};

const OrderDetail = () => {
  // Phần 1: Lấy id từ URL
  const { id } = useParams();

  // Phần 2: Khai báo state lưu đơn hàng
  const [order, setOrder] = useState(null);

  // Phần 3: Hàm đổi màu trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFCC00";
      case "Processed":
        return "#28a745";
      case "Delivered":
        return "#007bff";
      default:
        return "#6c757d";
    }
  };

  // Phần 4: Gọi API lấy chi tiết đơn hàng
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getDetail(id);
        if (res.data) {
          setOrder(res.data);
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
        setOrder(null);
      }
    };
    fetchOrder();
  }, [id]);

  // Phần 5: Loading
  if (!order) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Chi tiết đơn hàng</h2>

      {/* Phần 12: Ngày đặt hàng */}
      <div style={styles.section}>
        <h3>Ngày đặt hàng</h3>
        <p>{new Date(order.orderDate).toLocaleString("vi-VN")}</p>
      </div>

      {/* Phần 8: Thông tin người nhận */}
      <div style={styles.section}>
        <h3>Thông tin người nhận</h3>
        <p>
          <strong>Tên:</strong> {order?.shippingAddress?.name}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {order?.shippingAddress?.phoneNumber}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {order?.shippingAddress?.address}
        </p>
      </div>

      {/* Phần 9: Thông tin sản phẩm */}
      <div style={styles.section}>
        <h3>Sản phẩm đã mua</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Sản phẩm</th>
              <th style={styles.tableHeader}>Tên sản phẩm</th>
              <th style={styles.tableHeader}>Màu sắc</th>
              <th style={styles.tableHeader}>Size</th>
              <th style={styles.tableHeader}>Số lượng</th>
              <th style={styles.tableHeader}>Giá</th>
            </tr>
          </thead>
          <tbody>
            {order?.products.map((product, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{product?.productId?._id}</td>
                <td style={styles.tableCell}>
                  {product?.productId?.name_product}
                </td>
                <td style={styles.tableCell}>{product.color}</td>
                <td style={styles.tableCell}>{product.size}</td>
                <td style={styles.tableCell}>{product.quantity}</td>
                <td style={styles.tableCell}>
                  {product.price.toLocaleString()} VND
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phần 10 & 11: Tổng tiền & thanh toán */}
      <div style={styles.section}>
        <h3>Tổng số tiền</h3>
        <p>
          <strong>Tổng số tiền:</strong> {order.totalAmount.toLocaleString()}{" "}
          VND
        </p>
        <p>
          <strong>Phương thức thanh toán:</strong>{" "}
          {paymentMethods[order.paymentMethod]}
        </p>
        <p>
          <strong>Trạng thái thanh toán:</strong>{" "}
          {paymentStatus[order.paymentStatus]}
        </p>
      </div>

      {/* Phần 6: Trạng thái đơn hàng */}
      <div style={styles.section}>
        <h3>Trạng thái đơn hàng</h3>
        <p>
          <strong>Trạng thái hiện tại:</strong> {STATUS[order.status]}
        </p>
      </div>

      {/* Phần 7: Lịch sử trạng thái */}
      <div style={styles.section}>
        <h3>Lịch sử trạng thái:</h3>
        {order.statusHistory.map((status, index) => (
          <div
            key={index}
            style={{
              ...styles.statusHistory,
              backgroundColor: getStatusColor(status.status),
            }}
          >
            <p style={{ color: "white" }}>
              <strong>{new Date(status.date).toLocaleString("vi-VN")}</strong>
            </p>
            <p style={{ color: "white" }}>
              {STATUS[status.status]} (Người thực hiện:{" "}
              {status.changedBy.fullname})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    width: "80%",
    textAlign: "left",
    margin: "40px auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontWeight: "bold",
    fontSize: "28px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginBottom: "30px",
    fontSize: "16px",
    color: "#555",
  },
  statusHistory: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    marginBottom: "10px",
    transition: "background-color 0.3s ease",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  tableHeader: {
    padding: "12px",
    border: "1px solid #ddd",
    backgroundColor: "#f8f9fa",
    textAlign: "left",
    fontWeight: "bold",
    color: "#333",
    fontSize: "16px",
  },
  tableCell: {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left",
    color: "#555",
    fontSize: "14px",
  },
};

export default OrderDetail;
