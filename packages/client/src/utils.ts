import {createEffect, createSignal} from 'solid-js'

export const createLocalSignal = <T>(name: string, init: T) => {
  const localState = localStorage.getItem(name)
  try {
    const [state, setState] = createSignal<T>(
      localState ? JSON.parse(localState) : init,
    )
    createEffect(() => localStorage.setItem(name, JSON.stringify(state())))
    return [state, setState] as const
  } catch (e) {
    alert(e instanceof Error ? e : JSON.stringify(e))
  }
}

export const timestampPredicate = (
  a: {timestamp: number},
  b: {timestamp: number},
) => b.timestamp - a.timestamp

export const timestampPredicateAsc = (
  a: {timestamp: number},
  b: {timestamp: number},
) => a.timestamp - b.timestamp
