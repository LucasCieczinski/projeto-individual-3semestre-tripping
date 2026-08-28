import { appConfig } from '../config/env'

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) return null
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(body?.message || 'Não foi possível concluir a solicitação.', response.status, body)
  }
  return body
}
