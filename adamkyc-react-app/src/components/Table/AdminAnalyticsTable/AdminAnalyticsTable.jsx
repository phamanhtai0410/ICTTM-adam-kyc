import { mockAdminAnalyticsTable } from 'helpers'
import './AdminAnalyticsTable.style.scss'

export function AdminAnalyticsTable () {
  return (
    <div className='table-wrapper'>
      <div className='table-column'>
        <div className='admin-analytics__table-element table-column__element table-column__element--title'>
          <p>User Name</p>
        </div>
        <div className='admin-analytics__table-element table-column__element table-column__element--title'>
          <p>Type</p>
        </div>
        <div className='admin-analytics__table-element table-column__element table-column__element--title'>
          <p>IP Address</p>
        </div>
        <div className='admin-analytics__table-element table-column__element table-column__element--title'>
          <p>Date</p>
        </div>
        <div className='admin-analytics__table-element table-column__element table-column__element--title'>
          <p>Time</p>
        </div>
      </div>
      {mockAdminAnalyticsTable.map((item, index) => {
        return (
          <div className='admin-table table-column' key={index}>
            <div className='admin-analytics__table-element table-column__element'>
              <div className='admin-analytics__table-avatar' />
              <p className='table-column__status'>{item.name}</p>
            </div>
            <div className='admin-analytics__table-element table-column__element'>
              <p className='table-column__status'>{item.type}</p>
            </div>
            <div className='admin-analytics__table-element table-column__element'>
              <p className='table-column__status'>{item.ip_address}</p>
            </div>
            <div className='admin-analytics__table-element table-column__element'>
              <p className='table-column__status'>{item.date}</p>
            </div>
            <div className='admin-analytics__table-element table-column__element'>
              <p className='table-column__status'>{item.time}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
