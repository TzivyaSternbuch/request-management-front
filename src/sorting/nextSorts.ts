import type { Sort } from './sortModels'

// A click on a column moves it on: not sorted → ascending → descending → not sorted.
// A newly sorted column goes last, so the columns sorted before it keep their priority.
export function nextSorts<TField extends string>(current: Sort<TField>[], field: TField): Sort<TField>[] {
  const sort = current.find((x) => x.field === field)
  if (sort === undefined) {
    return [...current, { field, direction: 'Asc' }]
  }
  if (sort.direction === 'Asc') {
    return current.map((x) => (x.field === field ? { field, direction: 'Desc' } : x))
  }
  return current.filter((x) => x.field !== field)
}
