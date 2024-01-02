import { useState } from 'react'
import { createPortal } from 'react-dom'
import { CustomAlert } from 'components'
import assets from '../../assets/index'
import '../Bulk/Bulk.style.scss'
import './TitleWithTooltip.style.scss'

export function TitleWithTooltip ({ title, isDetailsPage, isAnalytics }) {
  const [showAlert, setShowAlert] = useState(false)

  function displayAlert () {
    setShowAlert(true)

    setTimeout(() => {
      setShowAlert(false)
    }, 5000)
  }

  return (
    <div className='bulk-header__container'>
      <h2 className={isDetailsPage ? 'bulk-title__details-page' : isAnalytics ? 'hint-title' : 'bulk-title'}>{title}</h2>
      <button type='button' aria-label='hint button, to download file' className='bulk-header__hint'>
        <assets.Hint
          width={14}
          height={14}
        />
        <div className='hint-container'>
          <div className='hint-container__content-wrapper'>
            <p className='hint-text'>Search with whatever information field you have. Upload your CSV file. Please
              <a
                href={`${window.adamkyc_plugin_prefix}example.xlsx`}
                aria-label='Link to download example file'
                download
                className='tooltip-link'
              >
                <span onClick={() => displayAlert()} className='hint-text hint-text__underline'>download the CSV sample here.</span>
              </a>
            </p>
            <assets.Polygon
              width={16}
              height={10.82}
              className='hint-polygon'
            />
          </div>
        </div>
      </button>
      {/* todo replace with AlertProvider? */}
      {showAlert && (
        createPortal(
          <CustomAlert message='File sended' className={`custom-alert ${showAlert ? '' : 'hide'}`} />,
          document.querySelector('#root')
        )
      )}
    </div>
  )
}
