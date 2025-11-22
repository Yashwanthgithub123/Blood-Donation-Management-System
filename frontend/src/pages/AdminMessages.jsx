import React, { useEffect, useState } from "react";
import "../styles/AdminMessages.css";
import axios from "axios";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contacts");
      setMessages(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      alert("Message deleted successfully!");
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert("Failed to delete message.");
    }
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="admin-messages-container">
      <div className="admin-messages-card">
        <h2>Contact Messages</h2>
        {messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <table className="messages-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.subject}</td>
                  <td>{msg.message}</td>
                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                  <td className="actions">
                    <button className="delete-btn" onClick={() => handleDelete(msg._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;