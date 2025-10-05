import { useId, useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { fetchAPI } from "../api/fetchApi";

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
    const { login } = useAuth();

    function validateForm() {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email cannot be empty";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            newErrors.email = "Enter a valid email address";
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

        try {
            const responseJson = await fetchAPI.post('/auth/login',
                { email, password, rememberMe },
                { credentials: 'include' }
            );

            if (responseJson.error?.general) {
                setErrors(responseJson.error);
                return;
            }

            if (!responseJson.user || !responseJson.accessToken) {
                setErrors({ general: "Something went wrong..." });
                return;
            }

            login(responseJson.user, responseJson.accessToken);
            navigate("/");
        } catch (error) {
            console.log(error);
            setErrors({ general: "Login failed" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-8 max-w-md w-full mx-auto rounded-md shadow-2xl border-2 border-gray-200 flex flex-col gap-6">
            <div className="flex flex-col justify-center items-center text-2xl">
                <h1>Login</h1>
            </div>
            <form onSubmit={handleSubmit}>
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
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                                }}
                            />
                            {errors.email ? <p className="text-sm text-right text-red-500">{errors.email}</p> : ""}
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
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (errors.password) setPassword(prev => ({ ...prev, password: null }));
                                }}
                            />
                            {errors.password ? <p className="text-sm text-right text-red-500">{errors.password}</p> : ""}
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

                    {errors.general &&
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

                    <Link to="/auth/register" className="flex justify-center items-center">
                        Create an account
                    </Link>

                </div>
            </form>
        </div>
    );
}
