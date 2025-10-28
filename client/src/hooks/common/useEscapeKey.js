// hooks/useEscapeKey.js
import { useEffect } from "react";

export default function useEscapeKey(handler) {
	useEffect(() => {
		function onKey(e) {
			if (e.key === "Escape") handler(e);
		}
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [handler]);
}
