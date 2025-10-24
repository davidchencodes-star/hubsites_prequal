import { useCallback } from 'react'
import { usePrequalStore } from '@/lib/store'

interface FetchDataParams {
  id: string
  deployType?: string
  parentDomain?: string
  parentIP?: string
}

export function useDataFetching() {
  const { setDataLoading, setDataError, setFetchedData } = usePrequalStore()

  const fetchData = useCallback(async (params: FetchDataParams) => {
    const { id, deployType, parentDomain, parentIP } = params

    if (!id) {
      setDataError('ID parameter is required')
      return null
    }

    setDataLoading(true)
    setDataError(null)

    const payload = {
      id,
      deployType,
      parentDomain,
      parentIP
    }

    try {
      const response = await fetch(`${process.env.SITE_URL}/api/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (result.success && result.data.error == 0 && result.data.items) {
        setFetchedData(result.data.items)
      } else {
        setDataError(result.msg || 'An unknown error occurred');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setDataError(errorMessage);
    } finally {
      setDataLoading(false)
    }
  }, [setDataLoading, setDataError, setFetchedData])

  return {
    fetchData
  }
}


