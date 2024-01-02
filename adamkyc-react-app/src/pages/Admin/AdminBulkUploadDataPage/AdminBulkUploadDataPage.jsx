import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { deleteMultipleAdminBulkUploadedDataById, getAllAdminUploadDataEntities, updateMultipleAdminBulkUploadedDataById } from 'api/requests'
import { AdminButton, AdminContolButton, AdminEditRequestTable, DateFilter, Paginator, Sort, Title } from 'components'
import { MockFilterOptions, getTodayAndTomorrow, mockAdminBulkUploadDataStatus } from 'helpers'
import assets from '../../../assets/index'

function AdminBulkUploadDataPage () {
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
  const [draftedData, setDraftedData] = useState()
  const [privatedData, setPrivatedData] = useState()
  const [dataBeenDeleted, setDataBeenDeleted] = useState(false)
  const [searchValue, setSearchValue] = useState(params.get('q') || '')
  const [typeSelectValue, setTypeSelectValue] = useState('')
  const [typeValue, setTypeValue] = useState(params.get('type') || '')
  const [statusSortValue, setStatusSortValue] = useState('')
  const [statusValue, setStatusValue] = useState(params.get('status') || '')
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  const [editData, setEditData] = useState([])
  const [dataBeenChanged, setDataBeenChanged] = useState(false) //eslint-disable-line
  const [dataBeenSaved, setDataBeenSaved] = useState(false)
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [category, setCategory] = useState('default')
  const [filteredData, setFilteredData] = useState(false)
  const [draftData, setDraftData] = useState(false)
  const [privateData, setPrivateData] = useState(false)
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
    { name: 'Verified', value: 'VERIFIED' },
    { name: 'Unverified', value: 'UNVERIFIED' },
    { name: 'Incorrect', value: 'INCORRECT' }
  ]

  async function getAllReportsFromDB (searchValue, state) {
    try {
      const res = await getAllAdminUploadDataEntities((currentPage !== page ? currentPage : page), dateData.after, dateData.before, (state || ''), (searchValue || ''), (statusValue || ''), (typeValue || ''))
      if (state === 'DELETED') return (setDeletedData(res.items), setTotalPages(res.totalPages))
      if (state === 'DRAFT') return (setDraftedData(res.items), setTotalPages(res.totalPages))
      if (state === 'PRIVATE') return (setPrivatedData(res.items), setTotalPages(res.totalPages))
      if (state === 'PUBLIC') return (setServerData(res.items), setTotalPages(res.totalPages))
    } catch (err) {
      return err
    }
  }

  async function updateAllReports () {
    const dataObject = { data: editData }
    try {
      await updateMultipleAdminBulkUploadedDataById(dataObject)
      handleStartEditMode()
      setDataBeenSaved(!dataBeenSaved)
    } catch (err) {
      return err
    }
  };

  async function trashAllReports () {
    const idArray = selectedCheckboxes.join(', ')
    try {
      await deleteMultipleAdminBulkUploadedDataById(idArray)
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

  function handleCheckboxChange (index) {
    setSelectedCheckboxes((prev) => {
      const newSelected = [...prev]
      if (newSelected.includes(index)) {
        newSelected.splice(newSelected.indexOf(index), 1)
      } else {
        newSelected.push(index)
      }
      return newSelected
    })
  }

  function handleSelectAllCheckbox () {
    if (selectAllChecked) {
      setSelectedCheckboxes([])
    } else {
      const currentData = filteredData ? deletedData : draftData ? draftedData : privateData ? privatedData : serverData
      const updatedCheckboxes = currentData.map(item => item.id)
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
      const result = keysArray.find((item) => item.name === value)?.value.toUpperCase()
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
      SetFunction({ id: '', status: '', type: '', created_at: '' })
    }
    setDataBeenSaved(!dataBeenSaved)
  }

  function handleChangeCategory (e) {
    const { value } = e.target

    if (value === 'DELETED') {
      setFilteredData(!filteredData)
      setPrivateData(false)
      setDraftData(false)
      setCurrentPage(1)
    } else if (value === 'DRAFT') {
      setDraftData(!draftData)
      setPrivateData(false)
      setFilteredData(false)
      setCurrentPage(1)
    } else if (value === 'PRIVATE') {
      setPrivateData(!privateData)
      setFilteredData(false)
      setDraftData(false)
      setCurrentPage(1)
    } else {
      setFilteredData(false)
      setFilteredData(false)
      setDraftData(false)
      setCurrentPage(1)
    }

    setCategory(value)
  }

  useEffect(() => {
    if (tabValue === 'Trash') {
      setFilteredData(true)
      setPrivateData(false)
      setDraftData(false)
      setCategory('DELETED')
    } else if (tabValue === 'Draft') {
      setPrivateData(false)
      setFilteredData(false)
      setDraftData(true)
      setCategory('DRAFT')
    } else if (tabValue === 'Private') {
      setPrivateData(true)
      setFilteredData(false)
      setDraftData(false)
      setCategory('PRIVATE')
    } else {
      setFilteredData(false)
      setPrivateData(false)
      setDraftData(false)
      setCategory('default')
    }
  }, [tabValue])

  useEffect(() => {
    if (filteredData) getAllReportsFromDB(searchValue || '', 'DELETED')
    if (draftData) getAllReportsFromDB(searchValue || '', 'DRAFT')
    if (privateData) getAllReportsFromDB(searchValue || '', 'PRIVATE')
    else getAllReportsFromDB(searchValue || '', 'PUBLIC')
  }, [dateData, statusSortValue, searchValue, typeValue, dataBeenDeleted, dataBeenSaved, filteredData, draftData, privateData, page, currentPage, category, tabValue])

  useEffect(() => {
    setSearchParams({ q: searchValue || '', tab: (filteredData ? 'Trash' : draftData ? 'Draft' : privateData ? 'Private' : 'All'), type: typeValue || '', page: (currentPage !== page ? currentPage : page), status: statusValue || '', after: dateData.after.toString(), before: dateData.before.toString() })
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
          <div className='admin-edit__header-wrapper--holder'>
            <Title text='All Editing Requests' />
            <div className='admin-edit__header-wrapper--buttons'>
              <AdminButton
                text='Add New Entity Profile'
                svgPath='FilePlusSVG'
                className='admin-edit__header-control--button'
                isLink
              />
              <AdminButton
                text='Import New File (CSV)'
                svgPath='Upload'
                className='admin-edit__header-control--button'
              />
            </div>
          </div>
          <div className='admin-edit__type-selector'>
            <AdminContolButton
              category={category}
              value='default'
              onClick={handleChangeCategory}
              text='Public'
            />
            <AdminContolButton
              category={category}
              value='PRIVATE'
              onClick={handleChangeCategory}
              text='Published'
            />
            <AdminContolButton
              category={category}
              value='DRAFT'
              onClick={handleChangeCategory}
              text='Draft'
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
                value={typeSelectValue}
                onChange={handleTypeValueChange}
                className='sort--admin-uploaded'
              />
              <Sort
                text='Sort By Status'
                array={mockAdminBulkUploadDataStatus}
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
          tableName='BulkUploadData'
          serverData={filteredData ? deletedData : draftData ? draftedData : privateData ? privatedData : serverData}
          editData={editData}
          // onDelete={moveToTrash}
          onSave={handleSaveChanges}
          onChange={handleSelectAllCheckbox}
          OnChange={handleChange}
          CheckboxChange={handleCheckboxChange}
          CleanCheckboxes={setSelectedCheckboxes}
          Checkboxes={selectedCheckboxes}
          checked={selectAllChecked}
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

export default AdminBulkUploadDataPage
