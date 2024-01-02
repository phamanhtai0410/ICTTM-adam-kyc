import './AdminEntityNameForm.style.scss'

export function AdminEntityNameForm ({ value, onChange }) {
  return (
    <label className='admin-entity__name-form'>
      <input
        className='admin-entity__name-input'
        placeholder='Pamfilova Ella Aleksandrovna'
        value={value}
        onChange={(e) => onChange(e)}
      />
    </label>
  )
}
