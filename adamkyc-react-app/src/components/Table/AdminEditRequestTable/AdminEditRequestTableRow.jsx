import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { TitleCapiralize, mockAdminStatusData } from 'helpers'
import { QuickAction } from 'components'

export function TableRow ({ item, index, editData, OnChange, onDelete, onSave, isChanged, isSaved, CheckboxChange, CleanCheckboxes, Checkboxes, startEditMode }) {
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
      case 'REVIEWING':
        return '#DA881E'
      case 'APPROVED':
        return '#14B550'
      case 'DENIED':
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
      <div className='admin-table__element table-column__element'>
        <input
          type='checkbox'
          id={'checkbox' + (item.id)}
          checked={Checkboxes.includes(item.id)}
          onChange={() => CheckboxChange(item.id)}
        />
      </div>
      <div className='admin-table__element table-column__element'>
        <Link to={`/entity/${item.entity_id}`} className='admin-table__element-link'>{item.entity_name}</Link>
        <QuickAction onChange={handleSetEditMode} onDelete={onDelete} userId={item.id} type='quickEdit' />
      </div>
      <div className='admin-table__element table-column__element'>
        <p className='table-column__status'>{item.email}</p>
      </div>
      <div className='admin-table__element table-column__element'>
        <p>{item.entity_type || 'Any'}</p>
      </div>
      <div className='admin-table__element table-column__element'>
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
              {mockAdminStatusData.map((statusItem, index) =>
                <option
                  key={`${item} + ${index}`}
                  value={statusItem}
                >
                  {statusItem}
                </option>)}
            </select>
            )
          : (
            <p style={{ color: getColorForStatus(item.status) }}>{item.status ? TitleCapiralize(item.status) : 'Unknown'}</p>
            )}
      </div>
      <div className='admin-table__element table-column__element'>
        <p>{item.created_at.split(' ')[0]}</p>
      </div>
    </div>
  )
}
