import { AdminBulkUploadedTableRow, TableRow } from 'components'
import './AdminEditRequestTable.style.scss'

export function AdminEditRequestTable ({ editData, OnChange, onDelete, onSave, isChanged, isSaved, serverData, CheckboxChange, CleanCheckboxes, Checkboxes, startEditMode, tableName, checked, onChange }) {
  return (
    <div className='table-wrapper'>
      <div className='table-column'>
        <div className='table-column__element'>
          <input
            type='checkbox'
            checked={checked}
            onChange={onChange}
          />
        </div>
        {tableName === 'BulkUploadData'
          ? (
            <>
              <div className='admin-table__second-element table-column__element table-column__element--title'>
                <p>Entity</p>
              </div>
              <div className='admin-table__second-element table-column__element table-column__element--title'>
                <p>Author</p>
              </div>
              <div className='admin-table__second-element table-column__element table-column__element--title'>
                <p>Type</p>
              </div>
              <div className='admin-table__second-element table-column__element table-column__element--title'>
                <p>Status</p>
              </div>
              <div className='admin-table__second-element table-column__element table-column__element--title'>
                <p>Total views</p>
              </div>
              <div className='admin-table__second-element table-column__element table-column__element--title'>
                <p>Uploaded</p>
              </div>
              <div className='admin-table__second-element table-column__element table-column__element--title'>
                <p>View Graph</p>
              </div>
            </>
            )
          : (
            <>
              <div className='admin-table__element table-column__element table-column__element--title'>
                <p>Entity</p>
              </div>
              <div className='admin-table__element table-column__element table-column__element--title'>
                <p>Submitted By</p>
              </div>
              <div className='admin-table__element table-column__element table-column__element--title'>
                <p>Type</p>
              </div>
              <div className='admin-table__element table-column__element table-column__element--title'>
                <p>Status</p>
              </div>
              <div className='admin-table__element table-column__element table-column__element--title'>
                <p>Created</p>
              </div>
            </>
            )}
      </div>
      {tableName === 'BulkUploadData'
        ? (
            serverData?.map((item, index) => {
              return (
                <AdminBulkUploadedTableRow
                  key={`${item} + ${index}`}
                  item={item}
                  index={index}
                  editData={editData}
                  OnChange={OnChange}
                  onDelete={onDelete}
                  onSave={onSave}
                  isChanged={isChanged}
                  isSaved={isSaved}
                  CheckboxChange={CheckboxChange}
                  CleanCheckboxes={CleanCheckboxes}
                  Checkboxes={Checkboxes}
                  startEditMode={startEditMode}
                  {...tableName === 'BulkUploadData' ? { isBulkUpload: true } : {}}
                />
              )
            })
          )
        : (
            serverData?.map((item, index) => {
              return (
                <TableRow
                  key={`${item} + ${index}`}
                  item={item}
                  index={index}
                  editData={editData}
                  OnChange={OnChange}
                  onDelete={onDelete}
                  onSave={onSave}
                  isChanged={isChanged}
                  isSaved={isSaved}
                  CheckboxChange={CheckboxChange}
                  CleanCheckboxes={CleanCheckboxes}
                  Checkboxes={Checkboxes}
                  startEditMode={startEditMode}
                />
              )
            })
          )}
    </div>
  )
}
