import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { deleteUploadHistory, getUploadHistory } from 'api/requests'
import { Button, Paginator, Spinner, Title } from 'components'
import { useAlert } from 'providers'
import assets from '../../assets/index'
import './DataUploadResultsPage.style.scss'

function DataUploadResultsPage () {
  const [paginatorParams, setPaginatorParams] = useSearchParams()
  const paginatorValue = paginatorParams.get('paginator')
  const [serverData, setServerData] = useState()
  const { displayAlert } = useAlert()
  const [checkedCheckboxes, setCheckedCheckboxes] = useState([])
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  const [identifiers, setIdentifiers] = useState('')
  const [update, setUpdate] = useState(false)
  const [currentPage, setCurrentPage] = useState(paginatorValue || 1)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(paginatorValue || 1)

  function handleCheckbox (index, e) {
    const { value } = e.target
    const updatedCheckboxes = [...checkedCheckboxes]
    updatedCheckboxes[index] = !updatedCheckboxes[index]
    setCheckedCheckboxes(updatedCheckboxes)

    let updatedSelectedArray = identifiers.split(',').map((item) => item.trim())

    if (updatedSelectedArray.length === 1 && updatedSelectedArray[0] === '') {
      updatedSelectedArray = []
    }

    if (value && updatedCheckboxes[index]) {
      updatedSelectedArray.push(value)
    } else {
      updatedSelectedArray = updatedSelectedArray.filter((item) => item !== value)
    }

    setIdentifiers(updatedSelectedArray.join(','))
  }

  function handleSelectAllCheckbox () {
    if (selectAllChecked) {
      setIdentifiers('')
      setCheckedCheckboxes([])
    } else {
      const updatedIdentifiers = serverData.map(item => item.id).join(',')
      setIdentifiers(updatedIdentifiers)
      const updatedCheckboxes = serverData.map((_) => true)
      setCheckedCheckboxes(updatedCheckboxes)
    }
    setSelectAllChecked(!selectAllChecked)
  }

  async function handleDelete (array) {
    try {
      await deleteUploadHistory(array)
      setCheckedCheckboxes([])
      setSelectAllChecked(false)
      setUpdate((prevUpdate) => !prevUpdate)
    } catch (err) {
      console.error(err)
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
    async function getHistoryFromDB () {
      const res = await getUploadHistory(currentPage)
      if (res.message) return displayAlert(res.message, 10000, 'red')
      setTotalPages(res.totalPages)
      setServerData(res.items)
      return res
    }
    getHistoryFromDB()
  }, [update, page, currentPage])

  useEffect(() => {
    setPaginatorParams({ page: currentPage })
  }, [page, currentPage])

  return (
    serverData !== undefined
      ? (

        <section aria-label='bulk uploader section'>
          <div className='container no-flex no-padding__top-bottom'>
            <Button
              as={Link}
              to='/bulk-upload'
              text='Bulk Uploads of Data'
              type='back'
              ariaLabel='button for returning to previous page'
              className='btn-search padding-8-12 border-black'
            />
            <div className='title'>
              <Title text='Bulk Upload Results' />
            </div>
            <div className='horizontal-line horizontal-line--mb16' />
            <div>
              <div className='button-wrapper'>
                <button
                  type='button'
                  onClick={() => handleDelete(identifiers)}
                  aria-label='button to delete entity'
                  className='button'
                  disabled={identifiers === ''}
                >
                  <assets.Trash width={16} height={16} /> Delete
                </button>
                <button type='button' aria-label='button to download entity' disabled={identifiers === ''} className='button'>
                  <a
                    href={process.env.REACT_APP_API_ENDPOINT + `/bulk-upload/download?identifiers=${identifiers}`}
                    download
                    className='button__link'
                  >
                    <assets.DownloadSVG width={16} height={16} /> Download
                  </a>
                </button>
              </div>
              <div className='table-wrapper'>
                <div className='table-column'>
                  <div className='table-column__element'>
                    <input
                      type='checkbox'
                      checked={selectAllChecked}
                      onChange={handleSelectAllCheckbox}
                    />
                  </div>
                  <div className='table-column__element table-column__element--title'><p>Entity</p></div>
                  <div className='table-column__element table-column__element--title'><p>Status</p></div>
                  <div className='table-column__element table-column__element--title'><p>Type</p></div>
                  <div className='table-column__element table-column__element--title'><p>Date Update</p></div>
                  <div className='table-column__element table-column__element--title'>
                    <p>Download</p>
                  </div>
                  <div className='table-column__element table-column__element--title'>
                    <p>Delete</p>
                  </div>
                </div>
                {serverData?.map((item, index) => {
                  return (
                    <div className='table-column' key={item.id}>
                      <div className='table-column__element'>
                        <input
                          type='checkbox'
                          id={'checkbox' + (index + 1)}
                          value={item.id}
                          checked={checkedCheckboxes[index] || false}
                          onChange={(e) => handleCheckbox(index, e)}
                        />
                      </div>
                      <div className='table-column__element'>
                        {item.entity_id
                          ? (
                            <Link to={`/entity/${item.entity_id}`} aria-label='Link to entity details page'>{item.search}</Link>
                            )
                          : (
                            <p>{item.search}</p>
                            )}
                      </div>
                      <div className='table-column__element'><p className={item.entity_id ? 'table-column__status table-column__status--success' : 'table-column__status table-column__status--error'}>{item.entity_id ? 'Available' : 'Not available'}</p></div>
                      <div className='table-column__element'><p>{item.type ? item.type : 'Any'}</p></div>
                      <div className='table-column__element'><p>{item.created_at.split(' ')[0]}</p></div>
                      <div className='table-column__element'>
                        {item.entity_id && (
                          <a
                            href={process.env.REACT_APP_API_ENDPOINT + `/bulk-upload/download?identifiers=${item.id}`}
                            download
                            className='table-column__link'
                          >
                            <assets.DownloadSVG width={16} height={16} /> Download
                          </a>
                        )}
                      </div>
                      <div className='table-column__element'>
                        <a
                          onClick={() => handleDelete(item.id)}
                          className='table-column__link table-column__link--error'
                        >
                          <assets.Trash width={16} height={16} /> Delete
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
              {(totalPages !== 1 && totalPages > 0) && (
                <Paginator
                  changePage={handlePageChange}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onChange={handleInputChange}
                  page={page}
                />
              )}
            </div>
          </div>
        </section>
        )
      : <Spinner />
  )
}

export default DataUploadResultsPage
