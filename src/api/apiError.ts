import type { ProblemDetails } from './commonModels'

export class ApiError extends Error {
  status: number
  problem?: ProblemDetails

  constructor(status: number, problem?: ProblemDetails) {
    super(`Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }
}
