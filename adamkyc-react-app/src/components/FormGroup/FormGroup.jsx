export function FormGroup ({ type, text, isConnected, isPassword, isEmail, isDetail, isRequired, className, name, placeholder, value, array, onChange, IsAdmin }) {
  let content

  switch (type) {
    case 'text&input':
      content = (
        <label className='report-form__label' style={isDetail ? { height: '180px' } : {}}>
          {isRequired
            ? (
              <p className='report-form__subtext'>{text} <span className='report-form__subtext--star'>*</span></p>
              )
            : (
              <p className='report-form__subtext'>{text}</p>
              )}
          <input
            type={isPassword ? 'password' : isEmail ? 'email' : 'text'}
            name={name}
            className='form-input'
            placeholder={placeholder}
            required={isRequired}
            readOnly={isConnected}
            value={value}
            onChange={onChange}
            style={isDetail ? { flexGrow: '1' } : {}}
          />
        </label>
      )
      break
    case 'text&textarea':
      content = (
        <label className='report-form__label' style={isDetail ? { height: '180px' } : {}}>
          {isRequired
            ? (
              <p className='report-form__subtext'>{text} <span className='report-form__subtext--star'>*</span></p>
              )
            : (
              <p className='report-form__subtext'>{text}</p>
              )}
          <textarea
            type='text'
            name={name}
            rows={5}
            cols={3}
            className='form-input'
            placeholder={placeholder}
            required={isRequired}
            readOnly={isConnected}
            value={value}
            onChange={onChange}
            style={isDetail ? { flexGrow: '1' } : {}}
          />
        </label>
      )
      break
    case 'text&select':
      content = (
        <label className='report-form__label'>
          {isRequired
            ? (
              <p className='report-form__subtext'>{text} <span className='report-form__subtext--star'>*</span></p>
              )
            : (
              <p className='report-form__subtext'>{text}</p>
              )}
          <select
            className={`filter-select__menu form-select__menu ${className || ''}`}
            value={value}
            onChange={onChange}
            name={name}
          >
            <option>
              Select options
            </option>
            {array.map((item) => {
              return <option key={item}>{item}</option>
            })}
          </select>
        </label>
      )
      break
    case 'input':
      content = (
        <label className='report-form__label' style={isDetail ? { height: '180px' } : IsAdmin ? { width: '50%' } : {}}>
          <input
            type={isPassword ? 'password' : isEmail ? 'email' : 'text'}
            name={name}
            className={`form-input ${className || ''}`}
            placeholder={placeholder}
            required={isRequired}
            readOnly={isConnected}
            value={value}
            onChange={onChange}
            style={isDetail ? { flexGrow: '1' } : IsAdmin ? { height: '33px' } : {}}
          />
        </label>
      )
      break
    default:
      break
  }
  return content
}
