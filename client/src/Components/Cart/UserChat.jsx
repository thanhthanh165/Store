import { Button, Card, Col, Image, Input, Row, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CONFIG from '../../config';

const { Title, Text, Paragraph } = Typography;



function UserChat() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${CONFIG.API_URL}chat/${productId}`)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [productId]);

  const handleInterest = () => {
    // Kiểm tra xem sản phẩm đã được chọn hay chưa
    if (!product) {
      return;
    }
    const userJson = localStorage.getItem('user');
const user = JSON.parse(userJson);
const userId = user._id;

    const messageText = `Tôi đang quan tâm đến sản phẩm ${product.name} (${productId}) `;
    const newMessage = {
      sender: 'user', // ID của người dùng
      text: messageText,
      userId: userId,
    };

    // Gửi tin nhắn lên server thông qua axios hoặc phương thức khác
    axios
      .post(`${CONFIG.API_URL}chat/user/${productId}/messages`, newMessage)
      .then((response) => {
        console.log('Tin nhắn quan tâm đã được gửi lên server');
        // Cập nhật danh sách tin nhắn
        setMessages([...messages, newMessage]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const sendMessage = () => {
    // Gửi tin nhắn mới đến server cùng với thông tin người dùng (userID);
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    const userId = user._id;
    
    const messageData = {
      text: newMessage,
      userId: userId,
      // Thêm thông tin sản phẩm
    };

    axios
      .post(`${CONFIG.API_URL}chat/user/sendMessage`, messageData)
      .then((response) => {
        // Tin nhắn đã được gửi thành công, cập nhật danh sách tin nhắn
        setMessages([...messages, { text: newMessage, sender: 'user', userId: userId }]);
        setNewMessage('');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="chat-container">
      {product && (
        <Card size="small">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={200} // Điều chỉnh chiều rộng của ảnh
                height={200}
              />
            </Col>
            <Col span={16}>
              <Title level={4}>{product.name}</Title>
              <Text>Giá: {product.price} đ</Text>
              <Paragraph>{product.description}</Paragraph>
            </Col>
          </Row>

          <Button type="primary" onClick={handleInterest}>
            Tôi đang quan tâm đến sản phẩm
          </Button>
        </Card>
      )}

      <Card className="message-container" size="small">
        <div className="message-list">
          aaaa
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="message-input">
          <Input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onPressEnter={sendMessage}
          />
          <Button type="primary" onClick={sendMessage}>
            Gửi
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default UserChat;
