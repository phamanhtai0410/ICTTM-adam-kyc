import { useSearchParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Button, Card, DateFilter, Paginator, Spinner, Title } from 'components'
import { useAlert } from 'providers'
import { clearAllBookmarks, getAllBookmarks } from 'api/requests'
import { getTodayAndTomorrow } from 'helpers'
import './SavedResultsPage.style.scss'

function SavedResultsPage () {
  const dates = getTodayAndTomorrow()
  const [paginatorParams, setPaginatorParams] = useSearchParams()
  const paginatorValue = paginatorParams.get('paginator')
  const [elementCount, setElementCount] = useState(0)
  const { displayAlert } = useAlert()
  const [serverData, setServerData] = useState()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(paginatorValue || 1)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(paginatorValue || 1)
  const [dateData, setDateData] = useState({
    after: dates.today,
    before: dates.tomorrow
  })

  function handleDateChange (e, inputId) {
    const { value } = e.target
    setDateData({
      ...dateData,
      [inputId]: value
    })
  }

  useEffect(() => {
    async function fetchData () {
      try {
        if (dateData.after.length !== 0 && dateData.before.length !== 0) {
          const res = await getAllBookmarks(dateData, currentPage)
          setLoading(false)
          setTotalPages(res.totalPages)
          setCurrentPage(res.page)
          setServerData(res.items)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [dateData, currentPage])

  useEffect(() => {
    serverData?.length !== 0 && setElementCount(serverData?.length)
  }, [serverData])

  async function handleClearBookmarks () {
    const res = await clearAllBookmarks()
    if (res.message) return displayAlert(res.message, 10000, 'red')
    if (res.status === true) {
      setServerData()
      displayAlert('All bookmarks was deleted')
    }
  }

  function handlePageChange (newPage) {
    setCurrentPage(newPage)
    setPage(newPage)
  }

  function handleInputChange (e) {
    const { value } = e.target
    setPage(value)
  }

  useEffect(() => {
    setPaginatorParams({ page: currentPage })
  }, [page, currentPage])

  return (
    loading === false
      ? (
        <section className='section' aria-label='search results section'>
          <div className='container no-flex no-padding__top-bottom'>
            <div className='hero-title__container push-content'>
              <Title text='Bookmarks' quantity={elementCount} />
              <DateFilter onChange={handleDateChange} data={dateData} />
              <Button
                text='Clear all bookmarks'
                ariaLabel='button for cleaning bookmarks'
                className='btn font-size'
                type='trash'
                onClick={handleClearBookmarks}
              />
            </div>
            <div className='horizontal-line push-content' />
            {serverData && (
              <div className='content-container'>
                {serverData && serverData.map((item, index) => <Card key={index} dataArray={item} />)}
              </div>
            )}
          </div>
          {(serverData && (totalPages !== 1 && totalPages !== 0)) && (
            <Paginator
              changePage={handlePageChange}
              totalPages={totalPages}
              currentPage={currentPage}
              onChange={handleInputChange}
              page={page}
            />
          )}
        </section>
        )
      : <Spinner />
  )
}

export default SavedResultsPage
