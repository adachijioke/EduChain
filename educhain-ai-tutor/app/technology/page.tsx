"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContractInteraction from "@/components/contract-interaction"
import { useBlockchain } from "@/components/blockchain-service"
import WalletConnect from "@/components/wallet-connect"

export default function TechnologyPage() {
  const { connected } = useBlockchain()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Technology</h1>
        <p className="text-xl text-gray-600">Explore the smart contracts that power the EduChain AI Tutor DAO</p>
      </div>

      {!connected ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Connect your wallet to interact with our smart contracts</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WalletConnect />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="registry" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="registry">Tutor Registry</TabsTrigger>
            <TabsTrigger value="matching">Matching Algorithm</TabsTrigger>
            <TabsTrigger value="escrow">Performance Escrow</TabsTrigger>
          </TabsList>

          <TabsContent value="registry" className="space-y-6">
            <div className="prose max-w-none mb-6">
              <h2>Tutor Registry Contract</h2>
              <p>
                Our Tutor Registry Contract manages AI tutor models and their specializations, ensuring quality and
                accountability. This contract stores information about each tutor, including their subject expertise,
                satisfaction rating, and the number of students they've helped.
              </p>
              <h3>Key Features:</h3>
              <ul>
                <li>Registration and management of AI tutors</li>
                <li>Reputation system based on student ratings</li>
                <li>Verification of tutor credentials and specializations</li>
                <li>Governance controls for quality assurance</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ContractInteraction
                contractName="Tutor Registry"
                method="getTutors"
                description="View all registered tutors on the platform"
                buttonText="View Tutors"
                successMessage="Successfully retrieved tutor information from the blockchain"
              />

              <ContractInteraction
                contractName="Tutor Registry"
                method="rateTutor"
                description="Rate a tutor based on your learning experience"
                buttonText="Submit Rating"
                successMessage="Your rating has been recorded on the blockchain"
              />
            </div>
          </TabsContent>

          <TabsContent value="matching" className="space-y-6">
            <div className="prose max-w-none mb-6">
              <h2>Student-Tutor Matching Contract</h2>
              <p>
                The Student-Tutor Matching Contract pairs students with the optimal AI tutors based on learning style
                and goals. This smart contract uses an algorithm that considers student preferences, tutor
                specializations, and past performance to create the most effective learning matches.
              </p>
              <h3>Key Features:</h3>
              <ul>
                <li>Personalized matching based on learning preferences</li>
                <li>Session management for tracking learning activities</li>
                <li>Performance analytics to improve future matches</li>
                <li>Transparent record of all tutoring sessions</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ContractInteraction
                contractName="Student-Tutor Matching"
                method="findBestTutorMatch"
                description="Find the best tutor for your learning needs"
                buttonText="Find Match"
                successMessage="Found the optimal tutor match based on your profile"
              />

              <ContractInteraction
                contractName="Student-Tutor Matching"
                method="startSession"
                description="Start a new tutoring session with an AI tutor"
                buttonText="Start Session"
                successMessage="New tutoring session started and recorded on the blockchain"
              />
            </div>
          </TabsContent>

          <TabsContent value="escrow" className="space-y-6">
            <div className="prose max-w-none mb-6">
              <h2>Performance Escrow Contract</h2>
              <p>
                Our Performance Escrow Contract holds payment until learning outcomes are verified, ensuring incentives
                are aligned. This innovative approach ensures that tutors are rewarded based on student success,
                creating a sustainable educational ecosystem with aligned incentives.
              </p>
              <h3>Key Features:</h3>
              <ul>
                <li>Secure token escrow for tutoring payments</li>
                <li>Outcome-based payment release mechanisms</li>
                <li>Verification of learning milestones</li>
                <li>Fair distribution of rewards based on performance</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ContractInteraction
                contractName="Performance Escrow"
                method="createPayment"
                description="Create a new payment for a completed session"
                buttonText="Create Payment"
                successMessage="Payment created and held in escrow until verification"
              />

              <ContractInteraction
                contractName="Performance Escrow"
                method="releasePayment"
                description="Release payment after verifying learning outcomes"
                buttonText="Release Payment"
                successMessage="Payment successfully released based on verified outcomes"
              />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

