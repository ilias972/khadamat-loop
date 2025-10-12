import fallbackAxios from './ops-axios.js'

const axiosPromise = import('axios')
  .then(mod => mod.default ?? mod)
  .catch(() => fallbackAxios)

const url = process.env.OPS_BACKEND_URL || 'http://localhost:8080'
const checks = ['/healthz', '/readyz']
const run = async () => {
  const axios = await axiosPromise
  for (const path of checks) {
    const { status } = await axios.get(`${url}${path}`)
    console.log(`${path}: ${status === 200 ? 'OK' : 'FAIL'}`)
  }
}
run().catch(e => { console.error(e); process.exit(1) })
