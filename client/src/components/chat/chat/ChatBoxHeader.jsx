import { IoChevronBackOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";

export default function ChatBoxHeader() {
	return (
		<>
			<header className="h-21 border-b-1 border-gray-300">
				<div className="flex items-center h-full md:px-4">
					<div className="text-2xl px-3 md:hidden">
						<IoChevronBackOutline />
					</div>
					<div className="flex flex-1 items-center h-full gap-2">
						<div className="border-1 border-gray-300 flex justify-center items-center rounded-full w-12 h-12 md:p">
							<div>IMG</div>
						</div>
						<div className="">
							<div>
								Deux Lim
							</div>
							<div>
								Online
							</div>
						</div>
					</div>
					<div className="flex justify-center px-4 items-center h-full">
						<div className="text-4xl">
							<IoVideocamOutline />
						</div>
					</div>
				</div>
			</header>
		</>
	)
}
