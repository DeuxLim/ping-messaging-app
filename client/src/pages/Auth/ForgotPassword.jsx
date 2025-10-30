import { useId, useState } from "react";
import { useNavigate } from "react-router";
import { isEmpty } from "../../utilities/utils";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const elementUserEmailId = useId();
    const navigate = useNavigate();

    function validateForm(){
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email cannot be empty";
        }

        return newErrors;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (!isEmpty(validationErrors)) return;

        setLoading(true);

        // simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Dummy data response from backend
        const response = {
            error : {
                auth : "Invalid credentials."
            },
            status : 401
        };

        if(response.error?.auth){
            setErrors({auth: "Invalid username or password."});
        }

        setLoading(false);
    }

    return (
        <div className="bg-white p-8 max-w-md w-full mx-auto rounded-md shadow-2xl border-2 border-gray-200 flex flex-col gap-6">
            <button onClick={() => navigate(-1)}>Back</button>
            <div className="flex flex-col justify-center items-center text-2xl">
                <h1>Retrieve your account</h1>
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

                        { errors.auth && 
                            <div className="flex justify-center text-red-500">
                                <p>{errors.auth}</p>
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
                                {loading ? "Sending request..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
