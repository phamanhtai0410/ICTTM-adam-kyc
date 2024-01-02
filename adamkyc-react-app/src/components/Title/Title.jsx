import './Title.style.scss'

export function Title ({ text, quantity, className, textClassname }) {
  const staticClass = 'title-wrapper__component'

  return (
    <div className={`${staticClass} ${className || ''}`}>
      <h1 className={textClassname || 'hero-title'}>{text}</h1>
      {quantity && (
        <span className='quantity-border'><p className='quantity-counter'>{quantity}</p></span>
      )}
    </div>
  )
}
