/** Phase 2 seam: transport is injected; the editor never executes network code. */
export class ApiError extends Error {
  constructor(message, { status = 0, kind = 'network' } = {}) {
    super(message); this.name = 'ApiError'; this.status = status; this.kind = kind
  }
}
export function createApiClient({ transport, timeoutMs = 8000 } = {}) {
  if (typeof transport !== 'function') throw new TypeError('Provide an explicit transport')
  return {
    async request({ url, method = 'GET', body, headers = {}, signal } = {}) {
      if (typeof url !== 'string' || !url.trim()) throw new TypeError('URL is required')
      if (!['GET', 'POST'].includes(method)) throw new TypeError('Only GET and POST are planned initially')
      if (signal?.aborted) throw new ApiError('Request cancelled', { kind: 'cancelled' })
      const controller = new AbortController()
      let timeout
      const cancel = () => controller.abort(new ApiError('Request cancelled', { kind: 'cancelled' }))
      signal?.addEventListener('abort', cancel, { once: true })
      let stopListening
      const interrupted = new Promise((_, reject) => {
        const listener = () => reject(controller.signal.reason)
        controller.signal.addEventListener('abort', listener, { once: true })
        stopListening = () => controller.signal.removeEventListener('abort', listener)
        timeout = setTimeout(() => controller.abort(new ApiError('Request timed out', { kind: 'timeout' })), timeoutMs)
      })
      try {
        const response = await Promise.race([Promise.resolve().then(() => transport({ url, method, body, headers: { ...headers }, signal: controller.signal })), interrupted])
        if (!response || !Number.isInteger(response.status)) throw new ApiError('Invalid transport response', { kind: 'invalid-response' })
        if (response.status < 200 || response.status >= 300) throw new ApiError(`HTTP ${response.status}`, { status: response.status, kind: 'http' })
        return { status: response.status, data: response.status === 204 ? null : response.data, headers: response.headers ?? {} }
      } catch (error) {
        if (error instanceof ApiError) throw error
        if (controller.signal.aborted) throw controller.signal.reason
        throw new ApiError(error.message || 'Network request failed')
      } finally {
        clearTimeout(timeout); stopListening(); signal?.removeEventListener('abort', cancel)
      }
    }
  }
}
/** Deterministic examples for API lab; no actual network request is made. */
export function createMockTransport({ scenario = 'success', delayMs = 300 } = {}) {
  return ({ signal }) => new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(signal.reason); return }
    const abort = () => { clearTimeout(timer); reject(signal.reason) }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      if (scenario === 'error') resolve({ status: 503, data: { message: 'Try again later' } })
      else resolve({ status: 200, data: scenario === 'empty' ? [] : [{ id: 1, name: 'Alex Morgan' }, { id: 2, name: 'Sam Rivera' }] })
    }, delayMs)
    signal?.addEventListener('abort', abort, { once: true })
  })
}
