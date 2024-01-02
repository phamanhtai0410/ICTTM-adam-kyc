import { getCurrentUser } from 'api/requests'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export function AdminLayout () {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData () {
      try {
        const res = await getCurrentUser()
        if (res.data?.data?.is_admin !== true) {
          navigate('/', { state: { from: location } })
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  return <Outlet />
}
