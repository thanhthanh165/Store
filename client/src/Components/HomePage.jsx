import { Layout } from 'antd';

import HeaderLayout from './Layout/HeaderLayout';

import { Outlet, Route, Routes } from 'react-router-dom';
import About from './About';
import Cart from './Cart/Cart';
import OrderInfo from './Cart/OrderInfo';
import OrderSuccess from './Cart/OrderSuccess';
import ReviewOrder from './Cart/ReviewOrder';
import UserChat from './Cart/UserChat';
import Contact from './Contact';
import Home from './Home';
import AppLayout from './Layout/AppLayout';
import FooterLayout from './Layout/Footer';
import ProductList from './ProductList';
import UserAddInfo from './User/AddInfoUser';
import Login from './User/Login';
import Register from './User/Register';
import UserInfo from './User/UserInfo';
import ViewProduct from './ViewProduct';
const { Header, Content } = Layout;

function HomePage() {
  return (
    <Layout>
      <HeaderLayout></HeaderLayout>
      <Content>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/ring" element={<ProductList category="1" />} />
            <Route path="/products/necklace" element={<ProductList category="2" />} />
            <Route path="/products/:id" element={<ViewProduct />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/user/add-info" element={<UserAddInfo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-info" element={<UserInfo />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order/success" element={<OrderSuccess />} />
            <Route path="/order-info" element={<OrderInfo />} />
            <Route path="/review" element={<ReviewOrder />} />
            <Route path="/chat/:productId" element={<UserChat />} />
          </Route>
        </Routes>

        <Outlet />
      </Content>
      <FooterLayout></FooterLayout>
    </Layout>
  );
}
export default HomePage;
