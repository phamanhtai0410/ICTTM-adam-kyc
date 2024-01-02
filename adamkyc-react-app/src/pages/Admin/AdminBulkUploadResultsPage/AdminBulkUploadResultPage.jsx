import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { deleteAdminUploadHistory, getAdminUploadHistory } from 'api/requests'
import { Title, Sort, DateFilter, AdminBulkUploadedTable, Paginator } from 'components'
import { MockFilterOptions, getTodayAndTomorrow, mockAdminBulkUploadStatus } from 'helpers'
import './AdminBulkUploadedResult.style.scss'

function AdminBulkUploadResultPage () {
  const dates = getTodayAndTomorrow()
  const [params, setSearchParams] = useSearchParams()
  const paginatorValue = params.get('page')
  const [serverData, setServerData] = useState()
  const [typeSelectValue, setTypeSelectValue] = useState('')
  const [typeValue, setTypeValue] = useState(params.get('type') || '')
  const [statusSortValue, setStatusSortValue] = useState('')
  const [statusValue, setStatusValue] = useState(params.get('status') || '')
  const [currentPage, setCurrentPage] = useState(paginatorValue || 1)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(paginatorValue || 1)
  const [dateData, setDateData] = useState({
    after: dates.today,
    before: dates.tomorrow
  })

  const keysArray = [
    { name: 'address', value: 'Addresses' },
    { name: 'bank-account', value: 'Back Accounts' },
    { name: 'crypto-wallet', value: 'Crypto Wallets' },
    { name: 'person', value: 'Individuals' },
    { name: 'legal-entity', value: 'Legal Entities' },
    { name: 'security', value: 'Securities' },
    { name: 'vessel', value: 'Aircrafts or Ships' },
    { name: 'Failure', value: 'FAILURE' },
    { name: 'Success', value: 'SUCCESS' }
  ]

  async function getAllReportsFromDB () {
    try {
      const res = await getAdminUploadHistory((currentPage !== page ? currentPage : page), dateData.after, dateData.before, (statusValue || ''), (typeValue || ''))
      setTotalPages(res.totalPages)
      setServerData(res.items)
    } catch (err) {
      return err
    }
  }

  async function deleteAdminUpload (id) {
    await deleteAdminUploadHistory(id)
    getAllReportsFromDB()
  }

  function handlePageChange (newPage) {
    setCurrentPage(newPage)
    setPage(newPage)
  }

  function handleInputChange (e) {
    const { value } = e.target
    setPage(value)
  }

  function handleTypeValueChange (e) {
    const { value } = e.target

    if (value === 'Sort By Type') {
      const newValue = ''
      setTypeValue(newValue)
      setTypeSelectValue(newValue)
    } else if (value === 'Aircrafts or Ships') {
      setTypeSelectValue(value)
      setTypeValue('vessel')
    } else {
      const result = keysArray.find((item) => item.value === value)?.name
      setTypeSelectValue(value)
      setTypeValue(result)
    }
  }

  function handleSortValueChange (e) {
    const { value } = e.target

    if (value === 'Sort By Status') {
      const newValue = ''
      setStatusSortValue(newValue)
      setStatusValue(newValue)
    } else {
      const result = keysArray.find((item) => item.name === value)?.value
      setStatusSortValue(value)
      setStatusValue(result)
    }
  }

  function handleDateChange (e, inputId) {
    const { value } = e.target
    setDateData({
      ...dateData,
      [inputId]: value
    })
  }

  useEffect(() => {
    getAllReportsFromDB()
  }, [dateData, statusSortValue, typeValue, page, currentPage])

  useEffect(() => {
    setSearchParams({ type: typeValue || '', page: (currentPage !== page ? currentPage : page), status: statusValue || '', after: dateData.after.toString(), before: dateData.before.toString() })
  }, [typeValue, statusValue, dateData, page, currentPage])

  useEffect(() => {
    if (typeValue === 'Aircrafts or Ships') {
      setTypeSelectValue('Aircrafts or Ships')
    } else setTypeSelectValue(keysArray.find((item) => item.name === typeValue)?.value)
    if (statusValue) setStatusSortValue(keysArray.find((item) => item.value === statusValue)?.name)
  }, [typeValue, statusValue])

  return (
    <section aria-label='bulk uploader section' className='padding-top'>
      <div className='container no-flex no-padding__top-bottom'>
        <div className='admin-bulk'>
          <Title text='Uploaded History' />
          <div className='admin-bulk__sort'>
            <div className='admin-bulk__sort'>
              <Sort
                text='Sort By Type'
                array={MockFilterOptions}
                value={typeSelectValue}
                onChange={handleTypeValueChange}
                className='sort--admin-uploaded'
              />
              <Sort
                text='Sort By Status Upload'
                value={statusSortValue}
                onChange={handleSortValueChange}
                array={mockAdminBulkUploadStatus}
                className='sort--admin-uploaded'
              />
            </div>
            <div>
              <DateFilter
                onChange={handleDateChange}
                data={dateData}
                isAdmin
              />
            </div>
          </div>
        </div>
        <div className='horizontal-line push-content admin-bulk--vertical-line-margin' />
        <AdminBulkUploadedTable serverData={serverData} onClick={deleteAdminUpload} />
        {(totalPages > 1) && (
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
}

export default AdminBulkUploadResultPage
