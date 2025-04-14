import React, { useState } from "react";
import axios from "axios";

const Register = () => {

  return (
    <div>
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Mật khẩu" required />
        <input type="password" name="rePassword" placeholder="Nhập lại mật khẩu" required />
        <input type="text" name="fullname" placeholder="Họ và tên" required />  {/*  Thêm fullname */}
        <input type="email" name="email" placeholder="Email" required />
        <input type="text" name="phone" placeholder="Số điện thoại" required />  {/*  Thêm phone */}
        <select name="role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default Register;
