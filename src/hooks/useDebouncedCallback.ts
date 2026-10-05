import { useEffect, useRef } from 'react'

interface DebouncedCallback<TValue> {
  // Calls the callback with this value once no new value came in for the delay.
  schedule: (value: TValue) => void
  cancel: () => void
}

export function useDebouncedCallback<TValue>(
  callback: (value: TValue) => void,
  delayMs: number,
): DebouncedCallback<TValue> {
  const timerRef = useRef<number | undefined>(undefined)

  // A callback that runs after the component is gone could update state that no longer exists.
  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  function cancel() {
    window.clearTimeout(timerRef.current)
  }

  function schedule(value: TValue) {
    cancel()
    timerRef.current = window.setTimeout(() => callback(value), delayMs)
  }

  return { schedule, cancel }
}
