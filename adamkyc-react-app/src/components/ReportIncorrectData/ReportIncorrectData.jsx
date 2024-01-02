import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import assets from '../../assets/index'

export function ReportIncorrectData ({ id }) {
  const location = useLocation()

  return (
    <Link
      to={`/report/${id}`}
      state={{ from: location }}
      aria-label='Link to report the incorrect data'
      className='bods-link'
    >
      <assets.AlertSVG width={24} height={24} title='report' className='bods-link__icon' />
      <p className='bods-link__subtext'>Report Incorrect Data</p>
    </Link>
  )
}
