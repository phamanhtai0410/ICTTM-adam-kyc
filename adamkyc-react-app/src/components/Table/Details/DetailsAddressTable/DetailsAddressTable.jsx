import { allCountriesList } from 'helpers'
import { DetailsModalButton } from 'components'
import assets from '../../../../assets/index'
import '../../../Details/DetailsRelationships/DetailsRelationships.style.scss'

export function DetailsAddressTable ({ data }) {
  return (
    <div className='person-details__relationship person-details__factsheet'>
      <div className='person-details__factsheet-column person-details__address-column'>
        <div className='person-details__relationship-column__hint'><p className='person-details__media-column__subtext'>Located there</p></div>
      </div>
      <div className='person-details__factsheet-column'>
        <div className='person-details__media-column__1 person-details__relationship-column__1'>
          <p className='person-details__media-column__subtext'>Flag</p>
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
        const FlagSVG = assets.flags[item.properties.country?.[0]] || assets.GlobeSVG
        return (
          <div className='person-details__factsheet-column' key={`${item} + ${index}`}>
            <div className='person-details__media-column__1 person-details__relationship-column__1'>
              <FlagSVG width={48} height={32} />
            </div>
            <div className='person-details__media-column__2 person-details__relationship-column__2'>
              <p>{item.caption || '-'}</p>
            </div>
            <div className='person-details__media-column__3 person-details__relationship-column__3'>
              <p>{allCountriesList.find(element => element.code.toLowerCase() === item.properties.country?.[0])?.name || '-'}</p>
            </div>
            <div className='person-details__media-column__5 person-details__relationship-column__5'>
              <DetailsModalButton item={item} type='Located there' />
            </div>
          </div>
        )
      })}
    </div>
  )
}
