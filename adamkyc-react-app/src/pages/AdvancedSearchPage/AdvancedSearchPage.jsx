import { useState } from 'react'
import { AdvancedSearchForm, BulkCategorySelector, Title } from 'components'
import './AdvancedSearchPage.style.scss'

function AdvancedSearchPage () {
  const [activeButton, setActiveButton] = useState('Address')
  let text

  function handleChange (id) {
    setActiveButton(id)
  }

  switch (activeButton) {
    case 'Company':
      text = 'Company, Organization Or Legal Entity Search Fields'
      break
    case 'Crypto':
      text = 'Crypto Wallet Search Fields'
      break
    default:
      text = activeButton + ' ' + 'Search Fields'
  }

  return (
    <section aria-label='bulk uploader section'>
      <div className='container no-flex no-padding__top-bottom'>
        <div className='category-wrapper'>
          <Title text='Advanced Search' className='centered-text' />
          <div>
            <BulkCategorySelector onChange={handleChange} activeButton={activeButton} isUploadPage />
          </div>
        </div>
      </div>
      <div className='container-background'>
        <div className='container no-flex no-padding__top-bottom'>
          <div className='forms-container'>
            <h2 className='forms-container__title'>{text}</h2>
            <AdvancedSearchForm form={activeButton} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdvancedSearchPage
