import { Link } from 'react-router-dom'
import { Button } from 'components'
import assets from '../../assets/index'
import './BulkUploadHistory.style.scss'

export function BulkUploadedHistory () {
  return (
    <div className='bulk-uploaded'>
      <assets.HistorySVG
        width={64}
        height={64}
      />
      <h2 className='bulk-uploaded__title'>Check Uploaded History</h2>
      <Button
        as={Link}
        to='/admin/bulk-upload/history'
        type='advancedSearch'
        text='Uploaded History'
        ariaLabel='button for closing modal menu'
        className='btn-search padding-12-24'
      />
    </div>
  )
}
