import { useState } from 'react'
import { kilnTheGraphSubgraph } from '../config/walletConfig'

/**
 * Hook to query Kiln The Graph subgraph (GraphQL)
 * @returns {object} - { data, loading, error, query }
 */
export function useKilnTheGraph() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const query = async (graphQLQuery, variables = {}) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(kilnTheGraphSubgraph, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: graphQLQuery,
          variables: variables,
        }),
      })

      if (!response.ok) {
        throw new Error(`GraphQL query failed: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
      }

      setData(result.data)
      return result.data
    } catch (err) {
      console.error('Error querying Kiln The Graph:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    query,
  }
}

