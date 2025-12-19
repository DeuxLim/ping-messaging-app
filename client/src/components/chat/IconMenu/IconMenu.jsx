import { BiFoodMenu } from "react-icons/bi";
import ChatItemAvatar from "../global/ChatItem/ChatItemAvatar";
import { TbMessageCircleFilled } from "react-icons/tb";
import useAuth from "../../../hooks/useAuth";
import useToggle from "../../../hooks/common/useToggle";

export default function IconMenu() {
    const [isIconMenuExpanded, setIsIconMenuExpanded] = useToggle(false);
    const { currentUser } = useAuth();

    return (
        <div className="flex justify-center items-center flex-col pl-2">
            <div className="flex-1 flex flex-col">
                <div className="bg-gray-200 rounded-lg flex justify-center items-center w-full gap-2.5 px-2.5 py-2.5">
                    <TbMessageCircleFilled className="text-2xl" />
                    {isIconMenuExpanded && <div className="flex-1 text-sm  w-46">Chats</div>}
                </div>
                {!isIconMenuExpanded && <div className="w-[90%] h-2 border-b border-gray-300"></div>}
            </div>

            {/* User Settings */}
            <div className={`flex gap-1 items-center justify-center max-h-20 w-full ${!isIconMenuExpanded && "flex-col"}`}>
                <div className="flex-1 flex justify-start items-center gap-2">
                    <ChatItemAvatar data={{ chatPhotoUrl: currentUser.profilePicture.url, containerClass: "size-8" }} />
                    {isIconMenuExpanded && (
                        <div className="flex flex-col text-xs py-0.5">
                            <div className="text-sm">{currentUser.fullName}</div>
                            <div className="text-gray-500">{currentUser.userName}</div>
                        </div>
                    )}
                </div>

                {/* Toggle Menu */}
                <button onClick={setIsIconMenuExpanded} className="size-9 rounded-full bg-gray-200 flex justify-center items-center">
                    <BiFoodMenu className="text-xl" />
                </button>
            </div>
        </div>
    )
}
