import { useMutation } from '@tanstack/react-query'
import { ApiError } from '../api/apiError'
import { getCurrentUser } from '../api/usersApi'
import type { CurrentUser } from '../auth/currentUser'

const HTTP_UNAUTHORIZED = 401
const UNKNOWN_USER_MESSAGE = 'There is no user with this id.'
const FALLBACK_ERROR_MESSAGE = 'Could not log in. Please try again.'

interface LoginState {
  login: (userId: number) => void
  error: string | null
  isLoading: boolean
}

export function useLogin(onLogin: (user: CurrentUser) => void): LoginState {
  const { mutate, error, isPending } = useMutation({
    mutationFn: (userId: number) => getCurrentUser(userId),
    onSuccess: (user) => onLogin(user),
  })

  return {
    login: mutate,
    error: error === null ? null : toErrorMessage(error),
    isLoading: isPending,
  }
}

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === HTTP_UNAUTHORIZED) {
    return UNKNOWN_USER_MESSAGE
  }
  return FALLBACK_ERROR_MESSAGE
}
