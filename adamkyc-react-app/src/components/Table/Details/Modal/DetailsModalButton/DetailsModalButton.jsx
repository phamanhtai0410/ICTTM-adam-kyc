import { useModal } from 'providers'
import assets from '../../../../../assets/index'

export function DetailsModalButton ({ item, type }) {
  const { toggleModal } = useModal()
  return (
    <button
      type='button'
      style={{ display: 'flex', background: 'none', border: 'none' }}
      onClick={() => toggleModal(item, type)}
    >
      <assets.ArrowRightUPSVG
        width={16}
        height={16}
      />
    </button>
  )
}
