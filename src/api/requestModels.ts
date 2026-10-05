export type RequestStatus = 'New' | 'InProgress' | 'Completed' | 'Cancelled'
export type RequestType = 'General' | 'Legal' | 'Payment' | 'Appeal'
export type RequestSortField = 'CreatedAt' | 'RequestNumber' | 'Status' | 'Type'
export type SortDirection = 'Asc' | 'Desc'

export interface RequestDto {
  id: number
  requestNumber: string
  customerId: number
  ownerId: number
  assignedToUserId: number | null
  status: RequestStatus
  requestType: RequestType
  createdAt: string
}

export interface SearchRequestsQuery {
  requestNumber?: string
  status?: RequestStatus[]
  type?: RequestType[]
  createdFrom?: string
  createdTo?: string
  sortBy?: RequestSortField
  sortDir?: SortDirection
  page?: number
  pageSize?: number
}

export type RequestSearchFilters = Pick<
  SearchRequestsQuery,
  'requestNumber' | 'status' | 'type' | 'createdFrom' | 'createdTo'
>
