import { useId, useState } from "react";
import { Link, useNavigate } from "react-router";
import { fetchAPI } from "./../../api/fetchApi.js";
import FormInput from "../../components/auth/FormInput.jsx";

export default function Login() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const elementFirstNameId = useId();
    const elementLastNameId = useId();
    const elementUserNameId = useId();
    const elementEmailId = useId();
    const elementPasswordId = useId();
    const elementConfirmPasswordId = useId();

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    function validateForm() {
        const newErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = "First name cannot be empty";
        }

        if (!lastName.trim()) {
            newErrors.lastName = "Last name cannot be empty";
        }

        if (!userName.trim()) {
            newErrors.userName = "Username cannot be empty";
        }

        if (!email.trim()) {
            newErrors.email = "Email cannot be empty";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Invalid email format";
        }

        if (!password.trim()) {
            newErrors.password = "Password cannot be empty";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm Password cannot be empty";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match";
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
            const response = await fetchAPI.post('/auth/register', {
                firstName,
                lastName,
                userName,
                email,
                password,
                confirmPassword
            });

            if (response.error && Object.keys(response.error).length > 0) {
                setErrors(response.error);
            }

            setLoading(false);
            navigate("/auth/login", { replace: true });
        } catch (error) {
            console.log(error);
            setLoading(false);
            setErrors({ general: "Something Went Wrong..." });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-">
            <div className="flex flex-col gap-8 text-lg">

                <div className="flex flex-col gap-4">
                    {/* First Name */}
                    <FormInput
                        id={elementFirstNameId}
                        label="First Name"
                        type="text"
                        name="user-first-name"
                        placeholder="Enter your first name..."
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={errors.firstName}
                    />

                    {/* Last Name */}
                    <FormInput
                        id={elementLastNameId}
                        label="Last Name"
                        type="text"
                        name="user-last-name"
                        placeholder="Enter your last name..."
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={errors.lastName}
                    />

                    {/* User Name */}
                    <FormInput
                        id={elementUserNameId}
                        label="Username"
                        type="text"
                        name="user-name"
                        placeholder="Enter your username..."
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        error={errors.userName}
                    />

                    {/* EMAIL */}
                    <FormInput
                        id={elementEmailId}
                        label="Email"
                        type="email"
                        name="user-email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                    />

                    {/* PASSWORD */}
                    <FormInput
                        id={elementPasswordId}
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Enter your password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />

                    {/* Confirm Password */}
                    <FormInput
                        id={elementConfirmPasswordId}
                        label="Confirm Password"
                        type="password"
                        name="confirm-password"
                        placeholder="Confirm your password..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                    />
                </div>

                {errors.auth &&
                    <div className="flex justify-center text-red-500">
                        <p>{errors.auth}</p>
                    </div>
                }

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
                            {loading ? "Creating Account..." : "Create Account"}
                        </span>
                    </button>
                </div>

                {/* Back */}
                <Link to="/auth/login">
                    <div className="flex items-center justify-center">
                        Already have an account? Log in...
                    </div>
                </Link>
            </div>
        </form>
    );
}
