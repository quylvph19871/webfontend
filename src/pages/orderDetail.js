import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDetail } from "../api/orderApi";
import backImage from "../assets/img.png";
const paymentMethods = {
  Momo: "Trả trước bằng Momo",
  "Cash On Delivery": "Thanh toán khi nhận được hàng",
};
const STATUS = {
  Pending: "Đang chờ xử lý",
  Processed: "Đã xử lý và đang chuẩn bị giao hàng",
  Delivered: "Đã giao hàng thành công",
  Cancelled: "Đơn hàng bị hủy",
};

const paymentStatus = {
  Paid: "Đã thanh toán",
  Unpaid: "Chưa thanh toán",
};

const OrderDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [order, setOrder] = useState(null); // chứa dữ liệu chi tiết đơn hàng sau khi fetch từ server
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    // trả về màu tương ứng với trạng thái đơn hàng
    switch (status) {
      case "Pending":
        return "#FFCC00"; // Màu vàng
      case "Processed":
        return "#28a745"; // Màu xanh lá
      case "Delivered":
        return "#007bff"; // Màu xanh dương
      default:
        return "#6c757d"; // Màu xám
    }
  };

  useEffect(() => {
    // gọi api backend và set vào state order
    const fetchOrder = async () => {
      try {
        const res = await getDetail(id);
        console.log(res.data);
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

  if (!order) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Nút Back */}
      {/* Nút Back với hình ảnh */}
      <button
        onClick={() => navigate(-1)} // Quay lại trang trước đó
        style={styles.backButton}
      >
        <img src={backImage} alt="Back" style={styles.backImage} />
      </button>

      <h2 style={styles.title}>Chi tiết đơn hàng</h2>
      {/* Ngày đặt hàng */}
      <div style={styles.section}>
        <h3>Ngày đặt hàng</h3>
        <p>{new Date(order.orderDate).toLocaleString("vi-VN")}</p>
      </div>
      {/* Thông tin người nhận */}
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

      {/* Thông tin sản phẩm */}
      <div style={styles.section}>
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
      </div>

      {/* Tổng tiền */}
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

      {/* Trạng thái đơn hàng */}
      <div style={styles.section}>
        <h3>Trạng thái đơn hàng</h3>
        <p>
          <strong>Trạng thái hiện tại:</strong> {STATUS[order.status]}
        </p>
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
              {STATUS[status.status]} ( Người thực hiện :{" "}
              {status.changedBy.fullname} )
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
  backButton: {
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
    fontSize: "16px",
    display: "inline-flex",
    alignItems: "center",
  },
  backImage: {
    width: "20px",
    height: "20px",
    marginRight: "8px", // Giữ khoảng cách giữa biểu tượng và chữ nếu có
  },
  product: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    marginBottom: "15px",
    backgroundColor: "#fafafa",
  },
  statusHistory: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    marginBottom: "10px",
    backgroundColor: "#f1f1f1",
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
  tableRow: {
    transition: "background-color 0.3s ease",
  },
  tableRowHover: {
    backgroundColor: "#f1f1f1",
  },
  totalAmountSection: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    borderTop: "2px solid #ddd",
    paddingTop: "20px",
  },
  paymentMethod: {
    fontSize: "16px",
    marginTop: "10px",
  },
  statusColor: {
    padding: "8px",
    borderRadius: "5px",
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
};

export default OrderDetail;
