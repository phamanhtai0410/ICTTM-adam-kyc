export function AdminContolButton ({ category, value, onClick, text }) {
  return (
    <button
      type='button'
      aria-label='button for changing sorting'
      className={`admin-edit__type-selector__button ${category === value ? 'admin-edit__type-selector__button--active' : 'admin-edit__type-selector__button--not-active'}`}
      value={value}
      disabled={category === value}
      onClick={(e) => onClick(e)}
    >
      {text}
    </button>
  )
}
