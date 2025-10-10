import ping from './../../assets/images/ping-messenger-logo.png';
import { Outlet } from 'react-router';

export default function StartAuth() {
	return (
		<div className="min-h-screen m-0 bg-white flex justify-center items-center">
			<div className='flex flex-col h-full justify-center items-center p-10 w-full'>

				{/* Logo, Name, Tagline */}
				<div className='flex flex-col items-center gap-1 mb-10'>
					<div className="flex items-center justify-center mr-6">
						<img src={ping} alt="logo" className='w-18 h-18' />
						<h1 className='text-4xl font-black text-blue-500'>Ping</h1>
					</div>
					<span className='font-bold'>
						Your world, one Ping away.
					</span>
				</div>

				{/* Auth pages */}
				<div className="max-w-md w-full mx-auto rounded-md flex flex-col gap-6">
					<Outlet />
				</div>

			</div>
		</div >
	)
}
