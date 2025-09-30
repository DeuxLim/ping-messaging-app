import { fetchAPI } from "../../../api/fetchApi";
import useAuth from "../../../hooks/useAuth"
import useChat from "../../../hooks/useChat";

export default function ChatItem({ userInfo = {}, chatInfo = {}, type = "private" }) {
    const { token } = useAuth();
    const { selectChat } = useChat();

    const handleSelectChat = async ({userInfo, chatInfo, type}) => {
        const data = {
            type : type,
            participants : [ userInfo ],
            chatInfo : chatInfo
        };

        fetchAPI.setAuth(token);
        const response = await fetchAPI.post("/chat", data);

        if(response.error){
            console.log(response.error);
        }

        selectChat(response.data);
    }

    return (
        <>
            {/* Chat box */}
            <div className="flex gap-4 items-center" onClick={() => handleSelectChat({userInfo, chatInfo, type})}>
                {/* Profile Picture */}
                <div className="border-1 border-gray-300 flex justify-center items-center rounded-full w-15 h-15">
                    {userInfo.profilePicture}
                </div>

                {/* Chat Details */}
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div>{userInfo.firstName} {userInfo.lastName}</div>
                        { chatInfo && <div>{chatInfo.time}</div> }
                    </div>
                    {
                        chatInfo && (
                            <div className="flex justify-between">
                                <div>{chatInfo.messagePreview}</div>
                                <div>{chatInfo.status}</div>
                            </div>
                        )
                    }

                </div>
            </div>
        </>
    )
}
