import { useEffect, useState } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { IoPersonAddOutline } from "react-icons/io5"; import useAuth from "../../../hooks/useAuth";
import { fetchAPI } from "../../../api/fetchApi";
import ChatItem from "../global/ChatItem";

export default function SidebarChats() {
    const { token } = useAuth();
    const [chatList, setChatList] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;
        fetchAPI.setAuth(token);

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch both in parallel
                const [chatsResponse, usersResponse] = await Promise.all([
                    fetchAPI.get("/chats"),
                    fetchAPI.get("/users/suggested") // Backend should filter users you don't chat with
                ]);

                console.log("chats : ", chatsResponse);
                console.log("users : ", usersResponse);

                setChatList(chatsResponse || []);
                setSuggestedUsers(usersResponse || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load chats. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (isLoading) {
        return (
            <section className="flex-1 p-3 flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex-1 p-3 flex items-center justify-center">
                <div className="text-red-400">{error}</div>
            </section>
        );
    }

    return (
        <section className="flex-1 p-3">
            {/* Messages Section */}
            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <div>Messages</div>
                    <BiMessageRounded />
                </div>

                <div className="text-sm flex flex-col gap-3">
                    {chatList.length > 0 ? (
                        chatList.map((chat) => (
                            <ChatItem key={chat._id} chatData={chat}/>
                        ))
                    ) : (
                        <div className="p-4 flex justify-center items-center text-lg text-gray-400 h-60">
                            Looks a little quiet here 👋
                        </div>
                    )}
                </div>
            </div>

            {/* Suggested Users Section */}
            {suggestedUsers.length > 0 && (
                <div>
                    <div className="flex justify-between mb-2">
                        <div>Suggested</div>
                        <IoPersonAddOutline />
                    </div>

                    <div className="text-sm flex flex-col gap-3">
                        {suggestedUsers.map((user) => (
                            <ChatItem key={user._id} chatData={user} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}