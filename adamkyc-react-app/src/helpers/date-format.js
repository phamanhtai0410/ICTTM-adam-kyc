export function formatDate (dateString, isDay) {
  const options = { year: 'numeric', month: 'long' }
  const options2 = { year: 'numeric', month: 'long', day: 'numeric' }
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', isDay ? options2 : options)
}
