import { useRef, useState } from 'react'
import { AdminUploadEntity, uploadEntity } from 'api/requests'
import assets from '../../assets/index'
import './BulkUploader.style.scss'

export function BulkUploader ({ onChange, type, isAdmin, changeLoadingState }) {
  const fileInputRef = useRef(null)
  const bulkLoaderRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [formData, setFormData] = useState({ // eslint-disable-line
    userFile: null
  })

  async function handleUploadEntity (file, type) {
    try {
      await uploadEntity(file, type)
      onChange()
      changeLoadingState(false)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleAdminUploadEntity (file, type) {
    try {
      await AdminUploadEntity(file, type)
      onChange()
      changeLoadingState(false)
    } catch (err) {
      console.error(err)
    }
  }

  function handleImageUpload (e) {
    const file = e.target.files[0]
    const reader = new window.FileReader()

    reader.onloadstart = () => {
      changeLoadingState(true)
    }

    reader.onloadend = () => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userFile: reader.result
      }))
    }

    if (file) {
      reader.readAsDataURL(file)
      isAdmin ? handleAdminUploadEntity(file, type) : handleUploadEntity(file, type)
    }
  }

  function handleDragOver (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDragEnter (e) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setIsDragOver(false)
  }

  function handleDragLeave (e) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setIsDragOver(true)

    if (!bulkLoaderRef.current.contains(e.relatedTarget)) {
      setIsDragging(false)
      setIsDragOver(false)
    }
  }

  function handleDrop (e) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]

    if (file) {
      const reader = new window.FileReader()

      reader.onloadstart = () => {
        changeLoadingState(true)
      }

      reader.onloadend = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          userFile: reader.result
        }))
      }

      reader.readAsDataURL(file)
      isAdmin ? handleAdminUploadEntity(file, type) : handleUploadEntity(file, type)
    }
  }

  function handleAvatarClick () {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={`bulk-loader ${isDragging || isDragOver ? 'bulk-loader__dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleAvatarClick}
      ref={bulkLoaderRef}
    >
      <div
        className='bulk-loader__content-wrapper'
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
      >
        <button
          type='button'
          aria-label='button for upload file'
          title='Upload button'
        >
          <assets.Upload
            width={125}
            height={125}
            className='bulk-loader__icon'
          />
        </button>
        <p className='bulk-loader__subtext'>Max 20MB (CSV/XLSX)</p>
        <input
          className='bulk-loader__input'
          type='file'
          accept='.csv, .xls, .xlsx'
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
      </div>
    </div>
  )
}
