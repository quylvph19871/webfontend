import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Sử dụng Bar chart thay vì Line chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from "../api/axiosClient";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = ({ timeframe }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get(`/dashboard/stats-by-timeframe?timeframe=${timeframe}`);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, [timeframe]);

    const formatData = () => {
        if (!data || data.length === 0) return { labels: [], datasets: [] };

        const labels = data.map(item => {
            if (timeframe === 'week') {
                return `Ngày ${item._id.day}`; // Hiển thị ngày trong tuần
            } else if (timeframe === 'month') {
                return `Tháng ${item._id.month}`; // Hiển thị tháng
            } else if (timeframe === 'year') {
                return `Năm ${item._id.year}`; // Hiển thị năm
            }
        });

        const totalRevenue = data.map(item => item.totalRevenue);
        const totalOrders = data.map(item => item.totalOrders);

        return {
            labels,
            datasets: [
                {
                    label: 'Doanh thu',
                    data: totalRevenue,
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75,192,192,0.6)', // Màu nền của các cột
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(75,192,192,0.8)', // Màu khi hover
                },
                {
                    label: 'Số đơn hàng',
                    data: totalOrders,
                    borderColor: 'rgba(255,99,132,1)',
                    backgroundColor: 'rgba(255,99,132,0.6)', // Màu nền của các cột
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.8)', // Màu khi hover
                },
            ],
        };
    };

    const chartData = formatData();

    return (
        <div style={{ width: '80%', margin: '0 auto', paddingTop: '20px' }}>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: `Biểu đồ doanh thu và số đơn hàng (${timeframe})`,
                                font: { size: 18, weight: 'bold' }, // Định dạng title
                                padding: { top: 20, bottom: 20 },
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const value = context.raw;
                                        return `${context.dataset.label}: ${value.toLocaleString()}`;
                                    },
                                },
                            },
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false, // Ẩn đường lưới theo chiều ngang
                                },
                                ticks: {
                                    font: {
                                        size: 12, // Cỡ chữ cho các nhãn trên trục x
                                        weight: 'bold',
                                    },
                                    color: '#333', // Màu chữ trục x
                                },
                            },
                            y: {
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.1)', // Màu đường lưới trục y
                                },
                                ticks: {
                                    font: {
                                        size: 12, // Cỡ chữ cho các nhãn trên trục y
                                        weight: 'bold',
                                    },
                                    color: '#333', // Màu chữ trục y
                                },
                            },
                        },
                    }}
                />
            )}
        </div>
    );
};

export default RevenueChart;
