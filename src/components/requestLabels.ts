import type { RequestStatus, RequestType } from '../api/requestModels'

export const STATUS_LABELS: Record<RequestStatus, string> = {
  New: 'New',
  InProgress: 'In progress',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
}

export const TYPE_LABELS: Record<RequestType, string> = {
  General: 'General',
  Legal: 'Legal',
  Payment: 'Payment',
  Appeal: 'Appeal',
}

export const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as RequestStatus[]
export const TYPE_OPTIONS = Object.keys(TYPE_LABELS) as RequestType[]
