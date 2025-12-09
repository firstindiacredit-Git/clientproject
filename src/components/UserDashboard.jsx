import { useAccount, useBalance, useEnsName, useEnsAvatar } from 'wagmi'
import { formatEther } from 'viem'
import { useState, useEffect } from 'react'
import { useTrustWalletMarketData } from '../hooks/useTrustWalletMarketData'
import { useTrustWalletBTCBalance } from '../hooks/useTrustWalletBTCBalance'
import { useTrustWalletBTCAddress } from '../hooks/useTrustWalletBTCAddress'
import { useTrustWalletStablecoinConfig } from '../hooks/useTrustWalletStablecoinConfig'
import { useBNBChainValidators } from '../hooks/useBNBChainValidators'

export function UserDashboard() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })
  const { data: ensName } = useEnsName({
    address: address,
  })
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
  })
  const { marketData, loading: marketLoading, error: marketError } = useTrustWalletMarketData()
  const { fetchAddress: fetchBTCAddress, addressData: btcAddressData, loading: btcLoading, error: btcError } = useTrustWalletBTCAddress()
  const { config: stablecoinConfig, loading: stablecoinLoading, error: stablecoinError } = useTrustWalletStablecoinConfig()
  const { validators: bnbValidators, total: bnbValidatorsTotal, loading: bnbValidatorsLoading, error: bnbValidatorsError } = useBNBChainValidators(100, 0)
  const [btcAddress, setBtcAddress] = useState('bc1q4hsjyr0u9w63pcl4q493nrguln4h5tnlxudv6z') // Default BTC address

  // Fetch BTC address data when user connects
  useEffect(() => {
    if (isConnected && address) {
      // When user connects, fetch their BTC address data
      // Note: In production, you would derive BTC address from user's wallet
      fetchBTCAddress(btcAddress, 'basic')
    }
  }, [isConnected, address, btcAddress, fetchBTCAddress])

  if (!isConnected || !address) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Dashboard</h2>
        <div className="border-t pt-4">
          <div className="flex items-center mb-4">
            {ensAvatar && (
              <img
                src={ensAvatar}
                alt="ENS Avatar"
                className="w-16 h-16 rounded-full mr-4"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {ensName || 'Anonymous User'}
              </h3>
              <p className="text-sm text-gray-500 font-mono break-all">
                {address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
          <p className="text-2xl font-bold text-blue-600">
            {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : 'Loading...'}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Network</p>
          <p className="text-2xl font-bold text-green-600">
            {balance?.symbol || 'ETH'}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Wallet Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-semibold text-green-600">Connected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Wallet Type:</span>
            <span className="font-semibold">Trust Wallet</span>
          </div>
        </div>
      </div>

      {/* Market Data Section */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Market Data</h4>
        {marketLoading ? (
          <p className="text-sm text-gray-600">Loading market data...</p>
        ) : marketError ? (
          <p className="text-sm text-red-600">Error loading market data: {marketError}</p>
        ) : marketData ? (
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">
              Market data loaded successfully
              {marketData && typeof marketData === 'object' && (
                <span className="ml-2 text-green-600">
                  ({Object.keys(marketData).length} items)
                </span>
              )}
            </p>
            {marketData && Array.isArray(marketData) && marketData.length > 0 && (
              <div className="mt-3 max-h-48 overflow-y-auto">
                {marketData.slice(0, 5).map((ticker, index) => (
                  <div key={index} className="p-2 bg-white rounded mb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{ticker.symbol || ticker.name || `Ticker ${index + 1}`}</span>
                      {ticker.price && (
                        <span className="text-green-600">${parseFloat(ticker.price).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No market data available</p>
        )}
      </div>

      {/* Bitcoin Address Data Section */}
      <div className="mt-6 p-4 bg-orange-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Bitcoin Address Data</h4>
        <div className="mb-3">
          <input
            type="text"
            value={btcAddress}
            onChange={(e) => setBtcAddress(e.target.value)}
            placeholder="Enter BTC address"
            className="w-full p-2 border rounded-lg text-sm"
          />
          <button
            onClick={() => fetchBTCAddress(btcAddress, 'basic')}
            disabled={btcLoading || !btcAddress}
            className="mt-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            {btcLoading ? 'Loading...' : 'Fetch BTC Data'}
          </button>
        </div>
        {btcLoading ? (
          <p className="text-sm text-gray-600">Loading BTC address data...</p>
        ) : btcError ? (
          <p className="text-sm text-red-600">Error: {btcError}</p>
        ) : btcAddressData ? (
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-white rounded">
              <p className="font-medium text-gray-800">Address: {btcAddressData.address || btcAddress}</p>
              {btcAddressData.balance !== undefined && (
                <p className="text-gray-600 mt-1">
                  Balance: {btcAddressData.balance / 100000000} BTC
                </p>
              )}
              {btcAddressData.txs !== undefined && (
                <p className="text-gray-600">Transactions: {btcAddressData.txs}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Enter BTC address and click Fetch to load data</p>
        )}
      </div>

      {/* Stablecoin Invest Config Section */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Stablecoin Invest Config</h4>
        {stablecoinLoading ? (
          <p className="text-sm text-gray-600">Loading stablecoin config...</p>
        ) : stablecoinError ? (
          <p className="text-sm text-red-600">Error loading stablecoin config: {stablecoinError}</p>
        ) : stablecoinConfig ? (
          <div className="space-y-4 text-sm">
            {/* Angle Routers */}
            {stablecoinConfig.angle_routers && stablecoinConfig.angle_routers.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700 mb-2">Angle Routers ({stablecoinConfig.angle_routers.length})</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {stablecoinConfig.angle_routers.map((router, index) => (
                    <div key={index} className="p-2 bg-white rounded text-xs">
                      <p className="font-medium">Chain ID: {router.chain_id}</p>
                      <p className="text-gray-600 font-mono break-all">Address: {router.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vaults */}
            {stablecoinConfig.vaults && stablecoinConfig.vaults.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700 mb-2">Available Vaults ({stablecoinConfig.vaults.length})</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {stablecoinConfig.vaults.slice(0, 10).map((vault, index) => (
                    <div key={index} className="p-3 bg-white rounded">
                      <div className="flex items-start gap-2">
                        {vault.icon_url && (
                          <img src={vault.icon_url} alt={vault.protocol_name} className="w-8 h-8 rounded" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{vault.protocol_name}</p>
                          {vault.subtitle && <p className="text-xs text-gray-500">{vault.subtitle}</p>}
                          <p className="text-xs text-gray-600 mt-1">{vault.description.substring(0, 100)}...</p>
                          <div className="mt-2 flex gap-2 text-xs">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Chain: {vault.chain_id}</span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Type: {vault.type}</span>
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{vault.provider}</span>
                          </div>
                          <p className="text-xs text-gray-500 font-mono mt-1 break-all">Vault: {vault.vault_id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {stablecoinConfig.vaults.length > 10 && (
                    <p className="text-xs text-gray-500 text-center">... and {stablecoinConfig.vaults.length - 10} more vaults</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No stablecoin config available</p>
        )}
      </div>

      {/* BNB Chain Validators Section */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">BNB Chain Staking Validators</h4>
        {bnbValidatorsLoading ? (
          <p className="text-sm text-gray-600">Loading validators...</p>
        ) : bnbValidatorsError ? (
          <p className="text-sm text-red-600">Error loading validators: {bnbValidatorsError}</p>
        ) : bnbValidators && bnbValidators.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Total Validators: <span className="font-semibold text-gray-800">{bnbValidatorsTotal}</span>
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {bnbValidators.slice(0, 10).map((validator, index) => (
                <div key={index} className="p-3 bg-white rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{validator.moniker || `Validator ${index + 1}`}</p>
                      <p className="text-xs text-gray-500">Status: {validator.status}</p>
                    </div>
                    {validator.apy !== undefined && (
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">
                          APY: {(validator.apy * 100).toFixed(2)}%
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div>
                      <span className="text-gray-600">Commission:</span>
                      <span className="ml-1 font-medium">{(validator.commission / 100).toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Delegators:</span>
                      <span className="ml-1 font-medium">{validator.delegatorCount || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Mining Status:</span>
                      <span className="ml-1 font-medium">{validator.miningStatus || 'N/A'}</span>
                    </div>
                    {validator.totalStaked && (
                      <div>
                        <span className="text-gray-600">Total Staked:</span>
                        <span className="ml-1 font-medium text-xs">
                          {(parseFloat(validator.totalStaked) / 1e18).toFixed(2)} BNB
                        </span>
                      </div>
                    )}
                  </div>
                  {validator.operatorAddress && (
                    <p className="text-xs text-gray-500 font-mono mt-2 break-all">
                      Operator: {validator.operatorAddress}
                    </p>
                  )}
                </div>
              ))}
              {bnbValidators.length > 10 && (
                <p className="text-xs text-gray-500 text-center">
                  ... and {bnbValidators.length - 10} more validators
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">No validators available</p>
        )}
      </div>
    </div>
  )
}

