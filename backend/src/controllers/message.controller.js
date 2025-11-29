import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketIds, io } from "../lib/socket.js"; // ✅ plural

/* ===================== GET USERS (SIDEBAR LIST) ===================== */
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ===================== GET CHAT MESSAGES ===================== */
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ===================== SEND A MESSAGE ===================== */
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    let imageUrl = null;

    // Upload image to Cloudinary (if exists)
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chat_app_messages",
      });
      imageUrl = uploadResponse.secure_url;
    }

    // Create message in DB
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    // ✅ Realtime message emit to all devices of receiver
    const receiverSocketIds = getReceiverSocketIds(receiverId);
    receiverSocketIds.forEach(socketId => {
      io.to(socketId).emit("newMessage", newMessage);
    });

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
