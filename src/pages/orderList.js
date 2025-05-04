import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../api/orderApi";
import { toast, ToastContainer } from "react-toastify";
import useDebounce from "../useHooks/useDebounce";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filterPhone, setFilterPhone] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState(""); // State for error message
  const debouncedSearch = useDebounce(filterPhone, 500);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await getOrders({
        search: debouncedSearch,
        status: filterStatus,
        fromDate,
        toDate,
      });
      setOrders(res.data);
      setError(""); // Reset error if fetch is successful
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
      setError("Không thể tải danh sách đơn hàng.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [debouncedSearch, filterStatus, fromDate, toDate]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleDetail = (id) => {
    navigate(`/orders/${id}`);
  };

  return (
    <>
      <ToastContainer />
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f0f0f0",
          minHeight: "100vh",
        }}
      >
        <div style={styles.container}>
          <h2 style={styles.title}>Quản lý đơn hàng</h2>

          <div style={styles.filterContainer}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={styles.input}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Pending">Chờ xử lý</option>
              <option value="Processed">Đã xử lý</option>
              <option value="Delivered">Đã giao</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={styles.input}
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Tìm theo số điện thoại hoặc tên người mua"
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value)}
              style={styles.input}
            />
            <button
              onClick={() => {
                setFilterPhone("");
                setFilterStatus("");
                setFromDate("");
                setToDate("");
              }}
              style={styles.clearBtn}
            >
              Xóa bộ lọc
            </button>
          </div>

          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Người nhận</th>
                <th style={styles.th}>Số điện thoại</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Ngày đặt</th>
                <th style={styles.th}>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "16px" }}
                  >
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={index} style={{ textAlign: "center" }}>
                    <td style={styles.td}>{order.shippingAddress.name}</td>
                    <td style={styles.td}>
                      {order.shippingAddress.phoneNumber}
                    </td>
                    <td style={styles.td}>{order.status}</td>
                    <td style={styles.td}>
                      {new Date(order.orderDate).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                        hour12: false,
                      })}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDetail(order._id)}
                        style={styles.detailBtn}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
    overflowX: "auto",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    padding: "8px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "8px",
    borderBottom: "1px solid #ddd",
    whiteSpace: "nowrap",
  },
  detailBtn: {
    padding: "4px 8px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  input: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    flex: "1 1 250px",
  },
  clearBtn: {
    padding: "8px 12px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};

export default OrderList;
