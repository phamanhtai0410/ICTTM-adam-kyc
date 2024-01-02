import { useNavigate } from 'react-router'

export function handleReturn (location) {
  const navigate = useNavigate()
  return navigate(location.state.from.pathname + location.state.from.search)
}
