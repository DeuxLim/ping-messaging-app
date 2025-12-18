import { BiFoodMenu } from "react-icons/bi";
import ChatItemAvatar from "../global/ChatItem/ChatItemAvatar";
import { TbMessageCircleFilled } from "react-icons/tb";
import useAuth from "../../../hooks/useAuth";
import useToggle from "../../../hooks/common/useToggle";

export default function IconMenu() {
    const [isIconMenuDisplayed, setIsIconMenuDisplayed] = useToggle(false);
    const { currentUser } = useAuth();

    return (
        <div className="flex justify-center items-center flex-col">
            <div className="flex-1">
                <div className="flex flex-col w-60">
                    <div className="bg-gray-200 rounded-lg flex justify-center items-center w-full gap-2.5 px-2.5 py-2.5">
                        <TbMessageCircleFilled className="text-2xl" />
                        <div className="flex-1 text-sm">
                            Chats
                        </div>
                    </div>
                    {!isIconMenuDisplayed && <div className="w-[90%] h-2 border-b border-gray-300"></div>}
                </div>
            </div>

            {/* User Settings */}
            <div className="flex gap-1 items-center justify-center max-h-20 w-full px-4">
                <div className="flex-1 flex justify-start items-center ">
                    <ChatItemAvatar data={{ chatPhotoUrl: currentUser.profilePicture.url, containerClass: "size-8" }} />
                    <div className="flex flex-col items-start p-2 text-xs">
                        <div>{currentUser.fullName}</div>
                        <div>{currentUser.userName}</div>
                    </div>
                </div>

                {/* Toggle Menu */}
                <button onClick={setIsIconMenuDisplayed} className="size-9 rounded-full bg-gray-200 flex justify-center items-center">
                    <BiFoodMenu className="text-xl" />
                </button>
            </div>
        </div>
    )
}
