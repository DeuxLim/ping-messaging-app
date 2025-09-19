import { useId, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const elementUserEmailId = useId();
    const elementPasswordId = useId();
    const elementRememberMeId = useId();
    const navigate = useNavigate();

    function validateForm(){
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email cannot be empty";
        }

        if (!password.trim()) {
            newErrors.password = "Password cannot be empty";
        }

        return newErrors;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const validationErrors = validateForm();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify({ email, password, rememberMe })
        });
        setLoading(false);

        const responseJson = await response.json();
        if(responseJson.error?.general){
            setErrors(responseJson.error);
        }

        if(responseJson.authenticated){
            navigate("/");
        }
    }

    return (
        <div className="bg-white p-8 max-w-md w-full mx-auto rounded-md shadow-2xl border-2 border-gray-200 flex flex-col gap-6">
            <div className="flex flex-col justify-center items-center text-2xl">
                <h1>Login</h1>
            </div>
            <form onSubmit={handleSubmit} className="w-">
                <div className="flex flex-col gap-8 text-lg">
                    <div className="flex flex-col gap-4">

                        {/* EMAIL */}
                        <div className="flex flex-col">
                            <label htmlFor={elementUserEmailId}>Email</label>
                            <input
                                type="text"
                                id={elementUserEmailId}
                                name="user-email"
                                className="p-2 border-2 border-gray-300 rounded-md"
                                placeholder="Enter your email address..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            { errors.email ? <p className="text-sm text-right text-red-500">{errors.email}</p> : "" }
                        </div>

                        {/* PASSWORD */}
                        <div className="flex flex-col">
                            <label htmlFor={elementPasswordId}>password</label>
                            <input
                                type="password"
                                id={elementPasswordId}
                                name="password"
                                className="p-2 border-2 border-gray-300 rounded-md"
                                placeholder="Enter your password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            { errors.password ? <p className="text-sm text-right text-red-500">{errors.password}</p> : "" }

                        </div>

                        {/* REMEMBER ME && FORGOT PASSWORD*/}
                        <div className="flex text-sm justify-between">
                            <div className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    id={elementRememberMeId}
                                    name="remember-me"
                                    className="border-2 border-gray-300 rounded-md"
                                    defaultChecked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor={elementRememberMeId}>Remember Me</label>
                            </div>
                            <div>
                                <Link to="/auth/forgot-password">
                                    <p>Forgot password</p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    { errors.general && 
                        <div className="flex justify-center text-red-500">
                            <p>{errors.general}</p>
                        </div>
                    }

                    {/* SUBMIT */}
                    <div className="flex flex-col justify-center items-center">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`bg-green-400 py-2 px-8 rounded-md 
                                        ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>

                    <div className="flex justify-between gap-3">
                        <div className="w-full flex items-center"><div className="h-0.5 w-full bg-gray-200"></div></div> 
                            or 
                        <div className="w-full flex items-center"><div className="h-0.5 w-full bg-gray-200"></div></div> 
                    </div>

                    <button type="button" className="flex justify-center items-center">
                        <Link to="/auth/register">
                            Create an account
                        </Link>
                    </button>


                </div>
            </form>
        </div>
    );
}
