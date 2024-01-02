import { Route, Routes } from 'react-router'
import { Database, DetailsModal } from 'components'
import { DefaultLayout, AdminLayout } from 'layouts'
import WelcomePage from 'pages/WelcomePage/WelcomePage'
import SearchHistoryPage from 'pages/SearchHistoryPage/SearchHistoryPage'
import SearchPage from 'pages/SearchPage/SearchPage'
import SavedResultsPage from 'pages/SavedResultsPage/SavedResultsPage'
import DataUploadPage from 'pages/DataUploadPage/DataUploadPage'
import AdvancedSearchPage from 'pages/AdvancedSearchPage/AdvancedSearchPage'
import DetailsPage from 'pages/DetailsPage/DetailsPage'
import ReportIncorrectDataPage from 'pages/ReportIncorrectDataPage/ReportIncorrectDataPage'
import DataUploadResultsPage from 'pages/DataUploadResultsPage/DataUploadResultsPage'
import AdminBulkUploadPage from 'pages/Admin/AdminBulkUploadPage/AdminBulkUploadPage'
import AdminBulkUploadResultPage from 'pages/Admin/AdminBulkUploadResultsPage/AdminBulkUploadResultPage'
import AdminEditingRequestPage from 'pages/Admin/AdminEditingRequestPage/AdminEditingRequestPage'
import AdminEditingRequestDetailPage from 'pages/Admin/AdminEditingRequestDetailPage/AdminEditingRequestDetailPage'
import AdminAnalyticsPage from 'pages/Admin/AdminAnalyticsPage/AdminAnalyticsPage'
import AdminBulkUploadDataPage from 'pages/Admin/AdminBulkUploadDataPage/AdminBulkUploadDataPage'
import AdminEditProfileDetailPage from 'pages/Admin/AdminEditProfileDetailPage/AdminEditProfileDetailPage'
import '../index.css'

export function App () {
  return (
    <>
      <Routes>
        <Route path='/' element={<DefaultLayout />}>
          <Route index element={<WelcomePage />} />
          <Route path='advanced-search' element={<AdvancedSearchPage />} />
          <Route path='bookmarks' element={<SavedResultsPage />} />
          <Route path='bulk-upload' element={<DataUploadPage />} />
          <Route path='bulk-upload/data' element={<DataUploadResultsPage />} />
          <Route path='history' element={<SearchHistoryPage />} />
          <Route path='entity/:id' element={<DetailsPage />} />
          <Route path='report/:id' element={<ReportIncorrectDataPage />} />
          <Route path='search' element={<SearchPage />} />
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='bulk-upload' element={<AdminBulkUploadPage />} />
          <Route path='entities' element={<AdminBulkUploadDataPage />} />
          <Route path='bulk-upload/history' element={<AdminBulkUploadResultPage />} />
          <Route path='dashboard' element={<AdminAnalyticsPage />} />
          <Route path='database' element={<Database />} />
          <Route path='reports' element={<AdminEditingRequestPage />} />
          <Route path='report/:id' element={<AdminEditingRequestDetailPage />} />
          <Route path='entity/:id' element={<AdminEditProfileDetailPage />} />
        </Route>
        <Route path='*' element={<WelcomePage />} />
        <Route path='/test' element={<DetailsModal />} />
      </Routes>
    </>
  )
}
