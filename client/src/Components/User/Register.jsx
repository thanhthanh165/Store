import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, message } from "antd";
import axios from 'axios';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CONFIG from "../../config";
import "../css/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [form] = Form.useForm(); // Tạo form instance

  const handleRegister = async (values) => {
    try {
      const response = await axios.post(`${CONFIG.API_URL}auth/register`, values);
      if (response.status === 201) {
        // Đăng ký thành công
        setRegisterSuccess(true);
        message.success('Đăng ký thành công');
        form.resetFields(); // Đặt lại các trường trong form
      } else {
        // Đăng ký thất bại, hiển thị thông báo lỗi
        message.error('Đăng ký thất bại: ' + response.data.message);
      }
    } catch (error) {
      console.error('Đăng ký thất bại:', error);
      // Xử lý lỗi và hiển thị thông báo lỗi cho người dùng
      message.error('Đã xảy ra lỗi khi đăng ký');
    }
  };

  const handleLogin = () => {
    // Chuyển đến trang đăng nhập
    console.log("Chuyển đến trang đăng nhập");
    navigate(`/login`);
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className="register-title">Đăng ký</h2>
        <Form form={form} onFinish={handleRegister}> {/* Sử dụng form instance */}
          {/* ... Các trường form khác như trước ... */}
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Tên"
              className="input-field"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
              className="input-field"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải chứa ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Mật khẩu"
              className="input-field"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Xác nhận mật khẩu"
              className="input-field"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-button"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <p className="register-link">
      Đã có tài khoản? <a onClick={handleLogin} style={{color:'#1677ff  '}}>Đăng nhập ngay</a>
        </p>
        <Divider />
      </div>
    </div>
  );
};

export default Register;
