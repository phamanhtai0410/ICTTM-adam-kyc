import { instance } from './instance'

async function loginToDB (credentials) {
  try {
    const res = await instance.post('/connect', credentials)
    if (res.data.message) return res.data
    return res
  } catch (err) {
    console.error(err)
    return err
  }
}

async function isLoggedInDB () {
  try {
    const res = await instance.get('/connection')
    return res.data.data
  } catch (err) {
    console.error(err)
  }
}

async function logoutDB () {
  try {
    const res = await instance.get('/disconnect')
    if (res.data.message) return res.data
    return res
  } catch (err) {
    console.error(err)
  }
}

async function getCurrentUser () {
  try {
    const res = await instance.get('/me')
    if (res.data.message) return res.data
    return res
  } catch (err) {
    console.error(err)
  }
}

async function searchByQInDB (credentials) {
  try {
    const res = await instance.get('/search', {
      params: credentials
    })
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getResentSearches () {
  try {
    const res = await instance.get('/recent-search')
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getLastViewed () {
  try {
    const res = await instance.get('/last-viewed')
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getHistory (date, currentPage) {
  try {
    const res = await instance.get('/history', { params: { page: currentPage, after: date.after, before: date.before } })
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function clearHistory () {
  try {
    const res = await instance.get('/history/clear')
    if (res.data.message) return res.data
    return res.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getAllBookmarks (dates, currentPage) {
  try {
    const res = await instance.get('/bookmarks', {
      params: { page: currentPage, after: dates.after, before: dates.before }
    })
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function clearAllBookmarks () {
  try {
    const res = await instance.get('/bookmarks/clear')
    if (res.data.message) return res.data
    return res.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getEntityById (id) {
  try {
    const res = await instance.get(`/entity/${id}`)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function downloadEntity (id) {
  try {
    const res = await instance.get(`/download/${id}`)
    if (res.data.message) return res.data
    return res
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getUploadHistory (page) {
  try {
    const res = await instance.get('/bulk-upload/history', { params: { page } })
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getAdminUploadHistory (currentPage, after, before, status, type) {
  try {
    const res = await instance.get('/admin-bulk-upload/history', {
      params:
        { page: currentPage, after, before, status, type }
    })
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function deleteAdminUploadHistory (id) {
  try {
    const res = await instance.delete(`/admin-bulk-upload/${id}`)
    if (res.data.message) return res.data
    return res.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function deleteUploadHistory (array) {
  try {
    const res = await instance.get('/bulk-upload/delete', {
      params: {
        identifiers: array
      }
    })
    if (res.data.message) return res.data
    return res.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function uploadEntity (file, type) {
  try {
    const formData = new FormData()
    formData.append('data', file)
    formData.append('type', type)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const res = await instance.post('/bulk-upload', formData, config)
    if (res.data.message) return res.data
    return res
  } catch (err) {
    console.error(err)
    return err
  }
}

async function AdminUploadEntity (file, type) {
  try {
    const formData = new FormData()
    formData.append('data', file)
    formData.append('type', type)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const res = await instance.post('/admin-bulk-upload', formData, config)
    if (res.data.message) return res.data
    return res
  } catch (err) {
    console.error(err)
    return err
  }
}

async function addOrDeleteBookmark (id) {
  try {
    const res = await instance.get(`/bookmark/${id}`)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function uploadUserReport (formData, id) {
  try {
    const res = await instance.post(`/report/${id}`, formData)
    if (res.data.message) return res.data
    return res.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getAllTopics () {
  try {
    const res = await instance.get('/topics')
    if (res.data.message) return res.data
    return res.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getAllDatasets () {
  try {
    const res = await instance.get('/datasets')
    if (res.data.message) return res.data
    return res.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getAllAdminReports (currentPage, after, before, searchValue, status, type, state) {
  try {
    const res = await instance.get('/admin-reports', {
      params:
        { page: currentPage, after, before, q: searchValue, status, type, state }
    })
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getAllAdminUploadDataEntities (currentPage, after, before, state, searchValue, status, type) {
  try {
    const res = await instance.get('/admin-entities', {
      params:
        { page: currentPage, after, before, state, q: searchValue, status, type }
    })
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getAdminReportById (id) {
  try {
    const res = await instance.get(`/admin-report/${id}`)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function updateAdminReportById (id, newStatus) {
  try {
    const res = await instance.post(`/admin-report/${id}`, newStatus)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function updateMultipleAdminReportById (data) {
  try {
    const res = await instance.post('/admin-reports/update', data)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function updateMultipleAdminBulkUploadedDataById (data) {
  try {
    const res = await instance.post('/admin-entities/update', data)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function deleteAdminReportById (id) {
  try {
    const res = await instance.delete(`/admin-report/${id}`)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function deleteMultipleAdminReportById (identifiers) {
  try {
    const res = await instance.get('/admin-reports/delete', { params: { identifiers } })
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function deleteMultipleAdminBulkUploadedDataById (identifiers) {
  try {
    const res = await instance.get('/admin-entities/delete', { params: { identifiers } })
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getAdminChangelogById (id) {
  try {
    const res = await instance.get(`/admin-report/${id}/changelog`)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function getAdminReportNotesById (entityId) {
  try {
    const res = await instance.get(`/admin-report/${entityId}/notes`)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function createAdminReportNote (entityId, body) {
  try {
    const res = await instance.post(`/admin-report/${entityId}/note`, body)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function updateAdminReportNote (entityId, noteId, body) {
  try {
    const res = await instance.put(`/admin-report/${entityId}/note/${noteId}`, body)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function deleteAdminReportNote (entityId, noteId) {
  try {
    const res = await instance.delete(`/admin-report/${entityId}/note/${noteId}`)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

//

async function getAdminEntityById (id) {
  try {
    const res = await instance.get(`/admin-entity/${id}`)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function createAdminEntity (state, status, entity) {
  try {
    const res = await instance.post('/admin-entity/create', { state, status, data: entity })
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function createAdminEntityDataset (dataset) {
  const {
    description = '',
    publisher_name = '', //eslint-disable-line
    publisher_url = '', //eslint-disable-line
    title = '',
    country = '',
    source_url = '', //eslint-disable-line
    tags = []
  } = dataset
  try {
    const res = await instance.post('/admin-dataset', {
      description,
      publisher_name, //eslint-disable-line
      publisher_url, //eslint-disable-line
      title,
      country,
      source_url, //eslint-disable-line
      tags
    })
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function deleteAdminEntityById (id) {
  try {
    const res = await instance.delete(`/admin-entity/${id}`)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function updateStatusAdminEntityById (id, newStatus) {
  try {
    const res = await instance.patch(`/admin-entity/${id}`, newStatus)
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

async function updateAdminEntityById (id, state, status, entity) {
  try {
    const res = await instance.put(`/admin-entity/${id}`, { state, status, data: entity })
    if (res.data.message) return res.data
    return res.data.data
  } catch (err) {
    console.error(err)
    return err
  }
}

//

export {
  isLoggedInDB,
  loginToDB,
  logoutDB,
  getCurrentUser,
  searchByQInDB,
  getAllBookmarks,
  getEntityById,
  addOrDeleteBookmark,
  clearAllBookmarks,
  getResentSearches,
  getLastViewed,
  downloadEntity,
  getHistory,
  clearHistory,
  uploadEntity,
  getUploadHistory,
  deleteUploadHistory,
  uploadUserReport,
  getAllTopics,
  getAllDatasets,
  getAllAdminReports,
  getAdminReportById,
  getAdminReportNotesById,
  createAdminReportNote,
  updateAdminReportNote,
  deleteAdminReportNote,
  updateAdminReportById,
  deleteAdminReportById,
  getAdminChangelogById,
  deleteMultipleAdminReportById,
  updateMultipleAdminReportById,
  AdminUploadEntity,
  getAdminUploadHistory,
  deleteAdminUploadHistory,
  getAllAdminUploadDataEntities,
  deleteMultipleAdminBulkUploadedDataById,
  updateMultipleAdminBulkUploadedDataById,
  createAdminEntity,
  deleteAdminEntityById,
  updateStatusAdminEntityById,
  updateAdminEntityById,
  createAdminEntityDataset,
  getAdminEntityById
}
