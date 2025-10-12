const toJsonSafe = async (response) => {
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const get = async (url, options = {}) => {
  const response = await fetch(url, { method: 'GET', ...options })
  const data = options.responseType === 'stream' ? response.body : await toJsonSafe(response)
  if (!response.ok) {
    const error = new Error(`Request failed with status code ${response.status}`)
    error.response = { status: response.status, data }
    throw error
  }
  return {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    data
  }
}

export default { get }
