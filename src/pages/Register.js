import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rePassword: "",

    fullname: "",  // Thêm fullname
    email: "",
    phone: "",     // Thêm phone
    role: "user" // Mặc định là user
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu nhập lại
    if (formData.password !== formData.rePassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/register", formData);
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
        <input type="password" name="rePassword" placeholder="Nhập lại mật khẩu" onChange={handleChange} required />
        <input type="text" name="fullname" placeholder="Họ và tên" onChange={handleChange} required />  {/*  Thêm fullname */}
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Số điện thoại" onChange={handleChange} required />  {/*  Thêm phone */}
        <select name="role" onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default Register;
