export function buildInput (name, placeholder, value = '', onChange, isRequired) {
  return (
    <input
      type='text'
      name={name}
      className='form-input'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={isRequired}
    />
  )
}
