import { useCallback, useState } from "react";

/**
 * Generic boolean toggle hook.
 * @param {boolean} initial - initial state (default false)
 * @returns {[boolean, function, function, function]} [value, toggle, setTrue, setFalse]
 */
export default function useToggle(initial = false) {
  const [value, setValue] = useState(initial);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse];
}