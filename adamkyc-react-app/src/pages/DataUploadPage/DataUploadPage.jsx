import { useEffect, useState } from 'react'
import { BulkCategorySelector, BulkModal, BulkUploader, Spinner, TitleWithTooltip } from 'components'
import './DataUploadPage.style.scss'

function DataUploadPage () {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('address')
  const [activeButton, setActiveButton] = useState('Address')

  const keysArray = [
    { name: 'address', value: 'Address' },
    { name: 'bank-account', value: 'Bank Account' },
    { name: 'crypto-wallet', value: 'Crypto' },
    { name: 'person', value: 'Person' },
    { name: 'legal-entity', value: 'Company' },
    { name: 'security', value: 'Security' },
    { name: 'vessel', value: 'Vessels' }
  ]

  useEffect(() => {
    const result = keysArray.find((item) => item.value === activeButton)?.name
    setType(result)
  }, [activeButton])

  function handleChange (id) {
    setActiveButton(id)
  }

  function handleLoaded () {
    setIsLoaded(!isLoaded)
  }

  return (
    !loading
      ? (
        <section aria-label='bulk uploader section'>
          <div className='container no-flex no-padding__top-bottom'>
            <div className='data-uploader__wrapper'>
              <div className='data-uploader'>
                <h1 className='data-uploader__title'>Bulk Uploads of Data</h1>
                <p className='data-uploader__subtitle'>Please select the correct data type you want to upload to match the data</p>
              </div>
              <div><BulkCategorySelector onChange={handleChange} activeButton={activeButton} /></div>
            </div>
            <div className='data-uploader__content-container'>
              <div className='uploader-wrapper'>
                <div className='bulk-header__container'>
                  <TitleWithTooltip title={`${activeButton} Bulk Upload`} />
                </div>
                <p className='uploader-wrapper__subtext'>Drag and drop your files or select files from your local computer</p>
                <BulkUploader onChange={handleLoaded} type={type} changeLoadingState={setLoading} />
              </div>
            </div>
            {isLoaded && (
              <BulkModal />
            )}
          </div>
        </section>
        )
      : <Spinner />
  )
}

export default DataUploadPage
