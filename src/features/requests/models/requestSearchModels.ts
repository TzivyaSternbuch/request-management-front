import type { Sort } from '../../../sorting/sortModels'
import type { RequestSortField, RequestStatus, RequestType, SearchRequestsQuery } from '../api/requestModels'

export type RequestSearchFilters = Pick<
  SearchRequestsQuery,
  'requestNumber' | 'status' | 'type' | 'createdFrom' | 'createdTo'
>

export type RequestSort = Sort<RequestSortField>

export interface SearchFormValues {
  requestNumber: string
  status: RequestStatus[]
  type: RequestType[]
  createdFrom: string
  createdTo: string
}

export type SetSearchField = <K extends keyof SearchFormValues>(field: K, value: SearchFormValues[K]) => void

export type DateField = 'createdFrom' | 'createdTo'
