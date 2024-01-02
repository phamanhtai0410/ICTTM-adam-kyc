import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminButton, AdminContolButton, AdminEditRequestTable, DateFilter, Paginator, Sort, Title } from 'components'
import { deleteAdminReportById, deleteMultipleAdminReportById, getAllAdminReports, updateMultipleAdminReportById } from 'api/requests'
import { MockFilterOptions, getTodayAndTomorrow, mockAdminStatusData } from 'helpers'
import assets from '../../../assets/index'
import './AdminEditingRequestPage.style.scss'

function AdminEditingRequestPage () {
  const dates = getTodayAndTomorrow()
  const [dateData, setDateData] = useState({
    after: dates.today,
    before: dates.tomorrow
  })
  const [params, setSearchParams] = useSearchParams()
  const paginatorValue = params.get('page')
  const [tabValue, setTabValue] = useState(params.get('tab') || 'All') //eslint-disable-line
  const [serverData, setServerData] = useState()
  const [deletedData, setDeletedData] = useState()
  const [dataBeenDeleted, setDataBeenDeleted] = useState(false)
  const [searchValue, setSearchValue] = useState(params.get('q') || '')
  const [typeSelectValue, setTypeSelectValue] = useState('')
  const [typeValue, setTypeValue] = useState(params.get('type') || '')
  const [statusSortValue, setStatusSortValue] = useState('')
  const [statusValue, setStatusValue] = useState(params.get('status') || '')
  const [editData, setEditData] = useState([])
  const [dataBeenChanged, setDataBeenChanged] = useState(false) //eslint-disable-line
  const [dataBeenSaved, setDataBeenSaved] = useState(false)
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([])
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [category, setCategory] = useState('default')
  const [filteredData, setFilteredData] = useState(false)
  const [currentPage, setCurrentPage] = useState(paginatorValue || 1)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(paginatorValue || 1)

  const keysArray = [
    { name: 'address', value: 'Addresses' },
    { name: 'bank-account', value: 'Back Accounts' },
    { name: 'crypto-wallet', value: 'Crypto Wallets' },
    { name: 'person', value: 'Individuals' },
    { name: 'legal-entity', value: 'Legal Entities' },
    { name: 'security', value: 'Securities' },
    { name: 'vessel', value: 'Aircrafts or Ships' },
    { name: 'Approved', value: 'APPROVED' },
    { name: 'Reviewing', value: 'REVIEWING' },
    { name: 'Denied', value: 'DENIED' }
  ]

  async function moveToTrash (id, single) {
    await deleteAdminReportById(id)
    if (single) setDataBeenDeleted(!dataBeenDeleted)
  }

  async function getAllReportsFromDB (searchValue, state) {
    try {
      const res = await getAllAdminReports((currentPage !== page ? currentPage : page), dateData.after, dateData.before, (searchValue || ''), (statusValue || ''), (typeValue || ''), (state || ''))
      if (state) return (setDeletedData(res.items), setTotalPages(res.totalPages))
      setTotalPages(res.totalPages)
      setServerData(res.items)
    } catch (err) {
      return err
    }
  }

  async function updateAllReports () {
    const dataObject = { data: editData }
    try {
      await updateMultipleAdminReportById(dataObject)
      handleStartEditMode()
      dataBeenSaved(!dataBeenSaved)
    } catch (err) {
      return err
    }
  };

  async function trashAllReports () {
    const idArray = selectedCheckboxes.join(', ')
    try {
      await deleteMultipleAdminReportById(idArray)
      setEditMode(false)
      setDataBeenDeleted(!dataBeenDeleted)
      setSelectedCheckboxes([])
    } catch (err) {
      return err
    }
  };

  function handlePageChange (newPage) {
    setCurrentPage(newPage)
    setPage(newPage)
  }

  function handleInputChange (e) {
    const { value } = e.target
    setPage(value)
  }

  function handleCheckboxChange (id) {
    setSelectedCheckboxes((prev) => {
      const newSelected = [...prev]
      if (newSelected.includes(id)) {
        newSelected.splice(newSelected.indexOf(id), 1)
      } else {
        newSelected.push(id)
      }
      return newSelected
    })
  }

  function handleSelectAllCheckbox () {
    if (selectAllChecked) {
      setSelectedCheckboxes([])
    } else {
      const updatedCheckboxes = serverData.map(item => item.id)
      setSelectedCheckboxes(updatedCheckboxes)
    }
    setSelectAllChecked(!selectAllChecked)
  }

  function handleStartEditMode () {
    setEditMode(!editMode)
  }

  function reloadPage () {
    window.location.reload()
  }

  function handleChange (e, itemId, setFunction) {
    const { name, value } = e.target

    setFunction((prevEditData) => ({
      ...prevEditData,
      id: itemId,
      [name]: value === 'default' ? 'Unknown' : value
    }))
  }

  function handleSearchValueChange (e) {
    const { value } = e.target
    setSearchValue(value)
  }

  function handleSumbit (e) {
    e.preventDefault()
    getAllReportsFromDB(searchValue, filteredData ? 'DELETED' : '')
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

  function handleSaveChanges (localEditData, SetFunction) {
    if (localEditData.id && localEditData.status) {
      setEditData((prevEditData) => [
        ...prevEditData,
        {
          ...localEditData,
          status: localEditData.status.toUpperCase()
        }
      ])
      SetFunction({ id: '', status: '' })
    }
    setDataBeenSaved(!dataBeenSaved)
  }

  function handleChangeCategory (e) {
    const { value } = e.target

    if (value === 'DELETED') {
      setFilteredData(!filteredData)
      setCurrentPage(1)
    } else {
      setFilteredData(false)
      setCurrentPage(1)
    }

    setCategory(value)
  }

  useEffect(() => {
    if (tabValue === 'Trash') {
      setFilteredData(true)
      setCategory('DELETED')
    } else {
      setFilteredData(false)
      setCategory('default')
    }
  }, [tabValue])

  useEffect(() => {
    if (filteredData) getAllReportsFromDB(searchValue || '', 'DELETED')
    else getAllReportsFromDB(searchValue || '')
  }, [dateData, statusSortValue, searchValue, typeValue, dataBeenDeleted, dataBeenSaved, filteredData, page, currentPage, category, tabValue])

  useEffect(() => {
    setSearchParams({ q: searchValue || '', tab: (!filteredData ? 'All' : 'Trash'), type: typeValue || '', page: (currentPage !== page ? currentPage : page), status: statusValue || '', after: dateData.after.toString(), before: dateData.before.toString() })
  }, [typeValue, statusValue, searchValue, dateData, page, currentPage, filteredData])

  useEffect(() => {
    if (editData.length > 0) {
      updateAllReports()
    }
  }, [editData])

  useEffect(() => {
    if (typeValue === 'Aircrafts or Ships') {
      setTypeSelectValue('Aircrafts or Ships')
    } else setTypeSelectValue(keysArray.find((item) => item.name === typeValue)?.value)
    if (statusValue) setStatusSortValue(keysArray.find((item) => item.value === statusValue)?.name)
  }, [typeValue, statusValue])

  return (
    <section className='padding-top' aria-label='bulk uploader section'>
      <div className='container no-flex no-padding__top-bottom'>
        <div className='admin-edit__header-wrapper'>
          <Title text='All Editing Requests' />
          <div className='admin-edit__type-selector'>
            <AdminContolButton
              category={category}
              value='default'
              onClick={handleChangeCategory}
              text='All'
            />
            <AdminContolButton
              category={category}
              value='DELETED'
              onClick={handleChangeCategory}
              text='Trash'
            />
          </div>
          <div className='admin-edit__header-functions'>
            <div className='admin-edit__sort-wrapper'>
              <Sort
                text='Sort By Type'
                array={MockFilterOptions}
                className='sort--admin-uploaded'
                value={typeSelectValue}
                onChange={handleTypeValueChange}
              />
              <Sort
                text='Sort By Status'
                array={mockAdminStatusData}
                className='sort--admin-uploaded'
                value={statusSortValue}
                onChange={handleSortValueChange}
              />
            </div>
            <div className='admin-edit__form-wrapper'>
              <form onSubmit={(e) => handleSumbit(e)} className='admin-edit__form-wrapper__element'>
                <div className='hero-searchbar__wrapper admin-edit__form-wrapper__admin-form'>
                  <label
                    className='hero-search admin-edit__form-wrapper__admin-label'
                  >
                    <assets.SearchWhiteSVG
                      width={16}
                      height={16}
                      className='hero-search__icon'
                    />
                    <input
                      type='text'
                      name='search'
                      className='hero-container__field'
                      placeholder='Keyword'
                      value={searchValue}
                      onChange={(e) => handleSearchValueChange(e)}
                    />
                  </label>
                  <button
                    type='submit'
                    className='button-primary admin-edit__form-wrapper__admin-button'
                    disabled={searchValue === ''}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
            <div className='admin-edit__form-wrapper'>
              <DateFilter
                onChange={handleDateChange}
                data={dateData}
                isAdmin
              />
            </div>
          </div>
          <div className='admin-edit__header-control'>
            <AdminButton
              text='Move to trash'
              svgPath='Trash'
              className='button--red'
              disabled={selectedCheckboxes.length === 0}
              onClick={trashAllReports}
            />
            <AdminButton
              text='Reload Page'
              svgPath='Trash'
              onClick={reloadPage}
              className='admin-edit__header-control--button'
            />
            <AdminButton
              text='Quick Edit'
              svgPath='EditSVG'
              className={`admin-edit__header-control--button ${editMode ? 'admin-edit__header-control--button-active' : ''}`}
              onClick={handleStartEditMode}
            />
            <AdminButton
              text='Save'
              svgPath='SaveSVG'
              className='button--green'
              onClick={handleSaveChanges}
              disabled={selectedCheckboxes.length === 0}
            />
          </div>
        </div>
        <AdminEditRequestTable
          serverData={filteredData ? deletedData : serverData}
          editData={editData}
          OnChange={handleChange}
          onDelete={moveToTrash}
          onSave={handleSaveChanges}
          CheckboxChange={handleCheckboxChange}
          CleanCheckboxes={setSelectedCheckboxes}
          Checkboxes={selectedCheckboxes}
          checked={selectAllChecked}
          onChange={handleSelectAllCheckbox}
          startEditMode={editMode}
          {...dataBeenSaved ? { isSaved: dataBeenSaved } : null}
          {...dataBeenChanged ? { isChanged: dataBeenChanged } : null}
        />
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

export default AdminEditingRequestPage
