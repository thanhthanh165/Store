import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Button, Divider, Form, Input, message } from 'antd';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CONFIG from '../../config';
import '../css/Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      // Gửi yêu cầu đăng nhập đến máy chủ
      const response = await axios.post(`${CONFIG.API_URL}auth/login`, values);

      if (response.status === 200) {
        // Đăng nhập thành công
        message.success('Đăng nhập thành công');
        console.log(response.data.user);
        // Lưu thông tin người dùng vào local storage hoặc Redux state (tuỳ thuộc vào cách bạn quản lý trạng thái đăng nhập)
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.dispatchEvent(new Event('storage'));
        // Chuyển đến trang chính hoặc trang sau khi đăng nhập thành công
        if (response.data.user.role === 'admin') navigate('/admin/quan-ly-san-pham');
        else navigate('/'); // Thay đổi thành đường dẫn mong muốn
      } else {
        // Đăng nhập thất bại, hiển thị thông báo lỗi
        message.error('Đăng nhập thất bại: ' + response.data.message);
      }
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      // Xử lý lỗi và hiển thị thông báo lỗi cho người dùng
      message.error('Đã xảy ra lỗi khi đăng nhập');
    }
  };

  const handleRegister = () => {
    // Chuyển đến trang đăng ký
    console.log('Chuyển đến trang đăng ký');
  };

  const handleForgotPassword = () => {
    // Chuyển đến trang quên mật khẩu
    console.log('Chuyển đến trang quên mật khẩu');
  };

  const handleGoogleLogin = (credentialResponse) => {
    const decoded = jwt_decode(credentialResponse.credential);

    const { name, email, picture } = decoded;
    const googleUser = {
      name,
      email,
      picture,
    };
    console.log('du lieu gui di', googleUser);
    // Gửi đối tượng user lên server
    axios
      .post(`${CONFIG.API_URL}auth/google/login`, googleUser)
      .then((response) => {
        // Xử lý phản hồi từ server sau khi gửi thành công
        if (response.status === 200) {
          // Lưu thông tin người dùng vào local storage
          localStorage.setItem('user', JSON.stringify(response.data));
          console.log(response.data);
          console.log('Lưu trên localStorage thành công');

          // Cập nhật lại trạng thái đăng nhập và thông tin người dùng trong phần header
          window.dispatchEvent(new Event('storage'));
          // Tải lại trang để cập nhật thông tin đăng nhập
          navigate(-1);
        }
      })
      .catch((error) => {
        console.error('Lỗi khi gửi yêu cầu POST:', error);
      });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Đăng nhập</h2>
        <Form onFinish={handleLogin}>
          <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" className="input-field" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Mật khẩu" className="input-field" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <p className="login-link">
          Bạn chưa có tài khoản?{' '}
          <Link to="/register">
            <a onClick={handleRegister}>Đăng ký ngay</a>
          </Link>
        </p>
        <p className="login-link">
          <a onClick={handleForgotPassword}>Quên mật khẩu?</a>
        </p>
        <Divider />
        <div className="google-login-button">
          <GoogleOAuthProvider clientId="784111210562-0m56kmhe9jfaugmrngol9ot58c870k8r.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log('Login Failed');
              }}
              className="google-login-button"
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default Login;
