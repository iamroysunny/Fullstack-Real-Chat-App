import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";  // <-- FIXED HERE ✅
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");  // ✅ FIXED
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error loading users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`,);  // ✅ FIXED
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error loading messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,messageData); // ✅ FIXED
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending message");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get()
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;


        socket.on("newMessage", (newMessage) =>{
            const isMessageSentFromSelectedUser = newMessage.senderId !== selectedUser._id;
            if(isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unSubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
