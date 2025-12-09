import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Import walletConfig to initialize wagmi config
import '../config/walletConfig'
import { wagmiConfig } from '../config/walletConfig'

const queryClient = new QueryClient()

export function WalletProvider({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

