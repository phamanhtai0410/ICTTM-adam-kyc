import { Link } from 'react-router-dom'
import { Button } from 'components'
import './Bulk.style.scss'

export function Bulk () {
  return (
    <div className='bulk-uploader'>
      <div className='bulk-header__section'>
        <h2 className='recentsearch-title'>Bulk Upload</h2>
        <p className='bulk-subtitle'>Do you want to search with multiple data fields? Use our Bulk Data Upload and enjoy the results.</p>
        <Button
          as={Link}
          to='/bulk-upload'
          type='advancedSearch'
          text='Up your file now'
          ariaLabel='button for uploading file to the site'
          className='btn-search padding-8-12 border-black'
        />
      </div>
    </div>
  )
}
