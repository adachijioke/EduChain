"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { useBlockchain } from "./blockchain-service"
import { useToast } from "@/hooks/use-toast"
import type { WalletInfo } from "./blockchain-service"

interface WalletConnectProps {
  onConnect?: (address: string) => void
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const { connected, address, connecting, connect, disconnect, detectWallets, connectToWallet } = useBlockchain()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [wallets, setWallets] = useState<WalletInfo[]>([])
  const [loading, setLoading] = useState(false)

  // Detect available wallets when component mounts
  useEffect(() => {
    const checkWallets = async () => {
      setLoading(true)
      const availableWallets = await detectWallets()
      setWallets(availableWallets)
      setLoading(false)
    }

    checkWallets()
  }, [detectWallets])

  const handleConnectClick = () => {
    const installedWallets = wallets.filter((wallet) => wallet.installed)

    if (installedWallets.length === 0) {
      // If no wallets are installed, show dialog with options
      setOpen(true)
    } else if (installedWallets.length === 1) {
      // If only one wallet is installed, connect directly
      handleWalletSelect(installedWallets[0].name)
    } else {
      // If multiple wallets are installed, show selection dialog
      setOpen(true)
    }
  }

  const handleWalletSelect = async (walletName: string) => {
    try {
      await connectToWallet(walletName)

      // Call the onConnect callback if provided
      if (onConnect && address) {
        onConnect(address)
      }

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to EDU Chain with ${walletName}`,
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected from EDU Chain",
    })
  }

  return (
    <div>
      {connected ? (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
          <Wallet className="h-5 w-5" />
          <div>
            <p className="text-sm font-medium">Connected to EDU Chain</p>
            <p className="text-xs">{address}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={handleDisconnect}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <Button onClick={handleConnectClick} className="flex items-center gap-2" disabled={connecting || loading}>
            {connecting || loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {connecting ? "Connecting..." : "Detecting Wallets..."}
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5" />
                Connect Wallet
              </>
            )}
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect your wallet</DialogTitle>
                <DialogDescription>Select a wallet to connect to the EDU Chain network</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {wallets.map((wallet) => (
                  <Card
                    key={wallet.name}
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${!wallet.installed && "opacity-50"}`}
                    onClick={() => wallet.installed && handleWalletSelect(wallet.name)}
                  >
                    <div className="mr-4 text-2xl">{wallet.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium">{wallet.name}</h3>
                      {!wallet.installed && <p className="text-sm text-gray-500">Not installed</p>}
                    </div>
                    {wallet.installed ? (
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Install
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

