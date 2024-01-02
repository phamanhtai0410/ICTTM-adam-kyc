import React, { createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { DetailsModal } from 'components'

const ModalContext = createContext()

export function useModal () {
  return useContext(ModalContext)
}

export function ModalProvider ({ children }) {
  const [modalData, setModalData] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)

  function toggleModal (data, type) {
    if (data) setModalData(data)
    if (type) setModalType(type)
    setModalOpen((prev) => !prev)
  }

  return (
    <ModalContext.Provider value={{ toggleModal, isModalOpen, modalData }}>
      {children}
      {isModalOpen && createPortal(
        <DetailsModal data={modalData} type={modalType} />,
        document.querySelector('#root')
      )}
    </ModalContext.Provider>
  )
}
