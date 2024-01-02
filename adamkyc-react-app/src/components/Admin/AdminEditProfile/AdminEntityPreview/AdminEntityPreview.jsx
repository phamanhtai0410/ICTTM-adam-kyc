import assets from '../../../../assets/index'
import './AdminEntityPreview.style.scss'

export function AdminEntityPreview () {
  return (
    <div className='admin-entity__preview-wrapper'>
      <assets.EyeSVG width={16} height={16} /><p>Preview on new tab</p>
    </div>
  )
}
