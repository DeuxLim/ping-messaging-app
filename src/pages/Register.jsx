
export default function Register() {
  return (
    <div className="bg-white p-8 rounded-md shadow-2xl border-2 border-gray-200 flex flex-col gap-6">
        <div className="flex flex-col justify-center items-center">
            <img src="" alt="" />
            <h1>Register</h1>
        </div>
        <form>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label htmlFor="user-email">Email</label>
                    <input type="text" id="user-email" className="border-2 border-gray-300 rounded-md"/>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">password</label>
                    <input type="password" id="password" className="border-2 border-gray-300 rounded-md"/>
                </div>

                <div className="flex flex-col justify-center items-center">
                    <button type="submit" className="bg-green-400 py-2 px-8 rounded-md">Login</button>
                </div>
            </div>
        </form>
    </div>
  )
}
