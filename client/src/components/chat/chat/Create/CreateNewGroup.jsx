import { Link, useNavigate } from "react-router";
import { TbSearch } from "react-icons/tb";

export default function CreateNewGroup() {
    const navigate = useNavigate();

    return (
        <>
            <div>
                <div className="flex justify-between items-center px-4 py-4">
                    <button onClick={() => navigate(-1)} className="text-blue-500 text-xs">
                        Cancel
                    </button>
                    <div className="font-semibold text-sm">
                        New Group
                    </div>
                    <div className="text-blue-500 text-xs">
                        Create
                    </div>
                </div>

                <div className="px-4 mb-4">
                    <div className="text-sm relative">
                        <label for="group-name" className="text-gray-500 text-xs px-1">
                            Group name (optional)
                        </label>
                        <input type="text" id="group-name" name="group-name" className="w-full text-sm px-1 focus:outline-none focus:ring-0 focus:border-transparent" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex flex-row gap-3 mx-4">
                    <div className="relative w-full">
                        {/* Search Icon */}
                        <div className="absolute inset-y-0 flex items-center pl-3 text-gray-500">
                            <TbSearch />
                        </div>

                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full text-xs bg-gray-100 py-3 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                <div className="text-xs text-gray-500 px-4 py-2 mt-4">
                    Suggested
                </div>

                {/* List suggested users below */}

            </div>
        </>
    )
}
