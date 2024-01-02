import { TitleCapiralize } from 'helpers'
import assets from '../../../assets/index'
import './AdminBulkUploadedTable.style.scss'

export function AdminBulkUploadedTable ({ serverData, onClick }) {
  return (
    <div>
      <div className='table-wrapper'>
        <div className='table-column'>
          <div className='table-column__element--title admin-table__column'>
            <p>Type Upload</p>
          </div>
          <div className='table-column__element--title admin-table__column'>
            <p>Author</p>
          </div>
          <div className='table-column__element--title admin-table__column'>
            <p>Number of rows</p>
          </div>
          <div className='table-column__element--title admin-table__column'>
            <p>Date</p>
          </div>
          <div className='table-column__element--title admin-table__column'>
            <p>Time</p>
          </div>
          <div className='table-column__element--title admin-table__column'>
            <p>Status</p>
          </div>
          <div className='table-column__element--title admin-table__column'>
            <p>Delete</p>
          </div>
        </div>
        {serverData?.map((item, index) => {
          return (
            <div className='table-column' key={`${item} ${index}`}>
              <div className='table-column__element admin-table__column'><p>{item.type || 'Unknown type'}</p></div>
              <div className='table-column__element admin-table__column'><p>{item.name || 'Unknown name'}</p></div>
              <div className='table-column__element admin-table__column'><p>{item.count_rows || '-'}</p></div>
              <div className='table-column__element admin-table__column'><p>{item.created_at.split(' ')[0] || '-'}</p></div>
              <div className='table-column__element admin-table__column'><p>{item.created_at.split(' ')[1] || '-'}</p></div>
              <div className='table-column__element admin-table__column'><p>{item.status ? TitleCapiralize(item.status) : 'Unknown status'}</p></div>
              <div className='admin-table__column table-column__element'>
                <button
                  type='button'
                  aria-label='button for deleting admin upload item'
                  title='Delete item'
                  onClick={() => onClick(item.id)}
                  className='admin-table__button'
                >
                  <a
                    className='table-column__link  table-column__link--error'
                  >
                    <assets.Trash width={16} height={16} /> Delete all uploaded data
                  </a>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
