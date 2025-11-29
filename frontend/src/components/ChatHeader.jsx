import React from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/userChatStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className="p-2.5 border-b border-base-300 flex items-center justify-between">
            
            {/* LEFT: Avatar + User Info */}
            <div className="flex items-center gap-3">
                <div className="avatar">
                    <div className="size-10 rounded-full relative">
                        <img
                            src={selectedUser.profilePic || "/avatar.png"}
                            alt={selectedUser.fullName}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="font-medium">{selectedUser.fullName}</h3>
                    <p className="text-sm text-base-content/70">
                        {onlineUsers.includes(selectedUser._id)
                            ? "Online"
                            : "Offline"}
                    </p>
                </div>
            </div>

            {/* RIGHT: Close Button */}
            <button onClick={() => setSelectedUser(null)}>
                <X />
            </button>
        </div>
    );
};

export default ChatHeader;
