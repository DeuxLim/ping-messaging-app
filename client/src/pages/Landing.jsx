import useAuth from "../hooks/useAuth.js";

export default function Landing () {
    const { user } = useAuth();
    return (
        <>
            <h1 className="text-2xl bg-red-100"> Hello {user.firstName} </h1>
        </>
    );
}