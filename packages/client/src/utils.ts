import {createEffect, createSignal} from 'solid-js'

export const createLocalSignal = <T>(name: string, init: T) => {
  const localState = localStorage.getItem(name)
  const [state, setState] = createSignal<T>(
    localState ? JSON.parse(localState) : init,
  )
  createEffect(() => localStorage.setItem(name, JSON.stringify(state())))
  return [state, setState] as const
}

export const timestampPredicate = (
  a: {timestamp: number},
  b: {timestamp: number},
) => b.timestamp - a.timestamp

export const timestampPredicateAsc = (
  a: {timestamp: number},
  b: {timestamp: number},
) => a.timestamp - b.timestamp
