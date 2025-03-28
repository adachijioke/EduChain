"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Database, Trophy, Users } from "lucide-react"
import TutorChat from "@/components/tutor-chat"
import WalletConnect from "@/components/wallet-connect"
import { useToast } from "@/hooks/use-toast"
import { useBlockchain } from "@/components/blockchain-service"
import { useAITutor } from "@/components/ai-tutor-service"
import RateTutorDialog from "@/components/rate-tutor-dialog"
import SessionHistory from "@/components/session-history"

export default function Dashboard() {
  const { toast } = useToast()
  const { connected } = useBlockchain()
  const { tutors, activeTutor, setActiveTutor, userProgress, endCurrentSession, currentSessionId } = useAITutor()
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)

  const handleConnect = (address: string) => {
    toast({
      title: "Wallet Connected",
      description: `Successfully connected to EDU Chain with address ${address}`,
    })
  }

  const handleEndSession = () => {
    endCurrentSession()
    toast({
      title: "Session Ended",
      description: "Your tutor session has been ended successfully.",
    })
  }

  const handleRateClick = () => {
    setRatingDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-500">Manage your learning journey and AI tutors</p>
        </div>
        <WalletConnect onConnect={handleConnect} />
      </div>

      {!connected ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Connect your wallet to access AI tutors and track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To get started with the AI Tutor DAO, you need to connect your wallet to the EDU Chain network.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="tutors" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="tutors">AI Tutors</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
            <TabsTrigger value="governance">DAO Governance</TabsTrigger>
          </TabsList>

          <TabsContent value="tutors" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {tutors.map((tutor) => (
                <Card key={tutor.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle>{tutor.name}</CardTitle>
                      <CardDescription>{tutor.description}</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Satisfaction Rating</span>
                        <span className="font-medium">{tutor.satisfactionRating}%</span>
                      </div>
                      <Progress value={tutor.satisfactionRating} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Students Helped</span>
                        <span className="font-medium">{tutor.studentsHelped.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Smart Contract</span>
                        <span className="font-medium text-purple-600">{tutor.contractAddress}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => setActiveTutor(tutor)} disabled={!!activeTutor}>
                      Start Session
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {activeTutor && (
              <Card>
                <CardHeader>
                  <CardTitle>Active Tutor Session</CardTitle>
                  <CardDescription>Your current session with {activeTutor.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <TutorChat />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleEndSession}>
                    End Session
                  </Button>
                  <Button onClick={handleRateClick}>Rate Tutor</Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your achievements and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userProgress.map((progress) => (
                    <div key={progress.subject}>
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium capitalize">{progress.subject} Mastery</h3>
                        <span>{progress.progress}%</span>
                      </div>
                      <Progress value={progress.progress} className="h-2" />
                      <div className="flex justify-between mt-1 text-sm text-gray-500">
                        <span>Last session: {progress.lastSession.toLocaleDateString()}</span>
                        <span>{progress.tokensEarned} EDU earned</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="font-medium mb-4">Recent Achievements</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Completed Calculus Module 3</p>
                        <p className="text-sm text-gray-500">Earned 50 EDU Tokens</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Solved 10 Advanced Coding Challenges</p>
                        <p className="text-sm text-gray-500">Earned 75 EDU Tokens</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>Your past learning sessions and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <SessionHistory />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="governance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>DAO Governance</CardTitle>
                <CardDescription>Participate in decision-making</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Active Proposals</h3>
                      <Badge>3 Active</Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">Add New Physics AI Tutor</h4>
                          <Badge variant="outline">Voting Open</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          Proposal to add a specialized Physics tutor with quantum mechanics expertise.
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm">Vote</Button>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">Update Math Curriculum</h4>
                          <Badge variant="outline">Voting Open</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          Proposal to update the mathematics curriculum with more real-world applications.
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm">Vote</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Your Governance Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-500" />
                            <div>
                              <p className="text-sm text-gray-500">Voting Power</p>
                              <p className="text-xl font-bold">120 EDU</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-purple-500" />
                            <div>
                              <p className="text-sm text-gray-500">Proposals Created</p>
                              <p className="text-xl font-bold">2</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Create New Proposal</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <RateTutorDialog sessionId={currentSessionId} open={ratingDialogOpen} onOpenChange={setRatingDialogOpen} />
    </div>
  )
}

