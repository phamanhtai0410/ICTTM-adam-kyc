import { Outlet } from 'react-router-dom'
import { Header } from 'components'

export function DefaultLayout () {
  return (
    <>
      <header className='header-bg'>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
