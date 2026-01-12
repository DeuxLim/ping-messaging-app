import defaultUserImage from "../../../assets/images/default-user.png"

export default function AvatarImage({ chatPhotoUrl }) {
	return (
		<img
			src={chatPhotoUrl ?? defaultUserImage}
			alt="Chat avatar"
			onError={(e) => {
				e.currentTarget.src = defaultUserImage; // fallback if broken URL
			}}
			className="w-full h-full object-cover"
		/>
	);
}