export type TravelFocus = 'mix' | 'nature' | 'city'
export type TripPace = 'cool' | 'normal' | 'active'
export type BudgetMode = 'eco' | 'balanced'

export interface Spot {
  id: string
  city: string
  name: string
  kind: 'city' | 'nature'
  beauty: number
  activityCost: number
  visitHours: number
  tags: string[]
}

export interface PlannedDay {
  day: number
  city: string
  spots: Spot[]
  activityCost: number
  foodCost: number
  stayCost: number
  transportCost: number
}

export interface PlanInput {
  days: number
  dailyBudget: number
  focus: TravelFocus
  pace: TripPace
  mode: BudgetMode
}
