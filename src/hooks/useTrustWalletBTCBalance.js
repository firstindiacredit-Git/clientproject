import { useState, useEffect } from 'react'
import { trustWalletBTCIndexerBase } from '../config/walletConfig'

/**
 * Hook to fetch Bitcoin inscribed address available balance
 * @param {string} address - Bitcoin address (e.g., bc1q4hsjyr0u9w63pcl4q493nrguln4h5tnlxudv6z)
 * @returns {object} - { balance, loading, error, refetch }
 */
export function useTrustWalletBTCBalance(address) {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchBalance = async (btcAddress) => {
    if (!btcAddress) {
      setError('Bitcoin address is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const url = `${trustWalletBTCIndexerBase}/inscribed/address/${btcAddress}/available-balance`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch BTC balance: ${response.statusText}`)
      }

      const data = await response.json()
      setBalance(data)
      return data
    } catch (err) {
      console.error('Error fetching Trust Wallet BTC balance:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (address) {
      fetchBalance(address)
    }
  }, [address])

  return {
    balance,
    loading,
    error,
    refetch: () => fetchBalance(address),
    fetchBalance, // Allow manual fetch with different address
  }
}

