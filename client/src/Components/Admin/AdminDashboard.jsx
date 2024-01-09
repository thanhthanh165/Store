import {
  CarryOutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import EditProduct from "./EditProduct";
import FormCreateProduct from "./FormCreateProduct";
import OrderManagement from "./OrderManagement";
import ProductManagement from "./ProductManagement";
import SalesStatistics from "./SalesStatistics";
// axios test

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const colorBgContainer = "#EEE0E5";
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi local storage
    // setIsLoggedIn(false); // Đánh dấu chưa đăng nhập
    // setUser(null); // Xóa thông tin người dùng trong state
    navigate('/');
    window.location.reload();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu.Item key="1" icon={<UploadOutlined/>}>
            <Link to="quan-ly-san-pham">Quản lý sản phẩm</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<CarryOutOutlined />}>
            <Link to="quan-ly-don-hang">Quản lý đơn hàng</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            <Link to="thong-ke">Thống kê</Link>
          </Menu.Item>
          <Menu.Item key="4" onClick={handleLogout} icon={<LogoutOutlined />}>
            <Link to="/">Đăng xuất</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path="/quan-ly-san-pham" element={<ProductManagement />} />
            <Route path="/quan-ly-san-pham/tao-moi-san-pham" element={<FormCreateProduct />}/>
            <Route path="/quan-ly-san-pham/:id/edit" element={<EditProduct />}/>
            <Route path="/quan-ly-don-hang" element={<OrderManagement />} />
            <Route path="/thong-ke" element={< SalesStatistics />} />
            
          </Routes>

          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
