export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function createPaginatedResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total: number,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit)

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

export const StandardResponses = {
  created: (message = "Resource created successfully") => ({ message }),
  updated: (message = "Resource updated successfully") => ({ message }),
  deleted: (message = "Resource deleted successfully") => ({ message }),
  noContent: () => ({}),
}
