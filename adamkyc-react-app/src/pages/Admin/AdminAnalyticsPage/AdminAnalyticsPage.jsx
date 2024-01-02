import { useState } from 'react'
import { getTodayAndTomorrow, mockAdminAnalyticsSortByYear, mockAdminStatusData } from 'helpers'
import { AdminAnalyticsTable, AnalyticsCompareGraph, DateFilter, MainLineChartGraph, Sort, TitleWithTooltip } from 'components'
import './AdminAnalyticsPage.style.scss'

function AdminAnalyticsPage () {
  const dates = getTodayAndTomorrow()

  const [dateData, setDateData] = useState({ // eslint-disable-line
    after: dates.today,
    before: dates.tomorrow
  })

  return (
    <section aria-label='bulk uploader section' className='padding-top'>
      <div className='container no-flex no-padding__top-bottom'>
        <div className='flex__space-between'>
          <h1 className='data-uploader__title'>Analytics</h1>
          <Sort
            text='This Year'
            array={mockAdminAnalyticsSortByYear}
            className='sort--admin-analytics'
          />
        </div>
        <div className='admin-analytics__graphs'>
          <AnalyticsCompareGraph title='123.988' toolTipTitle='Basic Search' percentage='20,1%' count={1} />
          <AnalyticsCompareGraph title='53.986' toolTipTitle='Advanced Search' percentage='50,5%' count={1} />
          <AnalyticsCompareGraph title='25' toolTipTitle='Total no result' percentage='10,5%' count={0} />
          <AnalyticsCompareGraph title='132' toolTipTitle='Total Request Edit' percentage='35,5%' count={0} />
        </div>
        <div className='admin-analytics__main-graph'>
          <div className='admin-analytics__main-graph__text-wrapper'>
            <p className='admin-analytics__main-graph__subtitle'>Total Search in 2023</p>
            <p className='admin-analytics__main-graph__search-subtitle'>177,974 searches</p>
          </div>
          <div className='admin-analytics__main-graph--wrapper'>
            <MainLineChartGraph />
          </div>
        </div>
        <div className='admin-analytics__history-table'>
          <TitleWithTooltip title='Statistics User History' isAnalytics />
          <div className='admin-analytics__history-table__sort'>
            <Sort
              text='Search Type'
              array={mockAdminStatusData}
              className='sort--admin-uploaded'
            />
            <DateFilter
              data={dateData}
              isAdmin
            />
          </div>
          <div>
            <AdminAnalyticsTable />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminAnalyticsPage
