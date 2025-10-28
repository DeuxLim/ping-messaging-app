import { useRef } from "react";
import useOnClickOutside from "./useOnClickOutside";
import useEscapeKey from "./useEscapeKey";
import useToggle from "./useToggle";

/**
 * Handles open/close state, focus control, and accessibility for dropdown menus.
 */
export default function useDropdownMenu() {
	const [isOpen, toggle, open, close] = useToggle(false);
	const buttonRef = useRef(null);
	const menuRef = useRef(null);

	// Use modular hooks
	useOnClickOutside([buttonRef, menuRef], close);
	useEscapeKey(close);

	return { isOpen, toggle, open, close, buttonRef, menuRef };
}
