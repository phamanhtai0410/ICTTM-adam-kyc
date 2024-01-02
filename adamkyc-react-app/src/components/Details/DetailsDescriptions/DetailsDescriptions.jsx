// import assets from '../../../assets/index'
import './DetailsDescriptions.style.scss'

export function DetailsDescriptions ({ serverData }) {
  return (
    <div className='person-details__description person-details__factsheet'>
      {serverData[0].properties['Notes text'].map((item, index) => {
        return (
          <div className='person-details__description-wrapper' key={index}>
            <p className='person-details__description-wrapper__subtext'>{item}</p>
            {/* <a href='/' className='person-details__description-wrapper__link'>
              <assets.CloudSVG
                width={16}
                height={16}
              />
              ACF List of bribetakers and warmongers [non-official source] 2023-05-09
            </a> */}
          </div>
        )
      })}
    </div>
  )
}
