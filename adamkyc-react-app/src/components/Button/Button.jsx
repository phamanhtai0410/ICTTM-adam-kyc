import assets from '../../assets/index'
import './Button.style.scss'

export function Button ({ as = 'button', ariaLabel, className, onClick, text, type, ...rest }) {
  const Renderer = as
  let buttonContents

  switch (type) {
    case 'trash':
      buttonContents = (
        <>
          <assets.Trash width={16} height={16} className='color-grey' />
          {text}
        </>
      )
      break
    case 'advancedSearch':
      buttonContents = (
        <>
          {text}
          <assets.ArrowRightRendered width={16} height={16} className='color-black' />
        </>
      )
      break
    case 'back':
      buttonContents = (
        <>
          {text}
          <assets.BackSVG width={16} height={16} className='color-black' />
        </>
      )
      break
    default:
      buttonContents = text
  }

  return (
    <Renderer type='button' aria-label={ariaLabel} className={className} onClick={onClick} {...rest}>
      {buttonContents}
    </Renderer>
  )
}
