import { useState, useEffect } from 'react'
import { trustWalletStablecoinConfig } from '../config/walletConfig'

/**
 * Hook to fetch Trust Wallet stablecoin invest configuration
 * This includes angle_routers and vaults data
 * @returns {object} - { config, loading, error, refetch }
 */
export function useTrustWalletStablecoinConfig() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(trustWalletStablecoinConfig, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch stablecoin config: ${response.statusText}`)
        }

        const data = await response.json()
        setConfig(data)
      } catch (err) {
        console.error('Error fetching Trust Wallet stablecoin config:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
    
    // Optionally refresh data every 5 minutes
    const interval = setInterval(fetchConfig, 300000)
    
    return () => clearInterval(interval)
  }, [])

  return { 
    config, 
    loading, 
    error, 
    refetch: () => {
      const fetchConfig = async () => {
        try {
          setLoading(true)
          setError(null)
          const response = await fetch(trustWalletStablecoinConfig)
          if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)
          const data = await response.json()
          setConfig(data)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchConfig()
    }
  }
}

