import { useState, useEffect } from 'react'
import { trustWalletAssets } from '../config/walletConfig'

export function useTrustWalletAssets() {
  const [assets, setAssets] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(trustWalletAssets, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch assets: ${response.statusText}`)
        }

        const data = await response.json()
        setAssets(data)
      } catch (err) {
        console.error('Error fetching Trust Wallet assets:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  return { assets, loading, error, refetch: () => {
    const fetchAssets = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(trustWalletAssets)
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)
        const data = await response.json()
        setAssets(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAssets()
  }}
}

