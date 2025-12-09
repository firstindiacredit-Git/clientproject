import { WalletConnect } from './components/WalletConnect'
import { UserDashboard } from './components/UserDashboard'
import { useAccount } from 'wagmi'

function App() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-[#1B1B1C]">
      {!isConnected ? (
        <WalletConnect />
      ) : (
        <div className="space-y-6">
          <WalletConnect />
          <div className="flex justify-center p-4">
            <UserDashboard />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
