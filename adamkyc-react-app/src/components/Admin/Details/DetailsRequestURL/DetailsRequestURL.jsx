import { Select, Title } from 'components'
import { mockAdminStatusData } from 'helpers'
import assets from '../../../../assets/index'
import './DetailsRequestURL.style.scss'

export function DetailsRequestURL ({ data, OnChange, onSave, onDelete, statusValue }) {
  return (
    <div className='admin-request__wrapper'>
      <Title text='Requests URL' textClassname='hero-title__smaller' />
      <div className='admin-request__fields-wrapper'>
        <div className='admin-request__fields-wrapper--element'>
          <p className='admin-request__fields-wrapper__text'>Status</p>
          <Select data={mockAdminStatusData} type='status' value={statusValue} onChange={OnChange} Admin />
        </div>
        <div className='admin-request__fields-wrapper--element'>
          <p className='admin-request__fields-wrapper__text'>Type</p>
          <p className='admin-request__fields-wrapper__text admin-request__fields-wrapper__text--weight'>{data.entity_type}</p>
        </div>
        <div className='admin-request__fields-wrapper--element'>
          <p className='admin-request__fields-wrapper__text'>Created</p>
          <p className='admin-request__fields-wrapper__text admin-request__fields-wrapper__text--weight'>{data?.created_at.split(' ')[0]}</p>
        </div>
        <div className='admin-request__fields-wrapper--element'>
          <p className='admin-request__fields-wrapper__text'>IP Adress</p>
          <p className='admin-request__fields-wrapper__text admin-request__fields-wrapper__text--weight'>1.241.867.861:2222</p>
        </div>
      </div>
      <button type='button' aria-label='Button to save changed data' className='admin-request__button' onClick={onSave}>
        <assets.SaveSVG width={24} height={24} />Save
      </button>
      <button type='button' aria-label='Button to save changed data' className='admin-request__button' onClick={onDelete}>
        <assets.Trash width={16} height={16} />Move to trash
      </button>
    </div>
  )
}
