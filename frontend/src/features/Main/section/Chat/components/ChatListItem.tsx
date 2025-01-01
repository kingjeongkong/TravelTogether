interface ChatListItemProps {
  profileImage: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessages: number;
  onClick: () => void;
}

const ChatListItem = ({
  profileImage,
  name,
  lastMessage,
  lastMessageTime,
  unreadMessages,
  onClick
}: ChatListItemProps) => {
  return (
    <div
      className="flex gap-2 px-2 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="items-center justify-center flex-shrink-0">
        <img src={profileImage} alt={name} className="w-12 h-12 rounded-full" />
      </div>
      <div className="flex flex-col flex-1">
        <span>{name}</span>
        <span className="text-gray-700 line-clamp-2">{lastMessage}</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-gray-500">{lastMessageTime}</span>
        {unreadMessages > 0 && (
          <span className="text-sm rounded-full w-5 h-5 text-center text-white bg-orange-400">
            {unreadMessages}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatListItem;
