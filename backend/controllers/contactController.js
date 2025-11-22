import Contact from "../models/Contact.js";

export const addMessage = async (req, res) => {
  try {
    const message = await Contact.create(req.body);
    res.status(201).json({ message: "Message received successfully", data: message });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message", error });
  }
};
