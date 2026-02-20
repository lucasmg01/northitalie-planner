<script setup lang="ts">
import { useTripStore } from '~/stores/trip'
import { useTripPlanner } from '~/composables/useTripPlanner'
import type { BudgetMode, TripPace, TravelFocus } from '~/types/travel'

const trip = useTripStore()
const { createPlan } = useTripPlanner()

const focusOptions: { value: TravelFocus, label: string }[] = [
  { value: 'mix', label: 'Mix (ville + nature)' },
  { value: 'nature', label: 'Nature en priorite' },
  { value: 'city', label: 'Villes historiques' }
]

const paceOptions: { value: TripPace, label: string }[] = [
  { value: 'cool', label: 'Cool (2 spots / jour)' },
  { value: 'normal', label: 'Normal (3 spots / jour)' },
  { value: 'active', label: 'Actif (4 spots / jour)' }
]

const modeOptions: { value: BudgetMode, label: string }[] = [
  { value: 'eco', label: 'Eco max' },
  { value: 'balanced', label: 'Confort economique' }
]

const result = computed(() => {
  return createPlan({
    days: Number(trip.days),
    dailyBudget: Number(trip.dailyBudget),
    focus: trip.focus,
    pace: trip.pace,
    mode: trip.mode
  })
})

const formatEuro = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-amber-50 via-white to-cyan-50 text-slate-900">
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-100 to-emerald-100 p-8">
        <p class="text-sm uppercase tracking-[0.2em] text-cyan-700">
          Micro-SaaS Nuxt 4
        </p>
        <h1 class="mt-3 text-4xl font-semibold sm:text-5xl">
          NordItalie Planner
        </h1>
        <p class="mt-4 max-w-3xl text-lg text-slate-700">
          Construis un itineraire malin dans le nord de l Italie: spots les plus beaux, budget maitrise, ordre de visite coherent.
        </p>
      </section>

      <section class="mt-8 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold">
            Preferences voyage
          </h2>

          <div class="mt-5 grid gap-4">
            <label class="grid gap-1">
              <span class="text-sm text-slate-600">Nombre de jours</span>
              <input
                v-model.number="trip.days"
                type="number"
                min="3"
                max="14"
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
              >
            </label>

            <label class="grid gap-1">
              <span class="text-sm text-slate-600">Budget / jour (EUR)</span>
              <input
                v-model.number="trip.dailyBudget"
                type="number"
                min="60"
                max="400"
                step="5"
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
              >
            </label>

            <label class="grid gap-1">
              <span class="text-sm text-slate-600">Focus</span>
              <select
                v-model="trip.focus"
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
              >
                <option v-for="option in focusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>

            <label class="grid gap-1">
              <span class="text-sm text-slate-600">Rythme</span>
              <select
                v-model="trip.pace"
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
              >
                <option v-for="option in paceOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>

            <label class="grid gap-1">
              <span class="text-sm text-slate-600">Mode budget</span>
              <select
                v-model="trip.mode"
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-300 transition focus:ring-2"
              >
                <option v-for="option in modeOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold">
            Projection
          </h2>
          <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p class="text-xs uppercase tracking-wide text-slate-500">
                Budget total
              </p>
              <p class="mt-1 text-lg font-semibold">
                {{ formatEuro(result.budget) }}
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p class="text-xs uppercase tracking-wide text-slate-500">
                Cout estime
              </p>
              <p class="mt-1 text-lg font-semibold">
                {{ formatEuro(result.totalCost) }}
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p class="text-xs uppercase tracking-wide text-slate-500">
                Economie
              </p>
              <p class="mt-1 text-lg font-semibold text-emerald-300">
                {{ formatEuro(result.savings) }}
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p class="text-xs uppercase tracking-wide text-slate-500">
                Score beautE
              </p>
              <p class="mt-1 text-lg font-semibold text-cyan-300">
                {{ result.score }}/100
              </p>
            </div>
          </div>

          <div class="mt-5 text-sm text-slate-600">
            Itineraire trie selon un score "beaute / cout", avec bonus selon ton focus (nature ou ville).
          </div>
        </div>
      </section>

      <section class="mt-8">
        <h2 class="text-2xl font-semibold">
          Itineraire recommande
        </h2>
        <div class="mt-4 grid gap-4">
          <article
            v-for="day in result.plan"
            :key="day.day"
            class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h3 class="text-lg font-semibold">
                Jour {{ day.day }} · {{ day.city }}
              </h3>
              <p class="text-sm text-slate-600">
                Total jour: {{ formatEuro(day.activityCost + day.foodCost + day.stayCost + day.transportCost) }}
              </p>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="spot in day.spots"
                :key="spot.id"
                class="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm"
              >
                {{ spot.name }}
              </span>
            </div>

            <div class="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-4">
              <p>Activites: {{ formatEuro(day.activityCost) }}</p>
              <p>Repas: {{ formatEuro(day.foodCost) }}</p>
              <p>Hebergement: {{ formatEuro(day.stayCost) }}</p>
              <p>Transport: {{ formatEuro(day.transportCost) }}</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>
