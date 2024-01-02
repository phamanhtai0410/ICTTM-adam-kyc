import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router'
import assets from '../../../assets/index'
import '../../../pages/DataUploadResultsPage/DataUploadResultsPage.style.scss'
import './AdminButton.style.scss'

export function AdminButton ({ onClick, svgPath, ariaLabel, className, text, disabled, isLink }) {
  const ImportedSVG = assets[svgPath]
  const navigate = useNavigate()
  const location = useLocation()

  const handleLinkClick = () => {
    navigate('/admin/entity/create', { state: { from: location } })
  }

  return (
    <button
      type='button'
      // onClick={(e) => onClick(e)}
      onClick={isLink ? handleLinkClick : (e) => onClick(e)}
      aria-label={ariaLabel}
      className={`button ${className || ''}`}
      disabled={disabled}
    >
      {isLink
        ? (
          <Link
            to='/admin/entity/create'
            state={{ from: location }}
            aria-label='Link to create entity page'
            className='button--inner-link'
          >
            <ImportedSVG width={16} height={16} /> {text}
          </Link>
          )
        : (
          <>
            <ImportedSVG width={16} height={16} /> {text}
          </>
          )}
    </button>
  )
}
