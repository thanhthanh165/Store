import { Button, Col, Form, Input, Row, Typography } from 'antd';
import React from 'react';
import banner6 from '../Img/Bg ttlh.png';

const { Title } = Typography;

const Contact = () => {
  const onFinish = (values) => {
    console.log('Received values:', values);
  };

  const divStyle = {
    padding: '20px',
    minHeight: '600px',
    padding: '5%',
    // backgroundColor: 'white',
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '3%',
    backgroundImage: `url("${banner6}")`, // Đặt hình ảnh làm background
    backgroundSize: 'cover',
    backgroundPosition: 'center', // Đảm bảo hình ảnh bao phủ toàn bộ nền
  };

  return (
    <div style={divStyle}>
      <Title style={{ marginLeft: '16%' }}>
        <h4 >Thông tin liên hệ</h4>
      </Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form name="contact-form" onFinish={onFinish} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Form name="contact-form" onFinish={onFinish} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Please enter your name!' }]}>
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email!' },
                  { type: 'email', message: 'Invalid email format' },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Góp ý" name="message" rules={[{ required: true, message: 'Please enter your message!' }]}>
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Gửi
                </Button>
              </Form.Item>
            </Form>
          </Form>
        </Col>
        <Col span={12}>
          <div>
            <Title level={4}>Contact Information</Title>
            <p>
              <strong>Địa chỉ:</strong> Quang Trung / Hà Đông /Hà Nội
            </p>
            <p>
              <strong>Email:</strong> thanhthanh160501@gmail.com
            </p>
            <p>
              <strong>Phone:</strong> 0961652001
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Contact;
