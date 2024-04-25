const Chat = require("./../models/chat.model");

// Create a new chat
const createChat = async (req, res) => {
  try {
    const chat = new Chat(req.body);
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single chat by ID
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a chat by ID
const updateChatById = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a chat by ID
const deleteChatById = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(204).json({ message: "Chat deleted!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get chat by patientId and doctorId
const getChatByPatientAndDoctor = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      patientId: req.params.patientId,
      doctorId: req.params.doctorId,
    });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get chats by patientId
const getChatsByPatientId = async (req, res) => {
  try {
    const chats = await Chat.find({ patientId: req.params.patientId });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get chats by doctorId
const getChatsByDoctorId = async (req, res) => {
  try {
    const chats = await Chat.find({ doctorId: req.params.doctorId });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createChat,
  getChatById,
  updateChatById,
  deleteChatById,
  getChatByPatientAndDoctor,
  getChatsByPatientId,
  getChatsByDoctorId,
};
