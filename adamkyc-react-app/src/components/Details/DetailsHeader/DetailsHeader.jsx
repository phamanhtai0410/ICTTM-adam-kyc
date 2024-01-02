import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CustomAlert, ShareButton } from 'components'
import { formatSchema, handleScrollTo } from 'helpers'
import { addOrDeleteBookmark } from 'api/requests'
import assets from '../../../assets/index'
import './DetailsHeader.style.scss'
import html2canvas from 'html2canvas'
import { jsPDF } from "jspdf"
export function DetailsHeader ({ data, serverData, sanction }) {
  const FlagSVG = assets.flags[serverData?.[0]?.properties.Country?.[0]] ?? assets.GlobeSVG
  const [showAlert, setShowAlert] = useState(false)
  const [alertTimer, setAlertTimer] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(serverData?.[0]?.bookmarked)
  const [messageAlert, setMessageAlert] = useState('')

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

  function printDocument() {
    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("entity1.pdf");
      })
    ;
  }

  async function handleAddOrDeleteBookmark () {
    try {
      await addOrDeleteBookmark(serverData[0].id)
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

  useEffect(() => {
    return () => {
      if (alertTimer !== null) {
        clearTimeout(alertTimer)
      }
    }
  }, [])

  useEffect(() => {
    setIsBookmarked(serverData?.[0].bookmarked)
  }, [serverData])

  return (
    serverData?.[0] && (
      <div className='person-details__header-container'>
        <div className='person-details__header'>
          <div>
            <FlagSVG
              width={72}
              height={48}
              className='person-details__header-icon'
            />
          </div>
          <div className='person-details__header-wrapper'>
            <p>{data.date}</p>
            <div className='person-details__icons-wrapper'>
              <div className="mb5">
                <button onClick={printDocument}>Print this page to PDF</button>
              </div>
              <div className='person-details__icons-wrapper__container'>
                <ShareButton
                  type='detailsHeader'
                  elementId={serverData?.[0].id}
                  displayAlert={displayAlert}
                />
              </div>
              <a
                title='Download information'
                className='person-details__icons-wrapper__container'
                href={`${process.env.REACT_APP_API_ENDPOINT}/download/${serverData?.[0]?.id}`}
                download
                aria-label='Link to download BODS file'
              >
                <assets.DownloadSVG
                  className='person-details__icons-wrapper__container-icon'
                  width={16}
                  height={16}
                  title='Download information'
                />
              </a>
              <div className={isBookmarked ? 'person-details__icons-wrapper__container person-details__icons-wrapper__container--reversed' : 'person-details__icons-wrapper__container'} onClick={() => isBookmarked ? handleBookmarkClick(true) : handleBookmarkClick(false)}>
                <assets.BookmarkSVG
                  className='person-details__icons-wrapper__container-icon'
                  width={16}
                  height={16}
                  title='Bookmark'
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
        </div>
        <div className='person-details__header-wrapper__title'>
          <p className='person-details__header-wrapper__title-subtext'>{formatSchema(serverData?.[0]?.schema)}</p>
          <h1 className='person-details__header-wrapper__title-title'>{serverData?.[0]?.caption}</h1>
        </div>
        <div className='person-details__header-wrapper__tag'>
          {serverData?.[0]?.properties.Topics.map((item) => {
            return (
              <span className='person-details__header-wrapper__tag-item' key={item}>
                <p className='person-details__header-wrapper__tag-subtext'>{item}</p>
              </span>
            )
          })}
        </div>
        <div className='person-details__header-wrapper__description'>
          {sanction === undefined
            ? (
              <p className='person-details__header-wrapper__description-subtext'>{serverData?.[0]?.caption} have not been found on international sanctions lists.</p>
              )
            : (
              <p className='person-details__header-wrapper__description-subtext'>{serverData?.[0]?.caption} is subject to sanctions. See <a onClick={() => handleScrollTo('Data Sources')} className='person-details__header-wrapper__description-link person-details__header-wrapper__description-subtext'>the individual program listings</a> below.</p>
              )}
        </div>
      </div>
    )
  )
}
