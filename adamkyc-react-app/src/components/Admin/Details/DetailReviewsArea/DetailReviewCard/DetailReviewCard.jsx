import { useEffect, useState } from 'react'
import { QuickAction } from 'components'
import './DetailReviewCard.style.scss'

export function DetailReviewCard ({ data, editData, updatedEditData, OnChange, isChanged, onSave, onDelete }) {
  const [editMode, setEditMode] = useState(false)

  function handleSetEditMode () {
    setEditMode(!editMode)
  }

  useEffect(() => {
    if (isChanged === true) setEditMode(false)
  }, [isChanged])

  return (
    <div className='admin-review__card'>
      <div className='admin-review__card--header'>
        <div
          className='admin-review__card--avatar' style={{
            backgroundImage: `url(${data.user.avatar})`,
            backgroundSize: 'cover'
          }}
        />
        <p className='admin-review__card__subtitle'>{data.user.name}</p>
        <p className='admin-review__card__subtitle--created'>created on {data.created_at || 'Unknown'}</p>
        <QuickAction type='detailEdit' userId={data.id} onChange={handleSetEditMode} onDelete={onDelete} />
      </div>
      <div className='admin-review__card--body'>
        <div style={editMode ? { width: '770px' } : {}}>
          {editMode
            ? (
              <input
                name='subject'
                placeholder={data.subject}
                value={editData.subject === '' ? updatedEditData.subject : editData.subject}
                onChange={(e) => OnChange(e, data.id)}
                className='admin-review__card__subtitle admin-review__card-input'
              />
              )
            : (
              <p className='admin-review__card__subtitle'>{data.subject}</p>
              )}
        </div>
        <div style={editMode ? { width: '770px' } : {}}>
          {editMode
            ? (
              <textarea
                name='note'
                rows={6}
                placeholder={data.note}
                value={editData.note === '' ? updatedEditData.note : editData.note}
                onChange={(e) => OnChange(e, data.id)}
                className='admin-review__card__subtitle--textarea admin-review__card__subtitle--textarea--enabled'
              />
              )
            : (
              <p className='admin-review__card__subtitle--textarea'>{data.note}</p>
              )}
        </div>
        {editMode && (
          <button
            type='button'
            aria-label='button for saving changed data'
            className='admin-review__card-button'
            onClick={(e) => onSave(e, data.id)}
          >
            Update
          </button>
        )}
      </div>
    </div>
  )
}
