import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import filtersReducer, { FiltersState } from './filtersSlice'

const PERSIST_KEY = 'app:filters'

function loadPreloaded(): { filters?: FiltersState } | undefined {
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    return { filters: parsed as FiltersState }
  } catch {
    return undefined
  }
}

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
  },
  preloadedState: loadPreloaded(),
  devTools: true,
})

store.subscribe(() => {
  try {
    const s = store.getState()
    localStorage.setItem(PERSIST_KEY, JSON.stringify(s.filters))
  } catch {}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
