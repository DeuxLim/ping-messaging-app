import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import useChat from "../../../contexts/chat/useChat";
import useAuth from "../../../contexts/auth/useAuth";
import useSocket from "../../../contexts/socket/useSocket";
import { fetchApi } from "../../../api/fetchApi";
import { FaThumbsUp } from "react-icons/fa6";
import { FaRegImage } from "react-icons/fa6";
import { isEmpty } from "../../../utilities/utils";
import { RxCross2 } from "react-icons/rx";
import { LuCopyPlus } from "react-icons/lu";
import { HiPaperAirplane } from "react-icons/hi2";

export default function ChatInput() {
	const [message, setMessage] = useState("");
	const { activeChatData, addOptimisticMessage } = useChat();
	const { currentUser } = useAuth();
	const { socket } = useSocket();
	const { chatId = null } = useParams();
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const [selectedMediaAttachments, setSelectedMediaAttachments] = useState([]);

	// ---- Handlers ----
	const handleSendMessage = useCallback(
		async (e) => {
			e.preventDefault();
			const trimmedMessage = message.trim();

			const finalMessage =
				!trimmedMessage && isEmpty(selectedMediaAttachments)
					? "👍"
					: trimmedMessage;

			try {
				let chatIdToUse = activeChatData.type === "temp" ? null : activeChatData?._id;

				// If no chat exists, create one first
				if (!chatIdToUse) {
					const res = await fetchApi.post(`/chats`, { id: chatId, participants: activeChatData.participants, chatName: activeChatData.chatName });
					if (res?.error || !res?.data?.chat?._id) {
						console.error("Chat creation failed:", res?.error || res);
						navigate("/chats", { replace: true });
						return;
					}
					chatIdToUse = res.data.chat._id;
					navigate(`/chats/${chatIdToUse}`, { replace: true });
				}

				const tempId = `temp-${crypto.randomUUID()}`;
				const now = new Date().toISOString();

				const optimisticMessage = {
					_id: tempId,
					chatId: chatIdToUse,
					sender: {
						_id: currentUser._id,
						firstName: currentUser.firstName,
						lastName: currentUser.lastName,
						profilePicture: currentUser.profilePicture,
					},
					text: finalMessage,
					media: selectedMediaAttachments,
					createdAt: now,
					isSeen: false,
					status: "sending",
					type: "user",
				};

				addOptimisticMessage(optimisticMessage);

				// Send message through socket
				socket?.emit("sendMessage", {
					tempId,
					chatId: chatIdToUse,
					senderId: currentUser._id,
					text: finalMessage,
					media: selectedMediaAttachments,
				});

				setMessage("");
				setSelectedMediaAttachments([]);
			} catch (err) {
				console.error("Message send failed:", err);
			}
		},
		[message, chatId, currentUser, navigate, socket, activeChatData, selectedMediaAttachments, addOptimisticMessage]
	);

	// ---- Typing Indicator ----
	useEffect(() => {
		if (!socket || !activeChatData?._id || !currentUser?._id) return;

		const trimmed = message.trim();

		if (trimmed) {
			socket.emit("typing:start", {
				chatId: activeChatData._id,
				userId: currentUser._id,
			});

			const timeout = setTimeout(() => {
				socket.emit("typing:stop", {
					chatId: activeChatData._id,
					userId: currentUser._id,
				});
			}, 1500);

			return () => clearTimeout(timeout);
		} else {
			socket.emit("typing:stop", {
				chatId: activeChatData._id,
				userId: currentUser._id,
			});
		}
	}, [message, socket, activeChatData?._id, currentUser?._id]);

	const handleMediaAttachmentTrigger = () => {
		fileInputRef.current?.click();
	};

	const handleMediaAttachment = (e) => {
		const files = Array.from(e.target.files);
		if (files.length === 0) return;

		files.forEach(file => {
			const reader = new FileReader();

			reader.onload = () => {
				const base64 = reader.result;

				setSelectedMediaAttachments(prev => [
					...prev,
					{
						id: crypto.randomUUID(),
						file,                          // full file object
						base64,                        // encoded image
						type: file.type,               // mime type (image/png, video/mp4)
						name: file.name,               // "photo.png"
						size: file.size,               // in bytes
						extension: file.name.split('.').pop(),
						previewUrl: URL.createObjectURL(file),
					}
				]);
			};

			reader.readAsDataURL(file);
		});
	};

	const handleRemoveMedia = (toRemoveId) => {
		setSelectedMediaAttachments(prev => prev.filter(selectedItem => selectedItem.id !== toRemoveId))
	}

	const renderMedia = (media) => {
		if (media.type.startsWith("image/")) {
			return (
				<img
					src={media.previewUrl}
					className="w-full h-full object-cover rounded-xl"
					alt=""
				/>
			);
		}

		if (media.type.startsWith("video/")) {
			return (
				<video
					src={media.previewUrl}
					className="w-full h-full object-cover"
					controls
				/>
			);
		}

		return <div className="text-xs text-gray-500">Unsupported</div>;
	};

	useEffect(() => {
		return () => {
			setSelectedMediaAttachments([]);
			setMessage("");
		}
	}, [activeChatData]);

	// ---- Render ----
	return (
		<footer className="min-h-16 p-3 sticky bottom-0">
			<form onSubmit={handleSendMessage} className="flex h-full gap-3 justify-center items-center">

				{/* isEmpty(message.trim()) &&  */(
					<>
						<button
							type="button"
							className="text-xl text-blue-500 size-10 hover:bg-gray-100 rounded-full flex justify-center items-center"
							onClick={handleMediaAttachmentTrigger}
						>
							<FaRegImage />
						</button>
						<input type="file" className="hidden" ref={fileInputRef} accept="image/*, video/*" onChange={handleMediaAttachment} multiple />
					</>
				)}

				{/* Chat Message Input */}
				<div
					className="flex-1 rounded-2xl flex flex-col overflow-hidden bg-gray-100"
				>
					{/* Media Attachments Preview */}
					<div className={`w-full h-24 flex gap-4 p-4 ${isEmpty(selectedMediaAttachments) && "hidden"}`}>
						{!isEmpty(selectedMediaAttachments) && (() => {
							return (
								<>
									<button
										type="button"
										className="relative size-12 rounded-xl bg-gray-200 flex justify-center items-center"
										onClick={handleMediaAttachmentTrigger}
									>
										<LuCopyPlus className="text-3xl" />
									</button>
									{selectedMediaAttachments.map(media => (
										<div className="relative size-12 rounded-xl" key={media.id}>
											{renderMedia(media)}

											<button
												type="button"
												onClick={() => handleRemoveMedia(media.id)}
												className="size-7 rounded-full border border-gray-300 bg-gray-50 absolute -top-2.5 -right-2.5 flex justify-center items-center"
											>
												<RxCross2 className="text-xs" />
											</button>
										</div>
									))}
								</>
							)

						})()}
					</div>

					{/* Text Input */}
					<input
						type="text"
						placeholder="Aa"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className="focus:outline-none h-9 flex items-center w-full rounded-2xl px-3"
					/>
				</div>

				<button
					type="submit"
					className="size-10 rounded-full flex items-center justify-center text-blue-500 text-xl hover:bg-gray-100"
				>
					{isEmpty(message) && isEmpty(selectedMediaAttachments) ? <FaThumbsUp /> : <HiPaperAirplane />}
				</button>
			</form>
		</footer>
	);
}