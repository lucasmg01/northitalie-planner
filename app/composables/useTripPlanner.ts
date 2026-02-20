import { northItalySpots } from '~/data/north-italy-spots'
import type { PlanInput, PlannedDay, Spot } from '~/types/travel'

const cityOrder = [
  'Turin',
  'Milan',
  'Lac de Come',
  'Bergamo',
  'Verone',
  'Venise',
  'Dolomites',
  'Trento',
  'Bologne',
  'Cinque Terre'
]

const transportByStep = [0, 14, 16, 12, 18, 20, 22, 18, 19, 24]

function spotScore(spot: Spot, input: PlanInput): number {
  const beautyWeight = input.mode === 'eco' ? 1.2 : 1.35
  const costPenalty = input.mode === 'eco' ? 0.55 : 0.35
  const focusBonus =
    input.focus === 'mix'
      ? 0.2
      : (input.focus === 'nature' && spot.kind === 'nature') || (input.focus === 'city' && spot.kind === 'city')
          ? 1.4
          : -0.8

  return spot.beauty * beautyWeight - spot.activityCost * costPenalty + focusBonus
}

function staysFromBudget(dailyBudget: number, mode: PlanInput['mode']) {
  if (mode === 'eco') {
    return Math.max(35, Math.round(dailyBudget * 0.4))
  }

  return Math.max(50, Math.round(dailyBudget * 0.5))
}

export function useTripPlanner() {
  const createPlan = (input: PlanInput) => {
    const sorted = [...northItalySpots].sort((a, b) => spotScore(b, input) - spotScore(a, input))
    const selectedSpots = sorted.slice(0, Math.max(input.days * 2, input.days + 2))

    const groupedByCity = selectedSpots.reduce<Record<string, Spot[]>>((acc, spot) => {
      const key = spot.city
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(spot)
      return acc
    }, {})

    const orderedCities = cityOrder.filter(city => groupedByCity[city])
    const dailySpotCount = input.pace === 'cool' ? 2 : input.pace === 'active' ? 4 : 3
    const stayCost = staysFromBudget(input.dailyBudget, input.mode)
    const foodCost = Math.round(input.dailyBudget * 0.3)

    const plan: PlannedDay[] = Array.from({ length: input.days }, (_, i) => {
      const fallbackCity = selectedSpots[0]?.city ?? 'Milan'
      const city = orderedCities[i % orderedCities.length] ?? fallbackCity
      const citySpots = groupedByCity[city] || []
      const spots = citySpots.slice(0, Math.min(dailySpotCount, citySpots.length))
      const activityCost = spots.reduce((total: number, spot: Spot) => total + spot.activityCost, 0)
      const transportCost = transportByStep[i % transportByStep.length] ?? 0

      return {
        day: i + 1,
        city,
        spots,
        activityCost,
        foodCost,
        stayCost,
        transportCost
      }
    })

    const totalCost = plan.reduce((total, day) => {
      return total + day.activityCost + day.foodCost + day.stayCost + day.transportCost
    }, 0)

    const budget = input.days * input.dailyBudget
    const savings = Math.max(0, budget - totalCost)
    const flattenedSpots = plan.flatMap(day => day.spots)
    const averageBeauty = flattenedSpots.reduce((total, spot) => total + spot.beauty, 0) / Math.max(1, flattenedSpots.length)
    const score = Math.round(averageBeauty * 10)

    return {
      plan,
      totalCost,
      budget,
      savings,
      score
    }
  }

  return {
    createPlan
  }
}
