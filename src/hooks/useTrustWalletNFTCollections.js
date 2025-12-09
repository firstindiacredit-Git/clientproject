import { useState } from 'react'
import { trustWalletNFTCollections } from '../config/walletConfig'

// Device credential from Trust Wallet
const DEVICE_CREDENTIAL = '1570c7529790357b62e75efe032c09742f21d9273d856296fbddc8b62b742512'

// Generate HMAC-SHA256 signature (simplified - you may need to implement proper signing)
function generateSignature(method, url, body, date, nonce) {
  // Note: This is a placeholder. In production, you need to implement proper HMAC-SHA256 signing
  // based on Trust Wallet's authentication requirements
  return 'WOqXPEpmeo+ziU0R6V1zvZ5+6J9feP2cvXaiR/Ung4M='
}

// Generate nonce
function generateNonce() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

export function useTrustWalletNFTCollections() {
  const [collections, setCollections] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNFTCollections = async (options = {}) => {
    try {
      setLoading(true)
      setError(null)

      const {
        page = 0,
        pageSize = 100,
        excludeSpam = true,
        addresses = [],
      } = options

      const url = `${trustWalletNFTCollections}?page=${page}&pageSize=${pageSize}&exclude_spam=${excludeSpam}`
      const date = new Date().toUTCString()
      const nonce = generateNonce()

      // Request body for POST request
      const body = JSON.stringify({
        addresses: addresses,
        // Add other required fields based on Trust Wallet API
      })

      const signature = generateSignature('POST', url, body, date, nonce)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          'Authorization': `HMAC-SHA256 Signature=${signature}`,
          'x-tw-credential': DEVICE_CREDENTIAL,
          'x-tw-date': date,
          'x-tw-nonce': nonce,
          'x-origin': 'Trust/2.63.1 Extension',
        },
        body: body,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch NFT collections: ${response.statusText}`)
      }

      const data = await response.json()
      setCollections(data)
      return data
    } catch (err) {
      console.error('Error fetching Trust Wallet NFT collections:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    collections,
    loading,
    error,
    fetchNFTCollections,
  }
}

