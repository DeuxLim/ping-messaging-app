import useChat from '../../../hooks/useChat';
import { getOtherParticipant, getOtherParticipants } from '../../../utilities/utils';
import useAuth from '../../../hooks/useAuth';
import useOtherParticipants from '../../../hooks/chat/useOtherParticipants';
import AvatarImage from '../global/AvatarImage';
import { RxCaretRight, RxCaretDown } from "react-icons/rx";
import useToggle from '../../../hooks/common/useToggle';
import CenterPopUpModal from '../../common/CenterPopUpModal';
import { RiEdit2Fill } from "react-icons/ri";

export default function ChatSettings() {
    const { activeChatData, onlineUsers } = useChat();
    const { currentUser } = useAuth();
    const [menuExpanded, setMenuExpanded] = useToggle();
    const [isEditingNickname, setIsEditingNickname] = useToggle();

    const chatParticipants = useOtherParticipants(activeChatData, currentUser._id);
    const isGroup = !!activeChatData?.isGroup;
    const otherUser = !isGroup
        ? getOtherParticipant(activeChatData?.participants, currentUser?._id)
        : getOtherParticipants(activeChatData?.participants, currentUser?._id);

    const isOnline = otherUser?._id && onlineUsers?.[otherUser._id] || true;

    return (
        <div className="h-full shadow-sm overflow-hidden bg-white rounded-xl p-2 min-w-80 w-full max-w-[400px]">
            <div className="flex justify-center items-center flex-col gap-4">

                <div className='flex flex-col justify-center items-center gap-1 w-full p-4'>

                    {/* Display Photo */}
                    <div className={`flex justify-center items-center relative`}>
                        {activeChatData?.participants.length > 2 && (
                            <div className='size-20'>
                            </div>
                        )}
                        {chatParticipants?.map((p, index) => {
                            const displayPhotos = isGroup ? (
                                <div
                                    key={p?._id}
                                    className={`absolute ${index === 0 ? 'right-1.5 top-2' : 'left-1.5 bottom-2'}`}
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
                                    {otherUser?.map(u => u.firstName).join(", ")}
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
                            {isGroup && (
                                <div
                                    className='flex justify-between w-full items-center rounded-md p-2 hover:bg-gray-100 active:bg-gray-200 text-sm'
                                    onClick={() => setIsEditingNickname(prev => !prev)}
                                >
                                    <div className='flex gap-2 items-center justify-center'>
                                        <div className='size-8 rounded-full flex justify-center items-center bg-gray-200 font-semibold'>Aa</div>
                                        Change chat name
                                    </div>
                                </div>
                            )}

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

                    {/* Nickname edit form */}
                    <CenterPopUpModal open={isEditingNickname} onClose={() => setIsEditingNickname(false)}>
                        <div className='p-5 w-[550px] flex flex-col gap-5'>
                            <div className='flex justify-between items-center'>
                                <div></div>
                                <div className='font-medium pl-6'>Nicknames</div>
                                <div className='size-7 rounded-full bg-gray-100 text-[12px] font-bold flex justify-center items-center'>X</div>
                            </div>

                            <div>
                                {activeChatData?.participants.map((p, idx) => {
                                    return (
                                        <div key={idx} className='w-full rounded-md hover:bg-gray-50 px-2 py-4'>
                                            <div className='flex justify-between items-center gap-3'>
                                                <div className="size-10 rounded-full overflow-hidden">
                                                    <AvatarImage chatPhotoUrl={p?.profilePicture?.url} />
                                                </div>

                                                <div className='flex-1 flex flex-col'>
                                                    <div className='text-sm font-medium'>
                                                        {p.fullName}
                                                    </div>
                                                    <div className='text-xs font-light'>
                                                        {activeChatData.nicknames?.get(p._id) || "Set nickname"}
                                                    </div>
                                                </div>

                                                <div className='size-10 text-2xl rounded-full hover:bg-gray-100 flex items-center justify-center'>
                                                    <RiEdit2Fill />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CenterPopUpModal >

                </div>
            </div>
        </div>
    )
}
