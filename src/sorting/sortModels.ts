export type SortDirection = 'Asc' | 'Desc'

export interface Sort<TField extends string> {
  field: TField
  direction: SortDirection
}
