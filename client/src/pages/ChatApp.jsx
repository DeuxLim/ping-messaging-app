import { Outlet, useLocation } from "react-router";
import Sidebar from "../components/chat/Sidebar";
import useChatDisplay from "../hooks/useChatDisplay";
import ChatSettings from "../components/chat/chat/ChatSettings";
import IconMenu from "../components/chat/IconMenu/IconMenu";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { fetchAPI } from "../api/fetchApi";
import { isEmpty } from "../utilities/utils";

export default function ChatApp() {
    const { sidebarVisible, isDesktop, isChatSettingsOpen } = useChatDisplay();
    const { currentUser } = useAuth();
    const location = useLocation();
    const isRoot = location.pathname === "/chats";

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
        <div className="h-screen flex flex-col bg-gray-100">
            <div className="w-full">
                {currentUser && !currentUser?.isVerified && (
                    <div className="w-full bg-blue-500 flex items-center justify-center p-2 gap-4 h-12">
                        <div className="text-white text-xs md:text-md">
                            Your email isn't verified yet. Please check your inbox.
                        </div>
                        <button
                            type="button"
                            className="border text-white rounded-md px-4 py-1 text-xs md:text-md hover:bg-blue-400 hover:border-0 disabled:opacity-50"
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
                            } text-xs flex justify-center items-center py-1`}
                    >
                        {resendMessage}
                    </div>
                )}
            </div>
            <div className="flex h-full py-4 px-2 bg-gray-100 gap-4">

                <IconMenu />

                {isDesktop
                    ? (
                        <>
                            {sidebarVisible && <Sidebar />}
                            <Outlet />
                        </>
                    )
                    : (
                        isRoot
                            ? sidebarVisible && <Sidebar />
                            : <Outlet />
                    )
                }

                {isChatSettingsOpen && <ChatSettings />}
            </div>
        </div>
    );
}