"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

// Add window.ethereum type
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      isCoinbaseWallet?: boolean
      request?: (...args: any[]) => Promise<any>
      [key: string]: any
    }
  }
}

// Define types for our blockchain service
interface BlockchainState {
  connected: boolean
  address: string | null
  balance: string
  network: string
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  detectWallets: () => Promise<WalletInfo[]>
  connectToWallet: (walletName: string) => Promise<void>
  executeSmartContract: (contractAddress: string, method: string, params?: any[]) => Promise<any>
}

export type WalletInfo = {
  name: string
  icon: string
  installed: boolean
  provider?: any
}

// Create context
const BlockchainContext = createContext<BlockchainState>({
  connected: false,
  address: null,
  balance: "0",
  network: "EDU Chain",
  connecting: false,
  connect: async () => {},
  disconnect: () => {},
  detectWallets: async () => [],
  connectToWallet: async () => {},
  executeSmartContract: async () => null,
})

export const useBlockchain = () => useContext(BlockchainContext)

export function BlockchainProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [network, setNetwork] = useState("EDU Chain")
  const [connecting, setConnecting] = useState(false)

  // Detect available wallets in the browser
  const detectWallets = async (): Promise<WalletInfo[]> => {
    const wallets: WalletInfo[] = [
      { name: "MetaMask", icon: "🦊", installed: false },
      { name: "Coinbase Wallet", icon: "🔵", installed: false },
      { name: "WalletConnect", icon: "🔗", installed: true }, // Always available as fallback
      { name: "Trust Wallet", icon: "🛡️", installed: false },
      { name: "Phantom", icon: "👻", installed: false },
    ]

    // Check for MetaMask
    if (typeof window !== "undefined" && window.ethereum) {
      if (window.ethereum.isMetaMask) {
        wallets[0].installed = true
        wallets[0].provider = window.ethereum
      }

      // Check for Coinbase Wallet
      if (window.ethereum.isCoinbaseWallet) {
        wallets[1].installed = true
        wallets[1].provider = window.ethereum
      }
    }

    return wallets
  }

  // Connect to a specific wallet
  const connectToWallet = async (walletName: string) => {
    setConnecting(true)

    try {
      // In a real implementation, we would:
      // 1. Get the provider for the selected wallet
      // 2. Request accounts
      // 3. Handle the connection

      // For demo purposes, simulate connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const randomAddress = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
      setAddress(randomAddress)
      setBalance("100.00")
      setConnected(true)
    } catch (error) {
      console.error("Error connecting to wallet:", error)
    } finally {
      setConnecting(false)
    }
  }

  // General connect function (will detect and prompt for wallet selection)
  const connect = async () => {
    const availableWallets = await detectWallets()
    const installedWallets = availableWallets.filter((wallet) => wallet.installed)

    if (installedWallets.length === 1) {
      // If only one wallet is installed, connect to it directly
      await connectToWallet(installedWallets[0].name)
    } else if (installedWallets.length > 1) {
      // If multiple wallets are installed, this will be handled by the UI
      // The UI will show a wallet selection dialog
      return
    } else {
      // If no wallets are installed, connect to WalletConnect
      await connectToWallet("WalletConnect")
    }
  }

  const disconnect = () => {
    setConnected(false)
    setAddress(null)
    setBalance("0")
  }

  // Execute a smart contract method
  const executeSmartContract = async (contractAddress: string, method: string, params: any[] = []) => {
    if (!connected) {
      throw new Error("Wallet not connected")
    }

    // In a real implementation, we would:
    // 1. Create a contract instance
    // 2. Call the method with params
    // 3. Return the result

    // For demo purposes, simulate contract execution
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock responses for different contract methods
    switch (method) {
      case "getTutors":
        return [
          { id: "1", name: "Math Tutor", subject: "math", rating: 98 },
          { id: "2", name: "Coding Tutor", subject: "coding", rating: 95 },
          { id: "3", name: "Science Tutor", subject: "science", rating: 92 },
        ]
      case "startSession":
        return { sessionId: `session-${Date.now()}`, success: true }
      case "endSession":
        return { success: true, duration: Math.floor(Math.random() * 60) + 30 }
      case "rateSession":
        return { success: true, tokensEarned: params[1] * 5 } // rating * 5
      default:
        return { success: false, error: "Method not supported" }
    }
  }

  // Add window.ethereum type for TypeScript
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.ethereum = window.ethereum || {}
    }
  }, [])

  return (
    <BlockchainContext.Provider
      value={{
        connected,
        address,
        balance,
        network,
        connecting,
        connect,
        disconnect,
        detectWallets,
        connectToWallet,
        executeSmartContract,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  )
}

