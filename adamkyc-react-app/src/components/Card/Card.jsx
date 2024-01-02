import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { allCountriesList, formatDate, formatSchema } from 'helpers'
import { Link } from 'react-router-dom'
import { addOrDeleteBookmark } from 'api/requests'
import { CustomAlert, ShareButton } from 'components'
import assets from '../../assets/index'
import './Card.style.scss'

export function Card ({ layer, dataArray }) {
  const [showAlert, setShowAlert] = useState(false)
  const [alertTimer, setAlertTimer] = useState(null)
  const [messageAlert, setMessageAlert] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const FlagSVG = assets.flags[dataArray?.properties?.country?.[0]] ?? assets.GlobeSVG

  if (!layer) layer = 'grid'

  function displayAlert (message) {
    setMessageAlert(message)
    setShowAlert(true)

    if (alertTimer !== null) {
      clearTimeout(alertTimer)
    }

    const timer = setTimeout(() => {
      setShowAlert(false)
    }, 3000)

    setAlertTimer(timer)
  }

  useEffect(() => {
    return () => {
      if (alertTimer !== null) {
        clearTimeout(alertTimer)
      }
    }
  }, [])

  useEffect(() => {
    if (dataArray.bookmarked === true) setIsBookmarked(!isBookmarked)
  }, [])

  async function handleAddOrDeleteBookmark () {
    try {
      await addOrDeleteBookmark(dataArray.id)
      setIsBookmarked(!isBookmarked)
    } catch (err) {
      console.error(err)
    }
  }

  function handleBookmarkClick (type) {
    if (type === true) {
      displayAlert('Removed from Bookmarks')
      handleAddOrDeleteBookmark()
    }

    if (type === false) {
      displayAlert('Added to Bookmarks')
      handleAddOrDeleteBookmark()
    }
  }

  return (
    <li className={layer === 'grid' ? 'search-list__item' : 'main-wrapper'}>
      <div className='search-list__item-header'>
        <div className='search-list__item-subtitle-wrapper'>
          <p className='search-list__item-subtitle'>{formatDate(dataArray?.last_change, true)}</p>
        </div>
        <div className='search-item__icons'>
          <ShareButton
            type='personCard'
            elementId={dataArray.id}
            displayAlert={displayAlert}
          />
          <div className={isBookmarked ? 'search-item__icons-wrapper__reversed' : 'search-item__icons-wrapper'}>
            <assets.BookmarkSVG
              width={16}
              height={16}
              className='search-item__icon'
              onClick={() => isBookmarked ? handleBookmarkClick(true) : handleBookmarkClick(false)}
            />
          </div>
          {/* todo replace with AlertProvider? */}
          {showAlert && (
            createPortal(
              <CustomAlert message={messageAlert} className={`custom-alert ${showAlert ? '' : 'hide'}`} />,
              document.querySelector('#root')
            )
          )}
        </div>
      </div>
      <div className={layer === 'grid' ? '' : 'search-list__grid-container'}>
        <div className={layer === 'grid' ? '' : 'search-list__item-body'}>
          <div className='search-item__name-wrapper'>
            <p className='search-item__name-subtext filter-subtext'>{formatSchema(dataArray?.schema)}</p>
            <h2
              className='search-item__name-title'
              style={layer === 'grid' ? { textOverflow: 'ellipsis', overflow: 'hidden' } : { whiteSpace: 'wrap' }}
            >
              {dataArray?.caption}
            </h2>
          </div>
          <ul className='search-item__tags-list'>
            {dataArray.properties.topics?.length > 4
              ? (
                <>
                  {dataArray?.properties.topics?.slice(0, 4).map((tag, tagIndex) => (
                    <li className='search-item__tags-item' key={`tag-${tag}-${tagIndex}`}>
                      <p className='search-item__tag search-item__name-subtext filter-subtext'>
                        {tag}
                      </p>
                    </li>
                  ))}
                  <li className='search-item__tags-item search-item__tags-item__more'>
                    <p className='search-item__tag search-item__name-subtext filter-subtext'>
                      +{dataArray.properties.topics.length - 4} More
                    </p>
                  </li>
                </>
                )
              : (
                  dataArray.properties.topics?.map((tag, tagIndex) => (
                    <li className='search-item__tags-item' key={`tag-${tag}-${tagIndex}`}>
                      <p className='search-item__tag search-item__name-subtext filter-subtext'>
                        {tag}
                      </p>
                    </li>
                  ))
                )}
          </ul>
        </div>
        <div className={layer === 'grid' ? 'search-item__user-info__wrapper' : 'search-item__user-info__wrapper no-margin'}>
          <div className='search-item__flex'>
            <FlagSVG
              width={16}
              height={16}
              className='search-item__flex-icon'
            />
            <p className='filter-subtext'>
              {(dataArray?.properties.country && allCountriesList.find((item) => item.code.toLowerCase() === dataArray.properties.country[0])?.name) || 'Unknown'}
            </p>
          </div>
          {dataArray?.properties.birthDate?.[0] && (
            <div className='search-item__flex' key={dataArray.properties.birthDate}>
              <assets.CalendarSVG width={16} height={16} className='search-item__flex-icon' />
              <p className='filter-subtext'>{formatDate(dataArray.properties.birthDate[0])}
              </p>
            </div>
          )}
          {dataArray?.properties.birthPlace?.[0] && (
            <div className='search-item__flex' key={dataArray.properties.birthPlace}>
              <assets.MapSVG width={16} height={16} className='search-item__flex-icon' />
              <p className='filter-subtext'>{dataArray.properties.birthPlace[0]}</p>
            </div>
          )}
          {dataArray?.properties.serialNumber?.[0] && (
            <div className='search-item__flex' key={dataArray?.properties.serialNumber[0]}>
              <assets.CalendarSVG width={16} height={16} className='search-item__flex-icon' />
              <p className='filter-subtext'>{dataArray?.properties.serialNumber[0]}</p>
            </div>
          )}
          {dataArray?.properties.model?.[0] && (
            <div className='search-item__flex' key={dataArray?.properties.model[0]}>
              <assets.BusinessSVG width={16} height={16} className='search-item__flex-icon' />
              <p className='filter-subtext'>{dataArray?.properties.model[0]}</p>
            </div>
          )}
          {(dataArray?.properties.iban?.[0] || dataArray?.properties.isin?.[0]) && (
            <div className='search-item__flex' key={dataArray?.properties.iban?.[0] || dataArray?.properties.isin[0]}>
              <assets.BusinessSVG width={16} height={16} className='search-item__flex-icon' />
              <p className='filter-subtext'>{dataArray?.properties.iban?.[0] || dataArray?.properties.isin[0]}</p>
            </div>
          )}
          {dataArray?.properties.currency?.[0] && (
            <div className='search-item__flex' key={dataArray?.properties.currency[0]}>
              <assets.WalletSVG width={16} height={16} className='search-item__flex-icon' />
              <p className='filter-subtext'>{dataArray?.properties.currency[0]}</p>
            </div>
          )}
          {(dataArray?.properties.holder?.[0] || dataArray?.properties.issuer?.[0]) && (
            <div className='search-item__flex' key={dataArray?.properties.holder?.[0] || dataArray?.properties.issuer?.[0]}>
              <assets.UserSVG width={16} height={16} className='search-item__flex-icon' />
              <p className='filter-subtext'>{dataArray?.properties.holder?.[0] || dataArray?.properties.issuer?.[0]}</p>
            </div>
          )}
        </div>
        <div
          className={
           layer === 'grid'
             ? 'search-list__item-footer'
             : 'search-list__item-footer button-width'
           }
        >
          <Link
            to={`/entity/${dataArray.id}`}
            aria-label='button to get details about user'
            className='search-list__item-button filter-subtext '
          >
            Details{' '}
            <assets.ArrowRightRendered
              width={16}
              height={16}
              className='search-item__icons'
            />
          </Link>
        </div>
      </div>
    </li>
  )
}
