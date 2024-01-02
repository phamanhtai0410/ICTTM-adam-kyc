import assets from '../../assets/index'
import './Paginator.style.scss'

export function Paginator ({ changePage, totalPages, currentPage, page, onChange }) {
  const displayRange = 2
  const pageButtons = []

  for (let i = Math.max(1, currentPage - displayRange); i <= Math.min(totalPages, currentPage + displayRange); i++) {
    pageButtons.push(
      <button
        key={`${i} + item`}
        onClick={() => changePage(i)}
        className={currentPage === i ? 'paginator-pages paginator-pages--active' : 'paginator-pages'}
      >
        {i}
      </button>
    )
  }

  return (
    <div className='paginator-container'>
      <div className='paginator'>
        <button
          className='paginator-element'
          title='Back'
          aria-label='Previous page'
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
        >
          <assets.ChevronLeftSVG
            width={24}
            height={24}
            title='Back'
          />
        </button>
        {currentPage > 3 && (
          <button
            onClick={() => changePage(1)}
            className='paginator-pages'
          >
            1
          </button>
        )}
        {currentPage > 4 && (
          <span className='paginator-pages'>...</span>
        )}
        {pageButtons}
        {currentPage < totalPages - 3 && (
          <span className='paginator-pages'>...</span>
        )}
        {currentPage < totalPages - 2 && (
          <button
            onClick={() => changePage(totalPages)}
            className='paginator-pages'
          >
            {totalPages}
          </button>
        )}
        <button
          className='paginator-element'
          title='Next'
          aria-label='Next page'
          disabled={currentPage === totalPages}
          onClick={() => changePage(currentPage + 1)}
        >
          <assets.ChevronRightSVG
            width={24}
            height={24}
            title='Next'
          />
        </button>
      </div>
      <label className='paginator-selector'>
        <input
          className='paginator-selector__input'
          value={page}
          onChange={(e) => onChange(e)}
        />
      </label>
    </div>
  )
}
