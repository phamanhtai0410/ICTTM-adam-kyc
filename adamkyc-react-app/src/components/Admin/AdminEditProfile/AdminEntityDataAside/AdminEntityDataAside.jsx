import { useParams } from 'react-router'
import { Select, AdminEntityPreview, AdminAsideButton } from 'components'
import { AdminEntityTypeArray, entityCreateDisplayOption, mockAdminBulkUploadDataStatus } from 'helpers'
import './AdminEntityDataAside.style.scss'

export function AdminEntityDataAside ({ statusSelectValue, displaySelectValue, onChange, onSave, onBuild, onDelete, entityType, onChangeEntityType, entityObjectAside }) {
  const { id } = useParams()

  return (
    <div className='admin-entity__data-aside__wrapper'>
      <div className='admin-entity__data-aside__column-wrapper'>
        <p className='admin-entity__data-aside__header-wrapper__subtitle'>Data</p>
        <AdminEntityPreview />
      </div>
      <div className='admin-entity__data-aside__column-wrapper'>
        <p className='admin-request__fields-wrapper__text admin-entity__data-aside__column-wrapper--subtitle-width'>Total views</p>
        <p className='admin-request__fields-wrapper__text admin-request__fields-wrapper__text--weight admin-entity__data-aside__column-wrapper--subtitle-width'>{entityObjectAside?.views ?? 'Unknown views'}</p>
      </div>
      <div className='admin-entity__data-aside__column-wrapper'>
        <p className='admin-request__fields-wrapper__text admin-entity__data-aside__column-wrapper--subtitle-width'>Status</p>
        <Select
          data={mockAdminBulkUploadDataStatus}
          type='status'
          value={statusSelectValue}
          onChange={(e) => onChange(e, 'status')}
          Admin
        />
      </div>
      <div className='admin-entity__data-aside__column-wrapper'>
        <p className='admin-request__fields-wrapper__text admin-entity__data-aside__column-wrapper--subtitle-width'>Type</p>
        {id === 'create'
          ? (
            <Select
              data={AdminEntityTypeArray}
              value={entityType}
              onChange={(e) => onChangeEntityType(e)}
              Admin
            />
            )
          : (
            <p className='admin-request__fields-wrapper__text admin-request__fields-wrapper__text--weight admin-entity__data-aside__column-wrapper--subtitle-width'>{entityObjectAside?.schema || 'Unknown type'}</p>
            )}
      </div>
      <div className='admin-entity__data-aside__column-wrapper'>
        <p className='admin-request__fields-wrapper__text admin-entity__data-aside__column-wrapper--subtitle-width'>Display</p>
        <Select
          data={entityCreateDisplayOption}
          type='display'
          value={displaySelectValue}
          onChange={(e) => onChange(e, 'display')}
          Admin
        />
      </div>
      <div className='admin-entity__data-aside__column-wrapper'>
        <p className='admin-request__fields-wrapper__text admin-entity__data-aside__column-wrapper--subtitle-width'>Author</p>
        <p className='admin-request__fields-wrapper__text admin-request__fields-wrapper__text--weight admin-entity__data-aside__column-wrapper--subtitle-width'>{entityObjectAside?.author || 'Unknown author'}</p>
      </div>
      <div className='admin-entity__data-aside__column-wrapper'>
        <p className='admin-request__fields-wrapper__text admin-entity__data-aside__column-wrapper--subtitle-width'>Create/Uploaded</p>
        <p className='admin-request__fields-wrapper__text admin-request__fields-wrapper__text--weight admin-entity__data-aside__column-wrapper--subtitle-width'>{entityObjectAside?.updated_at ? entityObjectAside?.updated_at.split(' ')[0] : entityObjectAside?.created_at.split(' ')[0]}</p>
      </div>
      <AdminAsideButton
        ariaLabel='Button for saving editing data'
        svg='save'
        text='Save'
        title='Save button'
        onClick={onSave}
      />
      <AdminAsideButton
        ariaLabel='Button for deleting editing data'
        svg='trash'
        text='Move to trash'
        title='Delete button'
        onClick={onDelete}
      />
    </div>
  )
}
