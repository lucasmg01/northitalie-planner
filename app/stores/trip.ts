import type { BudgetMode, TripPace, TravelFocus } from '~/types/travel'

export const useTripStore = defineStore('trip', () => {
  const days = useLocalStorage('trip-days', 6)
  const dailyBudget = useLocalStorage('trip-daily-budget', 110)
  const focus = useLocalStorage<TravelFocus>('trip-focus', 'mix')
  const pace = useLocalStorage<TripPace>('trip-pace', 'normal')
  const mode = useLocalStorage<BudgetMode>('trip-mode', 'eco')

  return {
    days,
    dailyBudget,
    focus,
    pace,
    mode
  }
})
