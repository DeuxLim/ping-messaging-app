import { useId, useState } from "react";
import { Link, useNavigate } from "react-router";

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

        // simulate API call
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify({
                firstName,
                lastName,
                userName,
                email,
                password,
                confirmPassword
            })
        });

        if (response.error && Object.keys(response.error).length > 0) {
            setErrors(response.error);
        }   
        
        if (response.status < 200 || response.status > 299) {
            setErrors({general : "Something Went Wrong..."});
        }

        setLoading(false);
        navigate("/auth/login", {replace:true});
    }

    return (
        <div className="bg-white p-8 max-w-md w-full mx-auto rounded-md shadow-2xl border-2 border-gray-200 flex flex-col gap-6">
            <div className="flex flex-col justify-center items-center text-2xl">
                <h1>Login</h1>
            </div>
            <form onSubmit={handleSubmit} className="w-">
                <div className="flex flex-col gap-8 text-lg">
                    <div className="flex flex-col gap-4">

                        {/* First Name */}
                        <div className="flex flex-col">
                            <label htmlFor={elementFirstNameId}>First Name</label>
                            <input
                                type="text"
                                id={elementFirstNameId}
                                name="user-first-name"
                                className="p-2 border-2 border-gray-300 rounded-md"
                                placeholder="Enter your first name..."
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            { errors.firstName ? <p className="text-sm text-right text-red-500">{errors.firstName}</p> : "" }
                        </div>

                        {/* Last Name */}
                        <div className="flex flex-col">
                            <label htmlFor={elementLastNameId}>Last Name</label>
                            <input
                                type="text"
                                id={elementLastNameId}
                                name="user-last-name"
                                className="p-2 border-2 border-gray-300 rounded-md"
                                placeholder="Enter your last name..."
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            { errors.lastName ? <p className="text-sm text-right text-red-500">{errors.lastName}</p> : "" }
                        </div>

                        {/* User Name */}
                        <div className="flex flex-col">
                            <label htmlFor={elementUserNameId}>Username</label>
                            <input
                                type="text"
                                id={elementUserNameId}
                                name="user-last-name"
                                className="p-2 border-2 border-gray-300 rounded-md"
                                placeholder="Enter your username..."
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            { errors.userName ? <p className="text-sm text-right text-red-500">{errors.userName}</p> : "" }
                        </div>

                        {/* EMAIL */}
                        <div className="flex flex-col">
                            <label htmlFor={elementEmailId}>Email</label>
                            <input
                                type="text"
                                id={elementEmailId}
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

                        {/* Confirm Password */}
                        <div className="flex flex-col">
                            <label htmlFor={elementConfirmPasswordId}>Confirm Password</label>
                            <input
                                type="password"
                                id={elementConfirmPasswordId}
                                name="password"
                                className="p-2 border-2 border-gray-300 rounded-md"
                                placeholder="Confirm your password..."
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            { errors.confirmPassword ? <p className="text-sm text-right text-red-500">{errors.confirmPassword}</p> : "" }
                        </div>

                        
                    </div>

                    { errors.auth && 
                        <div className="flex justify-center text-red-500">
                            <p>{errors.auth}</p>
                        </div>
                    }

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
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </div>

                    <div className="flex justify-between gap-3">
                        <div className="w-full flex items-center"><div className="h-0.5 w-full bg-gray-200"></div></div> 
                            or 
                        <div className="w-full flex items-center"><div className="h-0.5 w-full bg-gray-200"></div></div> 
                    </div>

                    <button type="button" className="flex justify-center items-center">
                        <Link to="/auth/login">
                            Already have an account? Log in...
                        </Link>
                    </button>


                </div>
            </form>
        </div>
    );
}
