import './Sort.style.scss'

export function Sort ({ text, array, onChange, value, className }) {
  return (
    <select
      className={`filter-select__menu ${className || ''}`}
      onChange={onChange}
      value={value}
    >
      <option defaultValue={text}>
        {text}
      </option>
      {array.map((data, index) => {
        return (
          <option key={index} value={data}>{data}</option>
        )
      })}
    </select>
  )
}
