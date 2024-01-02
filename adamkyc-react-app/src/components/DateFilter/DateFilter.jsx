import './DateFilter.style.scss'

export function DateFilter ({ onChange, data, isAdmin }) {
  return (
    <div className='date-filter__wrapper' style={isAdmin ? { gap: '8px' } : {}}>
      <p className='datefilter-subtext filter-subtext' style={isAdmin ? { whiteSpace: 'nowrap' } : {}}>Sort from</p>
      <div className='datefilter-input__wrapper'>
        <label
          htmlFor='dateInput'
          className='datefilter-input__label'
          style={isAdmin ? { height: '37px' } : {}}
        >
          <input
            type='date'
            id='dateInput'
            className='date-filter__input'
            value={data.after}
            onChange={(e) => onChange(e, 'after')}
          />
        </label>
      </div>
      <p className='datefilter-subtext filter-subtext'>to</p>
      <div className='datefilter-input__wrapper'>
        <label
          htmlFor='dateInputFrom'
          className='datefilter-input__label'
          style={isAdmin ? { height: '37px' } : {}}
        >
          <input
            type='date'
            id='dateInputFrom'
            className='date-filter__input'
            value={data.before}
            onChange={(e) => onChange(e, 'before')}
          />
        </label>
      </div>
    </div>
  )
}
