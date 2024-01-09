import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import HomePage from "./Components/HomePage";

function AdminRoute({ element }) {
  const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin người dùng từ local storage

  if (user && user.role === "admin") {
    return element; // Cho phép truy cập nếu đã đăng nhập và có vai trò là "admin"
  } else {
    return <Navigate to="/login" />; // Chuyển hướng đến trang đăng nhập nếu không đủ quyền hoặc chưa đăng nhập
  }

}


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/*" element={<HomePage />} />
        <Route path="/admin/*" element={<AdminRoute element={<AdminDashboard />} />} />
      </Routes>
    </div>
  );
}

export default App;
