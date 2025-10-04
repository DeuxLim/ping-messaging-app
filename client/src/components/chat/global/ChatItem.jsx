import { fetchAPI } from "../../../api/fetchApi";
import useAuth from "../../../hooks/useAuth"
import useChat from "../../../hooks/useChat";

export default function ChatItem({ chatData }) {
    const { token, currentUser } = useAuth();
    const { selectChat } = useChat();

    const handleSelectChat = async ({ chatData }) => {
        fetchAPI.setAuth(token);

        let response = null;
        if (chatData.listType === "user") {
            response = await fetchAPI.post(`/chats`, chatData);
            if (response?.error) {
                console.log(response.error);
            }
        } else {
            response = {
                data: {
                    participants: chatData.participants,
                    chat: chatData
                },
            };
        }

        selectChat(response?.data);
    }

    let chatPhoto = null;
    let chatName = "";
    if (chatData.listType === "user") {
        chatPhoto = chatData.profilePicture;
        chatName = chatData.fullName;
    } else {
        if (chatData.isGroup) {
            chatPhoto = chatData.chatPhoto
        } else {
            let chatUser = chatData.participants.filter((participant) => participant._id !== currentUser._id);
            chatName = chatUser[0].fullName;
        }
    }

    return (
        <>
            {/* Chat box */}
            <div className="flex gap-4 items-center" onClick={() => handleSelectChat({ chatData })}>
                {/* Profile Picture */}
                <div className="border-1 border-gray-300 flex justify-center items-center rounded-full w-15 h-15">
                    {chatPhoto}
                </div>

                {/* Chat Details */}
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div>
                            {chatName}
                        </div>
                        <div>{chatData.time}</div>
                    </div>

                    <div className="flex justify-between">
                        <div>{chatData.messagePreview}</div>
                        <div>{chatData.status}</div>
                    </div>
                </div>
            </div>
        </>
    )
}
