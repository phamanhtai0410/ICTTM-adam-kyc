import assets from '../../../assets/index'

export function AdminAsideButton ({ text, svg, ariaLabel, onClick, title }) {
  const ButtonSVG = svg === 'save' ? assets.SaveSVG : assets.Trash
  return (
    <button
      type='button'
      aria-label={ariaLabel}
      className='admin-request__button'
      onClick={onClick}
      title={title}
    >
      <ButtonSVG width={24} height={24} />{text}
    </button>
  )
}
