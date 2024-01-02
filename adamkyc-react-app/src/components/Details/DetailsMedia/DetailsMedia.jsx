import assets from '../../../assets/index'
import './DetailsMedia.style.scss'

export function DetailsMedia ({ data }) {
  return (
    <div className='person-details__media person-details__factsheet'>
      <div className='person-details__factsheet-column'>
        <div className='person-details__media-column__1'><p className='person-details__media-column__subtext'>Title</p></div>
        <div className='person-details__media-column__2'><p className='person-details__media-column__subtext'>Outlet</p></div>
        <div className='person-details__media-column__3'><p className='person-details__media-column__subtext'>Date</p></div>
        <div className='person-details__media-column__4'><p className='person-details__media-column__subtext'>Link</p></div>
      </div>
      {data.map((item) => {
        return (
          <div className='person-details__factsheet-column' key={item.title}>
            <div className='person-details__media-column__1'><p>{item.title}</p>
            </div>
            <div className='person-details__media-column__2'><p>{item.outlet}</p></div>
            <div className='person-details__media-column__3'><p>{item.date}</p></div>
            <div className='person-details__media-column__4'>
              <a href={`/${item.link}`} className='person-details__factsheet-column__3-link'>
                <p>Sources</p>
                <assets.LinkSVG
                  width={12}
                  height={12}
                />
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
