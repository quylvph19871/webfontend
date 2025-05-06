import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "../styles/ChatWeb.css";

const socket = io("http://192.168.51.7:5000");
const API_URL = "https://666036505425580055b2cffb.mockapi.io/chatApi";

function ChatWeb() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(API_URL);
      const sorted = res.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setMessages(sorted);
    } catch (err) {
      console.error("Fetch MockAPI error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      // Không dùng setMessages local → sẽ bị ghi đè khi fetchMessages chạy
      fetchMessages();  // luôn reload từ API khi có tin nhắn socket
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "") return;
    const newMessage = { text: message, sender: "web", timestamp: new Date().toISOString() };

    // Không setMessages local ở đây → tránh xung đột
    socket.emit('send_message', newMessage);

    try {
      await axios.post(API_URL, newMessage);
      await fetchMessages();  // load lại danh sách sau khi gửi
    } catch (err) {
      console.error("Save to MockAPI error:", err);
    }

    setMessage('');
  };

  const handleScreenPress = () => {
    fetchMessages(); // Thủ công tải lại tin nhắn
  };

  return (
    <div className="chat-container" onClick={handleScreenPress}>
      <h1>Chat khách</h1>
      <div className="messages-container">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`message ${item.sender === 'web' ? 'message-sent' : 'message-received'}`}
          >
            {item.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          className="input-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn"
        />
        <button onClick={sendMessage} className="send-button">
          Gửi
        </button>
      </div>
    </div>
  );
}

export default ChatWeb;
