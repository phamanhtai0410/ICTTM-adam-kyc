import assets from '../../assets/index'
import { generatePath } from 'react-router'

export function ShareButton ({ type, displayAlert, elementId }) {
  let content

  async function handleShareClick () {
    const currentUrl = window.location.href.split('#')[0] + '#' + generatePath('/entity/:id', { id: elementId })
    await navigator.clipboard.writeText(currentUrl)
    displayAlert('Link added to your clipboard: ' + currentUrl)
  }

  switch (type) {
    case 'detailsHeader':
      content = (
        <assets.ShareSVG
          className='person-details__icons-wrapper__container-icon'
          width={16}
          height={16}
          onClick={() => handleShareClick()}
          title='Share'
        />
      )
      break
    case 'personCard':
      content = (
        <div className='search-item__icons-wrapper'>
          <assets.ShareSVG
            width={16}
            height={16}
            className='search-item__icon'
            onClick={() => handleShareClick()}
          />
        </div>
      )
      break
    default:
      break
  }

  return content
}
