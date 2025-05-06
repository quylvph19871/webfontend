import React, { useState } from 'react';
import RevenueChart from './RevenueChart';

const DashBoard = () => {
    const [timeframe, setTimeframe] = useState('week'); // Mặc định là tuần

    const handleTimeframeChange = (e) => {
        setTimeframe(e.target.value);
    };

    return (
        <div>
            <h1>Thống kê doanh thu</h1>
            <div>
                <label htmlFor="timeframe">Chọn khoảng thời gian: </label>
                <select id="timeframe" value={timeframe} onChange={handleTimeframeChange}>
                    <option value="week">Tuần</option>
                    <option value="month">Tháng</option>
                    <option value="year">Năm</option>
                </select>
            </div>

            <RevenueChart timeframe={timeframe} />
        </div>
    );
};

export default DashBoard;
