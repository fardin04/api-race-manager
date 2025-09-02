import { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from 'axios'

const useApiStatus = (urlPath) => { 
  const [status, setStatus] = useState([])  
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  // Track the latest request
  const requestIdRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    const currentRequestId = ++requestIdRef.current

    ;(async () => {
      try {
        setLoading(true)
        setError(false)

        const searchParam = search ? `?search=${encodeURIComponent(search)}` : ''
        const res = await axios.get(urlPath + searchParam, {
          signal: controller.signal
        })

        // Only update if this request is still the latest
        if (requestIdRef.current === currentRequestId) {
          setStatus(res.data)
          console.log(res.data)
        }
      } catch (error) {
        if (axios.isCancel(error) || error.name === 'CanceledError') {
          console.log('Request canceled')
          return
        }
        setError(true)
      } finally {
        if (requestIdRef.current === currentRequestId) {
          setLoading(false)
        }
      }
    })()

    return () => controller.abort()
  }, [urlPath, search])

  return { status, error, loading, setSearch, search }
}

function App() {
  const { status, error, loading, setSearch, search } = useApiStatus('/api/status')

  if (error) return <h2>Something went wrong</h2>
  if (loading) return <h2>Loading...</h2>

  return (
    <>
      <h1>API Race Manager</h1>
      <h2>Number of Services: {status.length}</h2>
      <input
        type="text"
        placeholder="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </>
  )
}

export default App



