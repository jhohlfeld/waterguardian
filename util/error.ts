export interface GraphError extends Error {
  message: string
}

export interface ErrorWithCause<E> extends Error {
  cause: { status: number; error: E }
}

export function isGraphError(e: unknown): e is GraphError {
  return typeof e === 'object' && e !== null && 'message' in e
}

export function hasGraphErrorCause(
  e: unknown,
): e is ErrorWithCause<GraphError> {
  return (
    e instanceof Error &&
    e.cause instanceof Object &&
    'status' in e.cause &&
    'error' in e.cause &&
    isGraphError(e.cause.error)
  )
}
