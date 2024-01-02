import assets from '../../../../assets/index'
import './DetailsDataSourcesCard.style.scss'

export function DetailsDataSourcesCard ({ data }) {
  const SVGItem = (data?.country !== '' && assets.flags[data?.country]) || (data?.id === 'wikidata' && assets.sources.wikipedia) || assets.GlobeSVG

  return (
    <a className='person-details__card' href={data?.source_url ? data.source_url : data.publisher_url} rel='noopener noreferrer' target='_blank'>
      <div title='header' className='person-details__card-header'>
        <SVGItem width={48} height={48} className='person-details__card-vector' />
        {data?.tags.map((item) => {
          return (
            <span className='person-details__card-tag__subtitle-wrapper' key={item}>
              <p className='person-details__card-tag__subtitle'>{item}</p>
            </span>
          )
        })}
      </div>
      <div className='person-details__card-description'>
        <p>{data?.title}</p>
      </div>
      <div className='person-details__card-description__subtitle'>
        <p>{data?.description}</p>
      </div>
    </a>
  )
}
