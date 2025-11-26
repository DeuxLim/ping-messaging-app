import useAuth from '../../../hooks/useAuth';
import useChat from '../../../hooks/useChat';
import { getOtherParticipant } from '../../../utilities/utils';
import AvatarImage from '../global/AvatarImage';

export default function ChatDetailsPanel() {
    const { activeChatData } = useChat();
    const { currentUser } = useAuth();

    const isGroup = !!activeChatData.isGroup;
    const otherUser = !isGroup
        ? getOtherParticipant(activeChatData.participants, currentUser?._id)
        : null;

    return (
        <div className="flex justify-center items-center mt-4 flex-col gap-4">
            {activeChatData.participants.map((p) => {
                if (!isGroup && p._id === currentUser._id) return;

                return (
                    <div className="size-40 rounded-full overflow-hidden" key={`${p._id}`}>
                        <AvatarImage chatPhotoUrl={p?.profilePicture?.url} />
                    </div>
                );
            })}


            {!isGroup && (
                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="flex flex-col justify-center items-center">
                        <div className="font-semibold text-2xl">
                            {otherUser.fullName}
                        </div>
                        <div>
                            @{otherUser.userName}
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <button type="button" className="py-2 px-2 text-xs bg-gray-300 flex justify-center items-center rounded-full font-semibold">
                            View Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
