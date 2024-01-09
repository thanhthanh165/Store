import { Avatar, Button, Col, Input, List, Row } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../../Components/css/AdminChat.css';
import CONFIG from '../../config';
const socket = io.connect(CONFIG.SOCKET_URL);
const { TextArea } = Input;

function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessage = async () => {
    try {
      axios
        .get(`${CONFIG.API_URL}chat/admin/getMessages`)
        .then((response) => {
          const initialMessages = response.data;
          setMessages(initialMessages);
        })
        .catch((error) => {
          console.error('Lỗi khi lấy tin nhắn từ server:', error);
        });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

 

  useEffect(() => {
    fetchMessage();
    socket.on('AdminMessageSuccess', (data) => {
      fetchMessage();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(()=>{
    console.log(selectedMessage);
  },[selectedMessage])
  
  const handleSendMessage = () => {
    axios
      .post(`${CONFIG.API_URL}chat/admin/sendMessage`, {
        text: newMessage,
        userId: selectedMessage.userId._id,
        sender: 'admin',
      })
      .then((response) => {
        setNewMessage('');
      })
      .catch((error) => {
        console.error('Lỗi khi gửi tin nhắn từ phía admin:', error);
      });
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  return (
    <div className="messenger-container">
      <Row gutter={16}>
        <Col span={6}>
          <List
            dataSource={messages}
            renderItem={(message) => (
              <List.Item
                onClick={() => handleSelectMessage(message)}
                className={`list-item ${selectedMessage === message ? 'selected' : ''}`}
              >
                <List.Item.Meta
                  avatar={<Avatar src={message.userId.picture} />}
                  title={message.userId.name}
                  description={<div className="list-item-description">{message.messages[message.messages.length - 1].text}</div>}
                />
              </List.Item>
            )}
          />
        </Col>

        <Col span={18}>
          {selectedMessage ? (
            <>
              <div>
                <ul className="message-list">
                  {selectedMessage.messages.map((message, index) => (
                    <li key={index} className={`message ${message.sender === 'user' ? 'user-message' : 'admin-message'}`}>
                      <p className="message-text">{message.text}</p>
                      <p className="message-timestamp">Thời gian: {message.timestamp}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <TextArea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  autoSize={{ minRows: 2 }}
                />
                <Button type="primary" onClick={handleSendMessage}>
                  Gửi
                </Button>
              </div>
            </>
          ) : (
            <div>
              <TextArea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                autoSize={{ minRows: 2 }}
              />
              <Button type="primary" onClick={handleSendMessage}>
                Gửi
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default AdminChat;
