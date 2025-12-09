import { useState, useEffect } from 'react'
import { trustWalletMarketData } from '../config/walletConfig'

export function useTrustWalletMarketData() {
  const [marketData, setMarketData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(trustWalletMarketData, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch market data: ${response.statusText}`)
        }

        const data = await response.json()
        setMarketData(data)
      } catch (err) {
        console.error('Error fetching Trust Wallet market data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
    
    // Optionally refresh data every 30 seconds
    const interval = setInterval(fetchMarketData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return { marketData, loading, error, refetch: () => {
    const fetchMarketData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(trustWalletMarketData)
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)
        const data = await response.json()
        setMarketData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMarketData()
  }}
}

