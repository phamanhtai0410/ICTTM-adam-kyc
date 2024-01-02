import { Link } from 'react-router-dom'
import { allCountriesList } from 'helpers'
import { DetailsModalButton } from '../Modal/DetailsModalButton/DetailsModalButton'
import assets from '../../../../assets/index'

export function DetailsPersonTable ({ data }) {
  return (
    <div className='person-details__relationship person-details__factsheet'>
      <div className='person-details__factsheet-column person-details__sanction-column'>
        <div className='person-details__relationship-column__hint'><p className='person-details__media-column__subtext'>Wallet holder</p></div>
      </div>
      <div className='person-details__factsheet-column'>
        <div className='person-details__media-column__1 person-details__relationship-column__1'>
          <p className='person-details__media-column__subtext'>Name</p>
        </div>
        <div className='person-details__media-column__2 person-details__relationship-column__2'>
          <p className='person-details__media-column__subtext'>Country</p>
        </div>
        <div className='person-details__media-column__3 person-details__relationship-column__3'>
          <p className='person-details__media-column__subtext'>Legal form</p>
        </div>
        <div className='person-details__relationship-column__4'>
          <p className='person-details__media-column__subtext'>Status</p>
        </div>
        <div className='person-details__media-column__5 person-details__relationship-column__5'>
          <assets.ArrowRightUPSVG
            width={16}
            height={16}
          />
        </div>
      </div>
      {data?.map((item, index) => {
        return (
          <div className='person-details__factsheet-column' key={`${item} ${index}`}>
            <div className='person-details__media-column__1 person-details__relationship-column__1'>
              <Link to={`/entity/${item.id}`}>{item.properties.name.join(', ') || 'Unknown name'}</Link>
            </div>
            <div className='person-details__media-column__2 person-details__relationship-column__2'>
              <p>{allCountriesList.find((object) => object.code.toLowerCase() === item.properties.country?.[0])?.name || '-'}</p>
            </div>
            <div className='person-details__media-column__3 person-details__relationship-column__3'>
              <p>{Array.isArray(item.properties.legalForm) ? item.properties.legalForm.join(', ') : item.properties.legalForm || '-'}</p>
            </div>
            <div className='person-details__relationship-column__4'>
              <p>{Array.isArray(item.properties.status) ? item.properties.status.join(', ') : item.properties.status || '-'}</p>
            </div>
            <div className='person-details__media-column__5 person-details__relationship-column__5'>
              <DetailsModalButton item={item} type='Wallet holder-person' />
            </div>
          </div>
        )
      })}
    </div>
  )
}
