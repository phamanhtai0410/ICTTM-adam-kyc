import { Link } from 'react-router-dom'
import { Button, SearchForm } from 'components'
import './Header.style.scss'

export function Header () {
  return (
    <>
      <nav className='container'>
        <SearchForm location='header' />
        <div className='navbar-search'>
          <h2 className='navbar-search__title'>Looking for more details?</h2>
          <Button
            as={Link}
            to='/advanced-search'
            type='advancedSearch'
            text='Advanced Search'
            ariaLabel='button for advanced searching'
            className='btn-search padding-8-12'
          />
        </div>
      </nav>
    </>
  )
}
