import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { formatDate, getTodayAndTomorrow } from 'helpers'
import { clearHistory, getHistory } from 'api/requests'
import { Button, DateFilter, Paginator, SearchHistoryTable, Spinner, Title } from 'components'
import { useAlert } from 'providers'
import './SearchHistoryPage.style.scss'

function SearchHistoryPage () {
  const dates = getTodayAndTomorrow()
  const [paginatorParams, setPaginatorParams] = useSearchParams()
  const paginatorValue = paginatorParams.get('paginator')
  const [historyData, setHistoryData] = useState()
  const { displayAlert } = useAlert()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(paginatorValue || 1)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(paginatorValue || 1)
  const [groupedArray, setGroupedArray] = useState()
  const [dateData, setDateData] = useState({
    after: dates.today,
    before: dates.tomorrow
  })

  function handleInputChange (e) {
    const { value } = e.target
    setPage(value)
  }

  function handleDateChange (e, inputId) {
    const { value } = e.target
    setDateData({
      ...dateData,
      [inputId]: value
    })
  }

  useEffect(() => {
    if (historyData) {
      const updatedGroupedData = {}

      historyData.forEach(item => {
        const date = item.created_at.split(' ')[0]
        if (!updatedGroupedData[date]) {
          updatedGroupedData[date] = []
        }
        updatedGroupedData[date].push(item)
      })

      setGroupedArray(Object.keys(updatedGroupedData).map(date => ({ date: formatDate(date, true), data: updatedGroupedData[date] })))
    }
  }, [historyData])

  function handleCleanHistory () {
    clearHistory()
    setGroupedArray([])
    setHistoryData()
    setTotalPages()
  }

  function handlePageChange (newPage) {
    setCurrentPage(newPage)
    setPage(newPage)
  }

  useEffect(() => {
    async function getHistoryFromDB () {
      if (dateData.after.length !== 0 && dateData.before.length !== 0) {
        const res = await getHistory(dateData, currentPage)
        if (res.message) return displayAlert(res.message, 10000, 'red')
        setLoading(false)
        setGroupedArray([])
        setTotalPages(res.totalPages)
        setHistoryData(res.items)
        return res
      }
    }
    getHistoryFromDB()
  }, [dateData, currentPage])

  useEffect(() => {
    setPaginatorParams({ page: currentPage })
  }, [page, currentPage])

  return (
    loading === false
      ? (
        <section className='section' aria-label='search history section'>
          <div className='container no-flex no-padding__top-bottom'>
            <div className='hero-title__container push-content'>
              <Title text='History' />
              <DateFilter onChange={handleDateChange} data={dateData} />
              <Button
                text='Clear all history'
                ariaLabel='button for cleaning bookmarks'
                className='btn'
                type='trash'
                onClick={handleCleanHistory}
              />
            </div>
            <div className='horizontal-line push-content' />
            <div className='table-flex'>
              {groupedArray && (
                groupedArray?.map((item, index) => (
                  <SearchHistoryTable key={index} tableDate={item.date} data={item.data} />
                ))
              )}
            </div>
            {(historyData?.length !== 0 && totalPages > 1) && (
              <Paginator
                changePage={handlePageChange}
                totalPages={totalPages}
                currentPage={currentPage}
                onChange={handleInputChange}
                page={page}
              />
            )}
          </div>
        </section>
        )
      : <Spinner />
  )
}

export default SearchHistoryPage
