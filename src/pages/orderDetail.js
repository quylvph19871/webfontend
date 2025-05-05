// 1. Lấy chi tiết đơn hàng từ API
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetail } from "../api/orderApi";

const OrderDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [order, setOrder] = useState(null);

  useEffect(() => {
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
      {/* 2. Hiển thị ngày đặt hàng */}
      <div style={styles.section}>
        <h3>Ngày đặt hàng</h3>
        <p>{new Date(order.orderDate).toLocaleString("vi-VN")}</p>
      </div>

      {/* 3. Thông tin người nhận */}
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

      {/* 4. Danh sách sản phẩm */}
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

      {/* 5. Tổng số tiền */}
      <div style={styles.section}>
        <h3>Tổng số tiền</h3>
        <p>
          <strong>Tổng số tiền:</strong> {order.totalAmount.toLocaleString()}{" "}
          VND
        </p>
      </div>
    </div>
  );
};

// 12. Giao diện đẹp (styles)
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
  section: {
    marginBottom: "30px",
    fontSize: "16px",
    color: "#555",
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
