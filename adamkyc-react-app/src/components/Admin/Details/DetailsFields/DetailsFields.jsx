import { mockAdminEditingFields } from 'helpers'
import assets from '../../../../assets/index'
import './DetailsFields.style.scss'

export function DetailsFields ({ data }) {
  const newArray = mockAdminEditingFields.map(({ svg, text, placeholder }) => ({
    svg,
    text: data[text.toLowerCase().replace(/\s+/g, '_')] || text,
    placeholder
  }))

  return (
    <>
      <div className='admin-fields--holder'>
        <div className='table-column admin-fields'>
          <div className='admin-table__element table-column__element table-column__element--title admin-fields--title'>
            <p>Fields</p>
          </div>
          <div className='admin-table__element table-column__element table-column__element--title admin-fields--title'>
            <p>Value By</p>
          </div>
        </div>
        {newArray?.map((item, index) => {
          const SvgComponent = assets[item.svg]
          return (
            <div className='admin-table table-column admin-fields' key={index}>
              <div className='admin-table__element table-column__element admin-fields--element'>
                <SvgComponent width={16} height={16} />
                <p>{item.placeholder}</p>
              </div>
              <div className='admin-table__element table-column__element admin-fields--element'>
                <p className='admin-fields--form-text'>{item.text}</p>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
