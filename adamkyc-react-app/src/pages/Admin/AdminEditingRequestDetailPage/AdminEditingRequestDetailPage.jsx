import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useAlert } from 'providers'
import { Button, DetailArea, DetailCreateReview, DetailReviewCard, DetailsChangelog, DetailsFields, DetailsRequestURL, Spinner } from 'components'
import { createAdminReportNote, deleteAdminReportById, deleteAdminReportNote, getAdminChangelogById, getAdminReportById, getAdminReportNotesById, updateAdminReportById, updateAdminReportNote } from 'api/requests'
import './AdminEditingRequestDetailPage.style.scss'

function AdminEditingRequestDetailPage () {
  const { id } = useParams()
  const { displayAlert } = useAlert()
  const location = useLocation()
  const navigate = useNavigate()
  const [dataBeenChanged, setDataBeenChanged] = useState(false)
  const [changelogData, setChangelogData] = useState()
  const [serverData, setServerData] = useState()
  const [notesData, setNotesData] = useState()
  const [updated, setUpdated] = useState(false)
  const [created, setCreated] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [statusSortValue, setStatusSortValue] = useState('')
  const [statusValue, setStatusValue] = useState()
  const [review, setReview] = useState({
    subject: '',
    note: ''
  })
  const [editData, setEditData] = useState({
    subject: '',
    note: ''
  })
  const keysArray = [
    { name: 'Approved', value: 'APPROVED' },
    { name: 'Reviewing', value: 'REVIEWING' },
    { name: 'Denied', value: 'DENIED' }
  ]

  async function getChangelog () {
    try {
      const res = await getAdminChangelogById(id)
      setChangelogData(res)
    } catch (err) {
      return err
    }
  }

  async function updateReport () {
    try {
      updateAdminReportById(id, { status: statusValue })
      return displayAlert('Report was updated', 5000)
    } catch (err) {
      return err
    }
  }

  async function deleteReport () {
    try {
      deleteAdminReportById(id)
      navigate('/admin/reports')
    } catch (err) {
      return err
    }
  }

  async function createReport () {
    try {
      await createAdminReportNote(id, review)
      setCreated(!created)
    } catch (err) {
      return err
    }
  }

  async function updateNote (entityId, noteId) {
    try {
      await updateAdminReportNote(entityId, noteId, editData)
      setDataBeenChanged(!dataBeenChanged)
      setUpdated(!updated)
    } catch (err) {
      return err
    }
  }

  async function deleteNote (entityId, noteId) {
    try {
      await deleteAdminReportNote(entityId, noteId)
      setDeleted(!deleted)
    } catch (err) {
      return err
    }
  }

  function handleReturn () {
    navigate(location.state.from.pathname + location.state.from.search)
  }

  function handleSortValueChange (e) {
    const { value } = e.target

    if (value === 'status') {
      const newValue = ''
      setStatusSortValue(newValue)
      setStatusValue(newValue)
    } else {
      const result = keysArray.find((item) => item.name === value)?.value
      setStatusSortValue(value)
      setStatusValue(result)
    }
  }

  function handleStatusSubmit () {
    updateReport()
  }

  function handleDeleteReport () {
    deleteReport()
  }

  function handleChange (e) {
    const { name, value } = e.target

    setEditData((prevEditData) => ({
      ...prevEditData,
      [name]: value
    }))
  }

  function handleChangeCreateReview (e) {
    const { name, value } = e.target
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value
    }))
  }

  function handleCreateReview () {
    createReport()
    setReview({
      subject: '',
      note: ''
    })
  }

  function handleSaveChanges (e, itemId) {
    e.preventDefault()
    updateNote(id, itemId, editData)
  }

  function handleDeleteItem (itemId) {
    deleteNote(id, itemId)
  }

  useEffect(() => {
    async function fetchData () {
      try {
        const res = await getAdminReportById(id)
        setServerData(res)
      } catch (err) {
        return err
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData () {
      try {
        const res = await getAdminReportNotesById(id)
        setNotesData(res)
      } catch (err) {
        return err
      }
    }
    fetchData()
  }, [updated, created, deleted])

  useEffect(() => {
    getChangelog()
  }, [updated, created, deleted])

  useEffect(() => {
    if (serverData) {
      setStatusSortValue(keysArray.find((item) => item.value === serverData.status)?.name)
    }
  }, [serverData])

  return (
    serverData
      ? (
        <section className='padding-top' aria-label='bulk uploader section'>
          <div className='container no-flex no-padding__top-bottom'>
            <div className='admin-details__back-button'>
              {location.state ? <Button text='Back' type='back' ariaLabel='button for returning to previous page' className='btn-search padding-8-12 border-black' onClick={handleReturn} /> : ''}
            </div>
            <div className='title-wrapper__results-container admin-details__title-wrapper'>
              <h1 className='admin-details__title-wrapper__title'>
                Requests Entity:
              </h1>
              <Link to={`/entity/${serverData?.entity_id}`} className='' aria-label='Link to entity details page'>
                <span className='admin-details__title-wrapper__span'>{serverData?.entity_name}</span>
              </Link>
            </div>
            <div className='admin-details--content-wrapper'>
              <div aria-label='1st section' className='admin-details--1st-section'>
                <DetailsFields data={serverData} />
                <DetailArea data={serverData} />
                <div className='admin-details--review'>
                  <h2 className='admin-details__title-wrapper__title'>Note from Reviewer</h2>
                  {notesData?.map((item, index) => {
                    const updatedEditData = {
                      subject: item.subject || '',
                      note: item.note || ''
                    }

                    return (
                      <DetailReviewCard
                        key={index}
                        data={item}
                        editData={editData}
                        updatedEditData={updatedEditData}
                        OnChange={handleChange}
                        onSave={handleSaveChanges}
                        onDelete={handleDeleteItem}
                        {...dataBeenChanged ? { isChanged: dataBeenChanged } : null}
                      />
                    )
                  })}
                  <DetailCreateReview data={review} onChange={handleChangeCreateReview} onSave={handleCreateReview} />
                </div>
              </div>
              <div aria-label='2nd section' className='admin-details--2nd-section'>
                <DetailsRequestURL data={serverData} OnChange={handleSortValueChange} statusValue={statusSortValue} onSave={handleStatusSubmit} onDelete={handleDeleteReport} />
                <DetailsChangelog data={changelogData} />
              </div>
            </div>
          </div>
        </section>
        )
      : (
        <Spinner />
        )
  )
}

export default AdminEditingRequestDetailPage
