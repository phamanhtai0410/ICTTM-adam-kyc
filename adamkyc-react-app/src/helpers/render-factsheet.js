import { Link } from 'react-router-dom'
import { DetailsFactsheetMoreButton } from 'components'
import { handleScrollTo } from './ScrollTo'
import { allCountriesList } from './mockdata'
import assets from '../../src/assets/index'

export function RenderFactSheetColumn (serverdata, value, option) {
  switch (option) {
    case 'Regular':
      return (
        <div className='person-details__factsheet-column'>
          <div className='person-details__factsheet-column__1'><p>{value}</p></div>
          <div className='person-details__factsheet-column__2'>
            <DetailsFactsheetMoreButton value={serverdata} />
          </div>
          <div className='person-details__factsheet-column__3'>
            <a
              onClick={() => handleScrollTo('Data Sources')}
              className='person-details__factsheet-column__3-link'
            >
              <p>Sources</p>
              <assets.LinkSVG
                width={12}
                height={12}
              />
            </a>
          </div>
        </div>
      )

    case 'Array':
      return (
        <div className='person-details__factsheet-column'>
          <div className='person-details__factsheet-column__1'><p>{value}</p></div>
          <div className='person-details__factsheet-column__2'>
            <p>
              {Array.isArray(serverdata)
                ? serverdata
                  .map(item => allCountriesList.find(arrayItem => arrayItem.code.toLowerCase() === item)?.name)
                  .join(', ')
                : allCountriesList.find(arrayItem => arrayItem.code.toLowerCase() === serverdata)?.name}
            </p>
          </div>
          <div className='person-details__factsheet-column__3'>
            <a
              onClick={() => handleScrollTo('Data Sources')}
              className='person-details__factsheet-column__3-link'
            >
              <p>Sources</p>
              <assets.LinkSVG
                width={12}
                height={12}
              />
            </a>
          </div>
        </div>
      )

    case 'Link Array':
      return (
        <div className='person-details__factsheet-column'>
          <div className='person-details__factsheet-column__1'><p>{value}</p></div>
          <div className='person-details__factsheet-column__2'>
            <div className='person-details__factsheet-column__2-link__list'>
              {serverdata.map((item) => {
                return (
                  <Link
                    to={`https://search.gleif.org/#/record/${item}`}
                    className='person-details__factsheet-column__2-link'
                    key={item}
                  >
                    <assets.LinkSVG
                      width={12}
                      height={12}
                    />
                    <p className='person-details__factsheet-column__2-link__subtext'>
                      {item}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className='person-details__factsheet-column__3'>
            <a href='/' className='person-details__factsheet-column__3-link'>
              <p>Sources</p>
              <assets.LinkSVG
                width={12}
                height={12}
              />
            </a>
          </div>
        </div>
      )

    case 'Phone':
      return (
        <div className='person-details__factsheet-column'>
          <div className='person-details__factsheet-column__1'><p>{value}</p></div>
          <div className='person-details__factsheet-column__2'>
            {serverdata.map((item, index) => {
              return (
                <a
                  key={`${item} + ${index}`}
                  href={`tel:${item}`}
                  className='person-details__factsheet-column__2-link'
                >
                  <assets.LinkSVG
                    width={12}
                    height={12}
                  />
                  <p>
                    {item}
                  </p>
                </a>
              )
            })}
          </div>
          <div className='person-details__factsheet-column__3'>
            <a
              href='/'
              className='person-details__factsheet-column__3-link'
            >
              <p>Sources</p>
              <assets.LinkSVG
                width={12}
                height={12}
              />
            </a>
          </div>
        </div>
      )

    case 'E-Mail':
      return (
        <div className='person-details__factsheet-column'>
          <div className='person-details__factsheet-column__1'><p>{value}</p></div>
          <div className='person-details__factsheet-column__2'>
            {serverdata.map((item, index) => {
              return (
                <a
                  key={`${item} + ${index}`}
                  href={`mailto:${item}`}
                  className='person-details__factsheet-column__2-link'
                >
                  <assets.LinkSVG
                    width={12}
                    height={12}
                  />
                  <p>
                    {item}
                  </p>
                </a>
              )
            })}
          </div>
          <div className='person-details__factsheet-column__3'>
            <a
              href='/'
              className='person-details__factsheet-column__3-link'
            >
              <p>Sources</p>
              <assets.LinkSVG
                width={12}
                height={12}
              />
            </a>
          </div>
        </div>
      )

    case 'Wikidata ID':
      return (
        <div className='person-details__factsheet-column'>
          <div className='person-details__factsheet-column__1'><p>{value}</p></div>
          <div className='person-details__factsheet-column__2'>
            <Link
              to={`https://www.wikidata.org/wiki/${serverdata}`}
              rel='noopener noreferrer' target='_blank'
              className='person-details__factsheet-column__2-link'
            >
              <assets.LinkSVG
                width={12}
                height={12}
              />
              <p className='person-details__factsheet-column__2-link__subtext'>
                {serverdata}
              </p>
            </Link>
          </div>
          <div className='person-details__factsheet-column__3'>
            <a
              href={`https://www.wikidata.org/wiki/${serverdata}`}
              className='person-details__factsheet-column__3-link'
            >
              <p>Sources</p>
              <assets.LinkSVG
                width={12}
                height={12}
              />
            </a>
          </div>
        </div>
      )

    case 'Source link Array':
      return (
        <div className='person-details__factsheet-column'>
          <div className='person-details__factsheet-column__1'><p>{value}</p></div>
          <div className='person-details__factsheet-column__2'>
            <div className='person-details__factsheet-column__2-link__list'>
              {serverdata.map((item) => {
                const url = item
                const domain = (new URL(url))
                return (
                  <Link
                    to={item}
                    className='person-details__factsheet-column__2-link'
                    key={item}
                  >
                    <assets.LinkSVG
                      width={12}
                      height={12}
                    />
                    <p className='person-details__factsheet-column__2-link__subtext'>
                      {domain.hostname}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className='person-details__factsheet-column__3'>
            <a
              onClick={() => handleScrollTo('Data Sources')}
              className='person-details__factsheet-column__3-link'
            >
              <p>Sources</p>
              <assets.LinkSVG
                width={12}
                height={12}
              />
            </a>
          </div>
        </div>
      )

    case 'Website':
      return (
        <div className='person-details__factsheet-column'>
          <div className='person-details__factsheet-column__1'><p>{value}</p></div>
          <div className='person-details__factsheet-column__2'>
            <div className='person-details__factsheet-column__2-link__list'>
              {serverdata.map((item) => {
                let domain
                try {
                  domain = new URL(item)
                } catch (error) {
                  console.error(`Invalid URL: ${item}`)
                  return null
                }
                return (
                  <Link
                    to={item}
                    className='person-details__factsheet-column__2-link'
                    key={item}
                  >
                    <assets.LinkSVG
                      width={12}
                      height={12}
                    />
                    <p className='person-details__factsheet-column__2-link__subtext'>
                      {domain.hostname}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className='person-details__factsheet-column__3'>
            <a href='/' className='person-details__factsheet-column__3-link'>
              <p>Sources</p>
              <assets.LinkSVG
                width={12}
                height={12}
              />
            </a>
          </div>
        </div>
      )

    case 'Time changed':
      return (
        <div className='person-details__factsheet-column'>
          <div className='person-details__factsheet-column__1'><p>{value}</p></div>
          <div className='person-details__factsheet-column__2'>
            <p>
              {serverdata}
            </p>
          </div>
          <div className='person-details__factsheet-column__3'>
            <a
              onClick={() => handleScrollTo('Data Sources')}
              className='person-details__factsheet-column__3-link'
            >
              <p>Sources</p>
              <assets.LinkSVG
                width={12}
                height={12}
              />
            </a>
          </div>
        </div>
      )

    default:
      return null
  }
}
