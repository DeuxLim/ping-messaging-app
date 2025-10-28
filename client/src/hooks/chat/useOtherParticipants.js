import { useEffect, useState } from "react";
import { getOtherParticipants } from "../../utilities/utils";

/**
 * React hook that returns other participants in a chat, excluding current user.
 */
export default function useOtherParticipants(chatData, currentUserId) {
	const [others, setOthers] = useState([]);

	useEffect(() => {
		setOthers(getOtherParticipants(chatData?.participants, currentUserId));
	}, [chatData?.participants, currentUserId]);

	return others;
}
