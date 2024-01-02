import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStore } from 'providers'
import { DetailsModalButton } from 'components'
import { updateArrayOfObjects } from 'helpers'
import assets from '../../../../assets/index'
import './DetailsCryptoWalletTable.style.scss'
import '../../../Details/DetailsRelationships/DetailsRelationships.style.scss'

export function DetailsCryptoWalletTable ({ data }) {
  const { topics } = useStore()
  const [actualTopics, setActualTopics] = useState({})

  useEffect(() => {
    setActualTopics(topics ?? {})
  }, [topics])

  const updatedArrayOfObjects = updateArrayOfObjects(data, actualTopics)

  return (
    <div className='person-details__relationship person-details__factsheet'>
      <div className='person-details__factsheet-column person-details__crypto-column'>
        <div className='person-details__relationship-column__hint'><p className='person-details__media-column__subtext'>Cryptocurrency wallets</p></div>
      </div>
      <div className='person-details__factsheet-column'>
        <div className='person-details__media-column__1 person-details__relationship-column__1'>
          <p className='person-details__media-column__subtext'>Currency</p>
        </div>
        <div className='person-details__media-column__2 crypto-column'>
          <p className='person-details__media-column__subtext'>Address</p>
        </div>
        <div className='person-details__media-column__5 person-details__relationship-column__5'>
          <assets.ArrowRightUPSVG
            width={16}
            height={16}
          />
        </div>
      </div>
      {updatedArrayOfObjects?.map((item, index) => {
        return (
          <div className='person-details__factsheet-column' key={`${item} ${index}`}>
            <div className='person-details__media-column__1 person-details__relationship-column__1'>
              <p>{item.properties.currency}</p>
            </div>
            <div className='person-details__media-column__2 crypto-column'>
              <Link to={`/entity/${item.id}`}>{item.properties.publicKey}</Link>
            </div>
            <div className='person-details__media-column__5 person-details__relationship-column__5'>
              <DetailsModalButton item={item} type='Cryptocurrency wallets' />
            </div>
          </div>
        )
      })}
    </div>
  )
}
