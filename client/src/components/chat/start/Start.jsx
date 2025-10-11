import { IoChatbubblesOutline } from "react-icons/io5";

export default function Start() {
	return (
		<>
			<div className="h-full flex justify-center items-center">
				<div className="flex justify-center items-center gap-4">
					<div className="text-9xl text-gray-200">
						<IoChatbubblesOutline />
					</div>
					<span className="text-4xl text-gray-300 font-bold">
						Chat someone!
					</span>
				</div>
			</div>
		</>
	)
}
