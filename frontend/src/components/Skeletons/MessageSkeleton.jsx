const MessageSkeleton = () => {
    // Create an array of 6 items for skeleton messages
    const sketonMessages = Array(6).fill(null);

    return (
        <div className="flex-1 overflow-auto p-4 space-y-4">
            {sketonMessages.map((_, idx) => {
                return (
                    <div key={idx}>
                        <div className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full skeleton" />
                            </div>
                        </div>

                        <div className="chat-header mb-1">
                            <div className="skeleton h-4 w-16" />
                        </div>

                        <div className="chat-bubble bg-transparent p-0">
                            <div className="skeleton h-16 w-[200px]" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MessageSkeleton;
