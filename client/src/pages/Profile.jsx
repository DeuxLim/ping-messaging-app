import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth'
import { FiEdit } from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
import { useNavigate } from 'react-router';

export default function Profile() {
	const { currentUser, updateUserProfilePicture } = useAuth();
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedImg, setSelectedImg] = useState();
	const [updatedUserInfo, setUpdatedUserInfo] = useState(currentUser);
	const navigate = useNavigate();

	const editableFields = {
		"firstName": "First Name",
		"lastName": "Last Name",
		"userName": "Username",
		"email": "Email",
		"password": "Password",
		"bio": "bio",
	};

	const handleEdit = () => {
		setIsEditMode(prev => !prev);
	};

	const handleEditUserInfo = (e) => {
		console.log(e.target.value);
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = async () => {
			const base64Image = reader.result;
			setSelectedImg(base64Image);
			await updateUserProfilePicture({profilePicture : base64Image});
		}
	};

	useEffect(() => {
		if (currentUser) setUpdatedUserInfo(currentUser);
	}, [currentUser]);

	return (
		<>
			<div className='min-h-screen p-8 flex flex-col gap-8'>
				<div className='text-lg font-bold flex justify-between'>
					<div>
						My Profile
					</div>
					<div className='flex justify-center items-center gap-2 hover:bg-gray-100 rounded-md p-2'>
						<IoMdArrowBack />
						<button type='button' onClick={() => navigate(-1)}>Back</button>
					</div>
				</div>

				<div className='min-h-32 rounded-md px-8 py-8 border border-gray-300 relative'>
					<div className='h-16 text-2xl'>
						Personal Information
					</div>

					<div className='flex gap-18'>
						<div className='flex flex-col gap-4 max-h-80 flex-wrap'>
							{!isEditMode ? (
								<>
									<div className='h-28 w-28 border border-gray-300 rounded-full'>
										<img src={updatedUserInfo.profilePicture.url || null} alt="" />
									</div>
									{Object.entries(editableFields).map(([FieldKey, FieldDisplay]) => {
										return (
											<div className="flex flex-col p-2 rounded gap-2" key={FieldKey}>
												<span className="text-sm font-semibold text-black">{FieldDisplay}</span>
												<span className="text-black">{updatedUserInfo[FieldKey] || ""}</span>
											</div>
										)
									})}
								</>
							) : (
								<>
									<div className='size-24 border border-gray-300 rounded-full relative overflow-hidden'>
										<img src={selectedImg || updatedUserInfo.profilePicture.url || null} alt="" className='w-full h-full object-cover' />
										<label>
											<div className='absolute right-0 bottom-0 text-4xl text-gray-400'>
												<IoCameraOutline />
											</div>
											<input id="avatar-upload" type="file" className='hidden' accept='image/*' onChange={handleImageUpload} />
										</label>
									</div>
									{Object.entries(editableFields).map(([FieldKey, FieldDisplay]) => {
										return (
											<div className="flex flex-col p-2 rounded gap-2" key={FieldKey}>
												<span className="text-sm font-semibold text-black">{FieldDisplay}</span>
												<input
													className='border border-gray-300 p-2 rounded-md'
													value={updatedUserInfo[FieldKey] || ""}
													onChange={handleEditUserInfo}
												/>
											</div>
										)
									})}
								</>
							)
							}
						</div>
					</div>

					<div className='absolute right-8 top-6' onClick={(e) => handleEdit(e)}>
						<div className='flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-3xl'>
							<span>
								Edit
							</span>
							<span>
								<FiEdit />
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
