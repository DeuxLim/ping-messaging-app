import useChat from '../../../hooks/useChat';
import { getOtherParticipant } from '../../../utilities/utils';
import useAuth from '../../../hooks/useAuth';
import useOtherParticipants from '../../../hooks/chat/useOtherParticipants';
import AvatarImage from '../global/AvatarImage';
import { RxCaretRight, RxCaretDown } from "react-icons/rx";
import useToggle from '../../../hooks/common/useToggle';
import CenterPopUpModal from '../../common/CenterPopUpModal';

export default function ChatSettings() {
    const { activeChatData, onlineUsers } = useChat();
    const { currentUser } = useAuth();
    const [menuExpanded, setMenuExpanded] = useToggle();
    const [isEditingNickname, setIsEditingNickname] = useToggle();

    const chatParticipants = useOtherParticipants(activeChatData, currentUser._id);
    const isGroup = !!activeChatData.isGroup;
    const otherUser = !isGroup
        ? getOtherParticipant(activeChatData.participants, currentUser?._id)
        : null;
    const isOnline = otherUser?._id && onlineUsers?.[otherUser._id] || true;


    return (
        <div className="flex-1 h-full shadow-sm overflow-hidden bg-white rounded-xl p-2">
            <div className="flex justify-center items-center flex-col gap-4">

                <div className='flex flex-col justify-center items-center gap-1 w-full p-4'>

                    {/* Display Photo */}
                    <div className={`flex justify-center items-center relative`}>
                        {chatParticipants?.map((p, index) => {
                            const displayPhotos = isGroup ? (
                                <div
                                    key={p?._id}
                                    className={`absolute ${index === 0 ? 'top-8 right-20' : 'top-12 left-20'}`}
                                >
                                    <div className="size-12 rounded-full overflow-hidden">
                                        <AvatarImage chatPhotoUrl={p?.profilePicture?.url} />
                                    </div>
                                </div>
                            ) : (
                                <div className="size-20 rounded-full overflow-hidden" key={`${p._id}`}>
                                    <AvatarImage chatPhotoUrl={p?.profilePicture?.url} />
                                </div>
                            );

                            return displayPhotos;
                        })}
                    </div>

                    {/* Display Names */}
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="flex flex-col justify-center items-center gap-1">
                            {isGroup ? (
                                <div className="font-semibold text-md">
                                    {otherUser.map(u => u.firstName).join(", ")}
                                </div>
                            ) : (
                                <div className="font-normal text-md text-blue-500">
                                    {otherUser?.fullName}
                                </div>
                            )}

                            {!isGroup && (
                                <div className='text-xs'>
                                    @{otherUser?.userName}
                                </div>
                            )}
                        </div>

                        <div className='text-gray-400 text-xs font-light'>
                            {isOnline ? "Active Now" : ""}
                        </div>
                    </div>
                </div>

                {/* Settings Menu */}
                <div className='w-full'>
                    <div
                        className='flex justify-between w-full items-center rounded-md p-2 hover:bg-gray-100 active:bg-gray-200'
                        onClick={() => setMenuExpanded(prev => !prev)}
                    >
                        <div className='text-sm font-semibold'>
                            Customize Chat
                        </div>
                        <div className='text-3xl'>
                            {menuExpanded ? <RxCaretDown /> : <RxCaretRight />}
                        </div>
                    </div>

                    {menuExpanded && (
                        <div className=''>
                            {/* Nicknames */}
                            <div
                                className='flex justify-between w-full items-center rounded-md p-2 hover:bg-gray-100 active:bg-gray-200 text-sm'
                                onClick={() => setIsEditingNickname(prev => !prev)}
                            >
                                <div className='flex gap-2 items-center justify-center'>
                                    <div className='size-8 rounded-full flex justify-center items-center bg-gray-200 font-semibold'>Aa</div>
                                    Edit Nicknames
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
