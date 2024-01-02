import assets from '../../assets/index'
import './BulkCategorySelector.style.scss'

export function BulkCategorySelector ({ onChange, activeButton, isUploadPage }) {
  return (
    <ul
      className='bulk-category__list'
      style={isUploadPage ? { flexDirection: 'row', flexWrap: 'wrap' } : {}}
    >
      <li className='bulk-category__item' style={isUploadPage ? { width: '285px', height: '160px', flex: 'none' } : {}}>
        <button
          type='button'
          className={`bulk-category__button ${activeButton === 'Address' ? 'bulk-category__active' : ''}`}
          onClick={_ => onChange('Address')}
          style={isUploadPage ? { height: '100%' } : {}}
        >
          <assets.AddressSVG
            width={64}
            height={64}
            className='bulk-category__icon'
          />
          <p className='bulk-category__button-text'>{isUploadPage ? 'Address Search Fields' : 'Address'}</p>
        </button>
      </li>
      <li className='bulk-category__item' style={isUploadPage ? { width: '285px', height: '160px', flex: 'none' } : {}}>
        <button
          type='button'
          className={`bulk-category__button ${activeButton === 'Vessels' ? 'bulk-category__active' : ''}`}
          onClick={_ => onChange('Vessels')}
          style={isUploadPage ? { height: '100%' } : {}}
        >
          <assets.VesselSVG
            width={64}
            height={64}
            className='bulk-category__icon'
          />
          <p className='bulk-category__button-text'>{isUploadPage ? 'Vessels Search Fields' : 'Vessels'}</p>
        </button>
      </li>
      <li className='bulk-category__item' style={isUploadPage ? { width: '285px', height: '160px', flex: 'none' } : {}}>
        <button
          type='button'
          className={`bulk-category__button ${activeButton === 'Bank Account' ? 'bulk-category__active' : ''}`}
          onClick={_ => onChange('Bank Account')}
          style={isUploadPage ? { height: '100%' } : {}}
        >
          <assets.BankSVG
            width={64}
            height={64}
            className='bulk-category__icon'
          />
          <p className='bulk-category__button-text'>{isUploadPage ? 'Bank Account Search Fields' : 'Bank Account'}</p>
        </button>
      </li>
      <li className='bulk-category__item' style={isUploadPage ? { width: '285px', height: '160px', flex: 'none' } : {}}>
        <button
          type='button'
          className={`bulk-category__button ${activeButton === 'Company' ? 'bulk-category__active' : ''}`}
          onClick={_ => onChange('Company')}
          style={isUploadPage ? { height: '100%' } : {}}
        >
          <assets.CompanySVG
            width={64}
            height={64}
            className='bulk-category__icon'
          />
          <p className=''>{isUploadPage ? 'Company, Organization Or Legal Entity Search Fields' : 'Company, Organization'}</p>
        </button>
      </li>
      <li className='bulk-category__item' style={isUploadPage ? { width: '285px', height: '160px', flex: 'none' } : {}}>
        <button
          type='button'
          className={`bulk-category__button ${activeButton === 'Crypto' ? 'bulk-category__active' : ''}`}
          onClick={_ => onChange('Crypto')}
          style={isUploadPage ? { height: '100%' } : {}}
        >
          <assets.WalletSVG
            width={64}
            height={64}
            className='bulk-category__icon'
          />
          <p className='bulk-category__button-text'>{isUploadPage ? 'Crypto Wallet Search Fields' : 'Crypto Wallet'}</p>
        </button>
      </li>
      <li className='bulk-category__item' style={isUploadPage ? { width: '285px', height: '160px', flex: 'none' } : {}}>
        <button
          type='button'
          className={`bulk-category__button ${activeButton === 'Person' ? 'bulk-category__active' : ''}`}
          onClick={_ => onChange('Person')}
          style={isUploadPage ? { height: '100%' } : {}}
        >
          <assets.PersonSVG
            width={64}
            height={64}
            className='bulk-category__icon'
          />
          <p className='bulk-category__button-text'>{isUploadPage ? 'Person Search Fields' : 'Person'}</p>
        </button>
      </li>
      <li className='bulk-category__item' style={isUploadPage ? { width: '285px', height: '160px', flex: 'none' } : {}}>
        <button
          type='button'
          className={`bulk-category__button ${activeButton === 'Security' ? 'bulk-category__active' : ''}`}
          onClick={_ => onChange('Security')}
          style={isUploadPage ? { height: '100%' } : {}}
        >
          <assets.SecuritySVG
            width={64}
            height={64}
            className='bulk-category__icon'
          />
          <p className='bulk-category__button-text'>{isUploadPage ? 'Security Search Fields' : 'Security'}</p>
        </button>
      </li>
    </ul>
  )
}
