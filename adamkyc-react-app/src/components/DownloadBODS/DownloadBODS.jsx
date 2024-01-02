import { useParams } from 'react-router'
import assets from '../../assets/index'
import './DownloadBODS.style.scss'

export function DownloadBODS () {
  const { id } = useParams()

  return (
    <a
      href={`${process.env.REACT_APP_API_ENDPOINT}/download/${id}`}
      aria-label='Link to download BODS file'
      download
      className='bods-link'
    >
      <assets.DownloadSVG
        width={24}
        height={24}
        title='download'
        className='bods-link__icon'
      />
      <p className='bods-link__subtext'>Download BODS JSON</p>
    </a>
  )
}
