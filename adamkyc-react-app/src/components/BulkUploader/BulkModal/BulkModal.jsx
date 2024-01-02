import { Link } from 'react-router-dom'
import { Button } from 'components'
import robotSuccess from '../../../assets/image/robot-success.png'
import robotSuccess2x from '../../../assets/image/robot-success@2x.png'
import assets from '../../../assets/index'

export function BulkModal ({ isAdmin }) {
  return (
    <div className='backdrop-container'>
      <div className='backdrop-container__content-wrapper'>
        <picture>
          <source srcSet={robotSuccess2x} media='(min-width: 1440px)' />
          <img
            srcSet={robotSuccess}
            alt='robot says download success'
            className='hero-container__image'
            width={300}
            height={340}
          />
        </picture>
        <div className='backdrop-container__text-wrapper'>
          <assets.CheckCircleSVG
            width={32}
            height={32}
            className='backdrop-container__icon'
            aria-label='check svg'
            title='checked svg'
          />
          <h2 className='backdrop-container__title'>Uploaded Successfully</h2>
        </div>
        <Button
          as={Link}
          to={isAdmin ? 'history' : '/bulk-upload/data'}
          type='advancedSearch'
          text='All Data Uploaded'
          ariaLabel='button for closing modal menu'
          className={`btn-search ${isAdmin ? 'padding-12-24' : 'padding-16-24'}`}
        />
      </div>
    </div>
  )
}
