import { Outlet } from "react-router";
import useChatDisplay from "../../hooks/useChatDisplay";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { fetchAPI } from "../../api/fetchApi";
import { isEmpty } from "../../utilities/utils";

export default function MainWindow() {
    const { isChatSettingsOpen, isDesktop } = useChatDisplay();
    const { currentUser } = useAuth();

    const [resendMessage, setResendMessage] = useState(null);
    const [resendSuccess, setResendSuccess] = useState(null);
    const [isResending, setIsResending] = useState(false);

    const handleResend = async () => {
        if (!currentUser?.email || isResending) return;

        setIsResending(true);
        setResendMessage(null);
        setResendSuccess(null);

        try {
            const res = await fetchAPI.post("/auth/resend-verification", {
                email: currentUser.email,
            });

            setResendSuccess(true);
            setResendMessage(res.data?.message || "Verification email sent.");
        } catch (err) {
            setResendSuccess(false);
            setResendMessage(
                err.response?.data?.message || "Failed to resend verification email."
            );
        } finally {
            setIsResending(false);
        }
    };

    return (
        <>
            {(isDesktop || (!isDesktop && !isChatSettingsOpen)) && (
                <main className="flex-1 h-full shadow-sm overflow-hidden bg-white rounded-xl w-full">
                    {currentUser && !currentUser.isVerified && (
                        <div className="w-full bg-blue-500 flex items-center justify-center p-2 gap-4 h-12">
                            <div className="text-white text-sm">
                                Your account isn't verified yet. Please check your email and click the verification link to continue.
                            </div>
                            <button
                                type="button"
                                className="border text-white rounded-md px-4 text-sm hover:bg-blue-400 hover:border-0 disabled:opacity-50"
                                onClick={handleResend}
                                disabled={isResending}
                            >
                                {isResending ? "Sending..." : "Resend verification link"}
                            </button>
                        </div>
                    )}

                    {!isEmpty(resendMessage) && (
                        <div
                            className={`w-full ${resendSuccess ? "bg-green-400" : "bg-red-400"
                                } text-sm flex justify-center items-center py-1`}
                        >
                            {resendMessage}
                        </div>
                    )}

                    <Outlet />
                </main>
            )}
        </>
    );
}