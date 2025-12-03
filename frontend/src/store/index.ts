import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import filtersReducer, { FiltersState, hydrate } from './filtersSlice'

const PERSIST_KEY = 'app:filters'

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
  },
  devTools: true,
})

// Инициализация из localStorage после создания стора
try {
  const raw = localStorage.getItem(PERSIST_KEY)
  if (raw) {
    const parsed = JSON.parse(raw) as FiltersState
    store.dispatch(hydrate(parsed))
  }
} catch {}

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
