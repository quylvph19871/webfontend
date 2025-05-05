import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetail } from "../api/orderApi";

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
};

export default OrderDetail;
