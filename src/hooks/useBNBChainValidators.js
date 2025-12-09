import { useState, useEffect } from 'react'
import { bnbChainValidatorsBase } from '../config/walletConfig'

/**
 * Hook to fetch BNB Chain staking validators
 * @param {number} limit - Number of validators to fetch (default: 100)
 * @param {number} offset - Offset for pagination (default: 0)
 * @returns {object} - { validators, total, loading, error, refetch }
 */
export function useBNBChainValidators(limit = 100, offset = 0) {
  const [validators, setValidators] = useState(null)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchValidators = async (limitParam = limit, offsetParam = offset) => {
    try {
      setLoading(true)
      setError(null)
      
      const url = `${bnbChainValidatorsBase}/all?limit=${limitParam}&offset=${offsetParam}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        // Note: Accept-Encoding is automatically handled by the browser
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch BNB Chain validators: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.code === 2000 && data.data) {
        setValidators(data.data.validators || [])
        setTotal(data.data.total || 0)
      } else {
        throw new Error('Invalid response format from BNB Chain API')
      }
    } catch (err) {
      console.error('Error fetching BNB Chain validators:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchValidators()
  }, [limit, offset])

  return {
    validators,
    total,
    loading,
    error,
    refetch: () => fetchValidators(limit, offset),
    fetchValidators, // Allow manual fetch with different params
  }
}

