import { mockButtonCategory } from 'helpers'
import { TitleWithTooltip } from 'components'
import Excel from '../../assets/image/excel-page.png'
import assets from '../../assets/index'
import './BulkSampleDownloader.style.scss'

export function BulkSampleDownloader () {
  const excelFilePath = '/example.csv'

  return (
    <div className='bulk-sample__wrapper'>
      <div className='bulk-sample__gap'>
        <TitleWithTooltip title='Download sample CSV file' />
        <div>
          <ul className='bulk-sample__list'>
            {mockButtonCategory.map((item) => {
              return (
                <li key={item} className='bulk-sample__item'>
                  <a
                    href={excelFilePath}
                    aria-label='Link to download sample csv file'
                    download
                    className='bulk-sample__link'
                  >
                    <div className='bulk-sample__content-holder'>
                      <assets.DownloadSVG
                        width={16}
                        height={16}
                        title='download'
                        className='bulk-sample__icon'
                      />
                      <p className='bulk-sample__subtext'>{item} Upload File</p>
                    </div>
                    <img
                      src={Excel}
                      alt='excel img'
                      width={12}
                      height={16}
                      title='excel file'
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
