export type NavigationState = {
  openSectionKey: string | null
  pinnedSectionKey: string | null
}

export type NavigationEvent =
  | { type: 'open'; key: string }
  | { type: 'pin'; key: string }
  | { type: 'leave' }
  | { type: 'close' }
  | { type: 'route-change' }

export function getActiveSectionKey(pathname: string) {
  const match = pathname.match(
    /^\/docs\/(frontend|backend|algorithm|agent|dev)(?:\/|$)/,
  )

  return match?.[1] ?? null
}

export function reduceNavigationState(
  state: NavigationState,
  event: NavigationEvent,
): NavigationState {
  if (event.type === 'open') {
    return { openSectionKey: event.key, pinnedSectionKey: null }
  }

  if (event.type === 'pin') {
    const shouldClose = state.pinnedSectionKey === event.key

    return shouldClose
      ? { openSectionKey: null, pinnedSectionKey: null }
      : { openSectionKey: event.key, pinnedSectionKey: event.key }
  }

  if (event.type === 'leave' && state.pinnedSectionKey) return state

  return { openSectionKey: null, pinnedSectionKey: null }
}
