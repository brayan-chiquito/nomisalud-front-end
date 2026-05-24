import { useLocation, useNavigate } from 'react-router-dom'
import { currentAppPath, navigationReturnState, readReturnTo } from '@/utils/navigationReturn'

export function useCurrentReturnState() {
  const location = useLocation()
  return navigationReturnState(currentAppPath(location))
}

export function useReturnNavigation(fallbackPath: string) {
  const location = useLocation()
  const navigate = useNavigate()
  const returnTo = readReturnTo(location.state)
  const backTarget = returnTo ?? fallbackPath

  const goBack = () => {
    if (returnTo) {
      navigate(returnTo)
      return
    }
    if (location.key !== 'default') {
      navigate(-1)
      return
    }
    navigate(fallbackPath)
  }

  return { backTarget, goBack, returnTo }
}
