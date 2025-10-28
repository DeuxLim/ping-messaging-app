// hooks/useOnClickOutside.js
import { useEffect } from "react";

export default function useOnClickOutside(refs = [], handler) {
	useEffect(() => {
		function onPointerDown(e) {
			const isInside = refs.some(
				(r) => r?.current && r.current.contains(e.target)
			);
			if (!isInside) handler(e);
		}
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [refs, handler]);
}
