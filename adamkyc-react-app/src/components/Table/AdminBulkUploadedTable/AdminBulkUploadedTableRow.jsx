import { useEffect, useState } from 'react'
import { TitleCapiralize, mockAdminBulkUploadDataStatus } from 'helpers'
import { QuickAction } from 'components'
import assets from '../../../assets/index'

export function AdminBulkUploadedTableRow ({ item, index, editData, OnChange, onDelete, onSave, isChanged, isSaved, CheckboxChange, CleanCheckboxes, Checkboxes, startEditMode, isBulkUpload }) {
  const [editMode, setEditMode] = useState(false)
  const [localEditData, setLocalEditData] = useState({
    id: item.id,
    status: ''
  })

  function handleSetEditMode () {
    setEditMode(!editMode)
  }

  const getColorForStatus = (status) => {
    switch (status) {
      case 'UNVERIFIED':
        return '#DA881E'
      case 'VERIFIED':
        return '#14B550'
      case 'INCORRECT':
        return '#EA1E1E'
      default:
        return 'black'
    }
  }

  useEffect(() => {
    if (startEditMode) {
      setEditMode(Checkboxes.includes(item.id))
    } else if (Checkboxes.length === 0) {
      setEditMode(false)
    } else {
      const isItemChecked = Checkboxes.includes(item.id)
      if (isItemChecked && !startEditMode) {
        setEditMode(false)
      }
    }
  }, [Checkboxes, item.id, startEditMode])

  useEffect(() => {
    if (isChanged === true) {
      CleanCheckboxes([])
      setEditMode(false)
    }
  }, [isChanged])

  useEffect(() => {
    if (isSaved === true) {
      onSave(localEditData, setLocalEditData)
      CleanCheckboxes((prev) => {
        const newSelected = [...prev]
        if (newSelected.includes(item.id)) {
          newSelected.splice(newSelected.indexOf(item.id), 1)
        }
        return newSelected
      })
    }
  }, [isSaved])

  return (
    <div className='admin-table table-column' key={`${item} + ${index}`}>
      <div className='admin-table__second-element table-column__element'>
        <input
          type='checkbox'
          id={'checkbox' + (item.id)}
          checked={Checkboxes.includes(item.id)}
          onChange={() => CheckboxChange(item.id)}
        />
      </div>
      <div className='admin-table__second-element table-column__element'>
        <p className='admin-table__second-element--subtitle'>{item.data.caption}</p>
        <QuickAction onChange={handleSetEditMode} onDelete={onDelete} userId={item.id} type='quickEdit' isBulkUpload />
      </div>
      <div className='admin-table__second-element table-column__element'>
        <p>{item.user?.name || 'Unknown Author'}</p>
      </div>
      <div className='admin-table__second-element table-column__element'>
        <p className='table-column__status'>{item.data.schema || 'Unknown type'}</p>
      </div>
      <div className='admin-table__second-element table-column__element'>
        {editMode
          ? (
            <select
              className='admin-table__element-select'
              name='status'
              value={localEditData.status ? localEditData.status : item.status === null ? 'default' : TitleCapiralize(item.status)}
              onChange={(e) => OnChange(e, item.id, setLocalEditData)}
            >
              <option
                value={item.status}
                disabled
              >
                {item.status === null ? 'Unknown' : item.status}
              </option>
              <option
                value='default'
              >
                Unknown
              </option>
              {mockAdminBulkUploadDataStatus.map((item, index) => <option key={`${item} + ${index}`} value={item}>{item}</option>)}
            </select>
            )
          : (
            <p style={{ color: getColorForStatus(item.status) }}>{TitleCapiralize(item.status) || 'Unknown'}</p>
            )}
      </div>
      <div className='admin-table__second-element table-column__element'>
        <p>{item.data.total_views || '-'}</p>
      </div>
      <div className='admin-table__second-element table-column__element'>
        <p>{item.created_at.split(' ')[0] || '-'}</p>
      </div>
      <div className='admin-table__second-element table-column__element'>
        <a href='/' aria-label='watch entity graph' className='admin-table__second-element__link'>View<assets.EyeSVG width={16} height={16} /></a>
      </div>
    </div>
  )
}
