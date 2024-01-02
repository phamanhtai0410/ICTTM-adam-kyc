export function buildUrl (item) {
  const queryParams = new URLSearchParams({
    q: item.trim()
  })

  return '/search?' + queryParams.toString()
}
