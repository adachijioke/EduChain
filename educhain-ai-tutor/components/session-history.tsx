"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Star } from "lucide-react"
import { useAITutor } from "./ai-tutor-service"
import RateTutorDialog from "./rate-tutor-dialog"

export default function SessionHistory() {
  const { sessionLogs } = useAITutor()
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  const handleRateSession = (sessionId: string) => {
    setSelectedSessionId(sessionId)
    setRatingDialogOpen(true)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  return (
    <>
      <div className="space-y-4">
        {sessionLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No session history yet. Start a session with an AI tutor to see your history.
          </div>
        ) : (
          sessionLogs.map((session) => (
            <Card key={session.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{session.tutorName}</CardTitle>
                    <CardDescription>
                      <span className="capitalize">{session.subject}</span> session
                    </CardDescription>
                  </div>
                  {session.rating ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <Star className="h-3 w-3 mr-1 fill-green-800" />
                      {session.rating}/5
                    </Badge>
                  ) : session.endTime ? (
                    <Button variant="outline" size="sm" onClick={() => handleRateSession(session.id)}>
                      Rate Session
                    </Button>
                  ) : (
                    <Badge>Active</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(session.startTime)}
                  </div>
                  {session.duration && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDuration(session.duration)}
                    </div>
                  )}
                  {session.tokensEarned && (
                    <div className="ml-auto font-medium text-purple-600">+{session.tokensEarned} EDU Tokens</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <RateTutorDialog sessionId={selectedSessionId} open={ratingDialogOpen} onOpenChange={setRatingDialogOpen} />
    </>
  )
}

