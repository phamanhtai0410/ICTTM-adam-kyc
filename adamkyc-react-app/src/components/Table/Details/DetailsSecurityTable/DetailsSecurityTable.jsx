import { Link } from 'react-router-dom'
import { DetailsModalButton } from 'components'
import { allCountriesList } from 'helpers'
import assets from '../../../../assets/index'
import '../../../Details/DetailsRelationships/DetailsRelationships.style.scss'

export function DetailsSecurityTable ({ data }) {
  return (
    <div className='person-details__relationship person-details__factsheet'>
      <div className='person-details__factsheet-column person-details__sanction-column'>
        <div className='person-details__relationship-column__hint'><p className='person-details__media-column__subtext'>Issued securities</p></div>
      </div>
      <div className='person-details__factsheet-column'>
        <div className='person-details__media-column__1 person-details__relationship-column__1'>
          <p className='person-details__media-column__subtext'>ISIN</p>
        </div>
        <div className='person-details__media-column__2 person-details__relationship-column__2'>
          <p className='person-details__media-column__subtext'>Name</p>
        </div>
        <div className='person-details__media-column__3 person-details__relationship-column__3'>
          <p className='person-details__media-column__subtext'>Country</p>
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
              <Link to={`/entity/${item.id}`}>{item.properties.isin || 'Unknown ISIN'}</Link>
            </div>
            <div className='person-details__media-column__2 person-details__relationship-column__2'>
              <p>{item.properties.name || '-'}</p>
            </div>
            <div className='person-details__media-column__3 person-details__relationship-column__3'>
              <p>{allCountriesList.find((object) => object.code.toLowerCase() === item.properties.country?.[0])?.name || '-'}</p>
            </div>
            <div className='person-details__media-column__5 person-details__relationship-column__5'>
              <DetailsModalButton item={item} type='Issued securities' />
            </div>
          </div>
        )
      })}
    </div>
  )
}
