import { useEffect } from 'react'
import { useModal } from 'providers'
import { DetailsModalTable } from 'components'
import assets from '../../../../../assets/index'
import './DetailsModal.style.scss'

export function DetailsModal ({ data, type }) {
  const { toggleModal, isModalOpen } = useModal()

  function handleBackdropClick (e) {
    if (e.target.classList.contains('backdrop-container')) {
      toggleModal()
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isModalOpen])

  return (
    <div className='backdrop-container' onClick={handleBackdropClick}>
      <div className='backdrop-container__modal-wrapper'>
        <div className='backdrop-container__header-wrapper'>
          <h2 className='backdrop-container__title'>{data?.schema}</h2>
          <button
            type='button'
            className='backdrop-container__header-wrapper__button'
            title='Close window'
            aria-label='button for close modal window'
            onClick={() => toggleModal()}
          >
            <assets.Close width={30} height={30} />
          </button>
        </div>
        <div className='backdrop-container__body-wrapper'>
          <DetailsModalTable data={data} type={type} />
        </div>
      </div>
    </div>
  )
}
