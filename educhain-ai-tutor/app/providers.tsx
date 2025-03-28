'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { AITutorProvider } from '@/components/ai-tutor-service'
import { BlockchainProvider } from '@/components/blockchain-service'
import { SmartContractProvider } from '@/components/smart-contract-service'
import { ToastProvider } from '@/components/toast-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <BlockchainProvider>
        <SmartContractProvider>
          <AITutorProvider>
            <ToastProvider />
            {children}
          </AITutorProvider>
        </SmartContractProvider>
      </BlockchainProvider>
    </ThemeProvider>
  )
}