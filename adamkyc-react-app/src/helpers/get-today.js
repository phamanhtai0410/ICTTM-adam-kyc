export function getTodayAndTomorrow () {
  const currentDate = new Date()
  const tomorrow = new Date(currentDate)
  const lastMonth = new Date(currentDate)
  lastMonth.setMonth(currentDate.getMonth() - 1)
  tomorrow.setDate(currentDate.getDate() + 1)

  const year = lastMonth.getFullYear()
  const month = (currentDate.getMonth()).toString().padStart(2, '0')
  const day = currentDate.getDate().toString().padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`

  const yearTomorrow = tomorrow.getFullYear()
  const monthTomorrow = (tomorrow.getMonth() + 1).toString().padStart(2, '0')
  const dayTomorrow = tomorrow.getDate().toString().padStart(2, '0')
  const formattedDateTomorrow = `${yearTomorrow}-${monthTomorrow}-${dayTomorrow}`

  return { today: formattedDate, tomorrow: formattedDateTomorrow }
}
