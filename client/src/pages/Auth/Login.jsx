import { useId, useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { fetchAPI } from "./../../api/fetchApi";
import FormInput from "../../components/auth/FormInput";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";

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
    const [showPassword, setShowPassword] = useState(false);

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
            navigate("/chats");
        } catch (error) {
            console.log(error);
            setErrors({ general: "Login failed" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-10 text-lg">
                <div className="flex flex-col gap-3">

                    {/* EMAIL */}
                    <FormInput
                        id={elementUserEmailId}
                        type="email"
                        name="user-email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                        }}
                        error={errors.email}
                    />

                    <div className="relative flex items-center justify-center w-full">
                        <FormInput
                            id={elementPasswordId}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                            }}
                            error={errors.password}
                            additionalContainerClasses="w-full"
                        />

                        {/* Show / Hide Password */}
                        {password ? (
                            <div
                                className="absolute right-4"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                            </div>
                        ) : ""}

                    </div>

                    {/* REMEMBER ME && FORGOT PASSWORD*/}
                    <div className="flex text-sm justify-between mt-2 px-1">
                        <label htmlFor={elementRememberMeId} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                id={elementRememberMeId}
                                name="remember-me"
                                className="hidden peer"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <div className="relative w-5 h-5 border border-gray-200 rounded peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-200"></div>
                            <span className="text-sm text-gray-700">Remember me</span>
                        </label>

                        <div>
                            <Link to="/auth/forgot-password">
                                <p className="font-bold hover:underline text-blue-500">Forgot password</p>
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
                <div className="flex flex-col justify-center items-center w-full">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-500 py-2 px-8 rounded-lg w-full
                                        ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <span className="text-white">
                            {loading ? "Logging in..." : "Login"}
                        </span>
                    </button>
                </div>

                <div className="flex justify-between gap-3">
                    <div className="w-full flex items-center"><div className="h-0.5 w-full bg-gray-200"></div></div>
                    <span className="text-sm">or</span>
                    <div className="w-full flex items-center"><div className="h-0.5 w-full bg-gray-200"></div></div>
                </div>

                <Link to="/auth/register" className="flex justify-center items-center bg-orange-600 py-2 px-8 rounded-lg w-full text-white">
                    Create an account
                </Link>

            </div>
        </form>
    );
}
