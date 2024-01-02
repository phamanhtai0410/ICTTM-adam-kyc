import { TitleWithTooltip, LineChartGraph } from 'components'
import assets from '../../../../../assets/index'
import './AnalyticsCompareGraph.style.scss'

export function AnalyticsCompareGraph ({ title, toolTipTitle, percentage, count }) {
  return (
    <div className='admin-analytics__graph'>
      <div className='admin-analytics__graph-header'>
        <TitleWithTooltip title={toolTipTitle} />
      </div>
      <div className='admin-analytics__graph-body'>
        <div className='admin-analytics__graph-body__data'>
          <p className='admin-analytics__graph-body__data-subtitle'>{title}</p>
          <span className={count > 0 ? 'admin-analytics__graph-body__data-span admin-analytics__graph-body__data-span--success' : 'admin-analytics__graph-body__data-span admin-analytics__graph-body__data-span--error'}>
            {count > 0
              ? (
                <>
                  <assets.TrendingUpSVG width={16} height={16} />
                  <p>{percentage}</p>
                </>
                )
              : (
                <>
                  <assets.TrendingDownSVG width={16} height={16} />
                  <p>{percentage}</p>
                </>
                )}
          </span>
        </div>
        <div className='admin-analytics__graph-body__graph-wrapper'>
          <LineChartGraph count={count} />
        </div>
      </div>
      <div className='admin-analytics__graph-footer'>
        <p className='admin-analytics__graph-footer--subtitle'>Compare to last month</p>
      </div>
    </div>
  )
}
