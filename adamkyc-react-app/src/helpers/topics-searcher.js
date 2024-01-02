import { useStore } from 'providers'

export function topicsSearcher (topic) {
  const { topics } = useStore()
  const entries = Object.entries(topics?.data ?? {})
  return entries.find(([key, value]) => key === topic)?.[1]
}
