import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";

const TopSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("week");

  const timeOptions = [
    { label: "Hôm nay", value: "day" },
    { label: "Tuần này", value: "week" },
    { label: "Tháng này", value: "month" },
    { label: "Năm nay", value: "year" },
  ];

  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/dashboard/top-products-by-timeframe?timeframe=${timeframe}`
        );
        setProducts(response.data.slice(0, 5)); // Lấy top 5 sản phẩm
      } catch (error) {
        console.error("Lỗi khi tải top sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [timeframe]);

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2>Top sản phẩm bán chạy nhất</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          style={{ padding: "6px 10px" }}
        >
          {timeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {products.map((product, index) => (
            <div
              key={product._id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <img
                src={product?.image}
                alt={product.name}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginRight: "16px",
                }}
              />
              <div style={{ textAlign: "left" }}>
                <h4 style={{ margin: 0 }}>
                  {index + 1}. {product.name}
                </h4>
                <p style={{ margin: "4px 0" }}>
                  Giá: {product.price.toLocaleString()}₫
                </p>
                <p style={{ margin: 0 }}>Đã bán: {product.totalSold}</p>
                <p style={{ margin: 0 }}>
                  Doanh thu:{" "}
                  {(product.totalSold * product.price).toLocaleString()}₫
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopSellingProducts;
