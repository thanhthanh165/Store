import React from "react";
import { Navigate } from "react-router-dom";

function requireAdminRole() {
  const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin người dùng từ local storage

  if (user && user.role === "admin") {
    return <Navigate to="/admin" /> // Cho phép truy cập
  } else {
    return <Navigate to="/login" />; // Chuyển hướng đến trang đăng nhập nếu không đủ quyền
  }
}

export default requireAdminRole;
