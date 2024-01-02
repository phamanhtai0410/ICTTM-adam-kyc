import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { useEffect, useState } from 'react'
import './QuickAction.style.scss'

export function QuickAction ({ onChange, userId, type, onDelete, isBulkUpload }) {
  let content
  const location = useLocation()
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  function toggleMenu (e) {
    e.stopPropagation()
    setIsMenuVisible(!isMenuVisible)
  }

  function toggleEditMode () {
    onChange()
    setIsMenuVisible(false)
  }

  switch (type) {
    case 'detailEdit':
      content = (
        <div id={`quickActionMenu_${userId}`} className='menu'>
          <p className='menu-subtitle' onClick={toggleEditMode}>Edit Note</p>
          <p className='menu-subtitle menu-subtitle--trash' onClick={() => onDelete(userId, true)}>Delete</p>
        </div>
      )
      break
    case 'quickEdit':
      content = (
        <div id={`quickActionMenu_${userId}`} className='menu'>
          <Link
            to={isBulkUpload ? `/admin/entity/${userId}` : `/admin/report/${userId}`}
            state={{ from: location }}
            aria-label='Link to admin report page'
            className='link'
          >
            <p className='menu-subtitle'>Edit data</p>
          </Link>
          <p className='menu-subtitle' onClick={toggleEditMode}>Quick Edit</p>
          <p className='menu-subtitle menu-subtitle--trash' onClick={() => onDelete(userId)}>Move to trash</p>
        </div>
      )
      break
    default:
      break
  }

  function handleDocumentClick (e) {
    const menu = document.getElementById(`quickActionMenu_${userId}`)
    if (menu && !menu.contains(e.target)) {
      setIsMenuVisible(false)
    }
  }

  useEffect(() => {
    if (isMenuVisible) {
      document.addEventListener('click', handleDocumentClick)
    } else {
      document.removeEventListener('click', handleDocumentClick)
    }
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [isMenuVisible])

  useEffect(() => {
    function handleEscapeKey (e) {
      if (e.key === 'Escape') {
        setIsMenuVisible(false)
      }
    }
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  return (
    <div className='three-dots-menu' onClick={toggleMenu}>
      <div className='dots'>
        <div className='dot' />
        <div className='dot' />
        <div className='dot' />
      </div>
      {isMenuVisible && (
        content
      )}
    </div>
  )
}
