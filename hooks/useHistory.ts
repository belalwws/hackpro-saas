import { useState, useCallback, useRef } from 'react'

interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

export function useHistory<T>(initialState: T) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: []
  })

  const canUndo = state.past.length > 0
  const canRedo = state.future.length > 0

  const undo = useCallback(() => {
    if (!canUndo) return

    setState(current => {
      const previous = current.past[current.past.length - 1]
      const newPast = current.past.slice(0, current.past.length - 1)

      return {
        past: newPast,
        present: previous,
        future: [current.present, ...current.future]
      }
    })
  }, [canUndo])

  const redo = useCallback(() => {
    if (!canRedo) return

    setState(current => {
      const next = current.future[0]
      const newFuture = current.future.slice(1)

      return {
        past: [...current.past, current.present],
        present: next,
        future: newFuture
      }
    })
  }, [canRedo])

  const set = useCallback((newPresent: T) => {
    setState(current => ({
      past: [...current.past, current.present],
      present: newPresent,
      future: []
    }))
  }, [])

  const clear = useCallback(() => {
    setState({
      past: [],
      present: initialState,
      future: []
    })
  }, [initialState])

  return {
    state: state.present,
    setState: set,
    undo,
    redo,
    canUndo,
    canRedo,
    clear
  }
}








