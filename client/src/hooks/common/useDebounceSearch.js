import React, { useRef, useState } from "react";

export default function useDebounceSearch(callback, delay = 400) {
	const [query, setQuery] = useState("");
	const debounceRef = useRef(null);

	/* Debounce, only trigger search requests after a few milliseconds. (not per key stroke) */
	const handleChange = (e) => {
		const value = e.target.value;
		setQuery(value);

		clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => callback(value), delay);
	};

	const reset = () => setQuery("");

	return { query, handleChange, reset };
}
