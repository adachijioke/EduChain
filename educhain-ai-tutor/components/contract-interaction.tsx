"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSmartContract } from "./smart-contract-service"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ContractInteractionProps {
  contractName: string
  method: string
  description: string
  buttonText: string
  successMessage: string
}

export default function ContractInteraction({
  contractName,
  method,
  description,
  buttonText,
  successMessage,
}: ContractInteractionProps) {
  const { loading, error } = useSmartContract()
  const [isExecuting, setIsExecuting] = useState(false)
  const { toast } = useToast()

  const handleExecute = async () => {
    setIsExecuting(true)

    try {
      // This is a simplified example - in a real app, we would call the actual method
      // For demo purposes, we'll just simulate a successful call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Success",
        description: successMessage,
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to execute contract method",
        variant: "destructive",
      })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{contractName}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          This will interact with the {contractName} smart contract on the EDU Chain network.
        </p>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleExecute} disabled={loading || isExecuting} className="w-full">
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executing...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

