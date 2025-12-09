import { useState } from 'react'
import { trustWalletBTCBlockbookBase } from '../config/walletConfig'

/**
 * Hook to fetch Bitcoin address data from Blockbook
 * @param {string} address - Bitcoin address (e.g., bc1q4hsjyr0u9w63pcl4q493nrguln4h5tnlxudv6z)
 * @param {string} details - Details level: 'basic' | 'tokens' | 'tokenBalances' | 'txids' | 'txslight' | 'txs'
 * @returns {object} - { addressData, loading, error, fetchAddress }
 */
export function useTrustWalletBTCAddress() {
  const [addressData, setAddressData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAddress = async (btcAddress, details = 'basic') => {
    if (!btcAddress) {
      setError('Bitcoin address is required')
      return null
    }

    try {
      setLoading(true)
      setError(null)

      const url = `${trustWalletBTCBlockbookBase}/api/v2/address/${btcAddress}?details=${details}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch BTC address data: ${response.statusText}`)
      }

      const data = await response.json()
      setAddressData(data)
      return data
    } catch (err) {
      console.error('Error fetching Trust Wallet BTC address data:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    addressData,
    loading,
    error,
    fetchAddress,
  }
}

