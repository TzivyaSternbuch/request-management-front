import type { RequestDto } from '../api/requestModels'

export function createRequest(id: number): RequestDto {
  return {
    id,
    requestNumber: `REQ-${id}`,
    customerId: 7,
    ownerId: 1,
    assignedToUserId: null,
    status: 'New',
    requestType: 'General',
    createdAt: '2026-01-01T00:00:00Z',
  }
}
