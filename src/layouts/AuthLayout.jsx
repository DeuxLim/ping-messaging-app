import { Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <>
    <div className="min-h-screen m-0 bg-white flex justify-center items-center">
        <Outlet />
    </div>
    </>
)
}
