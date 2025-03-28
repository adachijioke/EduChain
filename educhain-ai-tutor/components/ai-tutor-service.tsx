"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useBlockchain } from "./blockchain-service"

// Define the types for our AI service
export type TutorSubject = "math" | "coding" | "science" | "language" | "history"

export interface TutorModel {
  id: string
  name: string
  subject: TutorSubject
  description: string
  satisfactionRating: number
  studentsHelped: number
  isActive: boolean
  contractAddress?: string
}

export interface UserProgress {
  subject: TutorSubject
  progress: number
  lastSession: Date
  tokensEarned: number
}

export interface SessionLog {
  id: string
  tutorId: string
  tutorName: string
  subject: TutorSubject
  startTime: Date
  endTime?: Date
  duration?: number
  rating?: number
  tokensEarned?: number
}

interface AITutorContextType {
  tutors: TutorModel[]
  activeTutor: TutorModel | null
  setActiveTutor: (tutor: TutorModel | null) => void
  userProgress: UserProgress[]
  sessionLogs: SessionLog[]
  loading: boolean
  rateSession: (sessionId: string, rating: number) => void
  endCurrentSession: () => void
  currentSessionId: string | null
}

const AITutorContext = createContext<AITutorContextType>({
  tutors: [],
  activeTutor: null,
  setActiveTutor: () => {},
  userProgress: [],
  sessionLogs: [],
  loading: true,
  rateSession: () => {},
  endCurrentSession: () => {},
  currentSessionId: null,
})

export const useAITutor = () => useContext(AITutorContext)

// Mock data for AI tutors
const mockTutors: TutorModel[] = [
  {
    id: "1",
    name: "Math Tutor",
    subject: "math",
    description: "Advanced calculus and algebra",
    satisfactionRating: 98,
    studentsHelped: 1245,
    isActive: true,
    contractAddress: "0x8F3...A1B2",
  },
  {
    id: "2",
    name: "Coding Tutor",
    subject: "coding",
    description: "JavaScript and Python",
    satisfactionRating: 95,
    studentsHelped: 2187,
    isActive: true,
    contractAddress: "0x7E2...C3D4",
  },
  {
    id: "3",
    name: "Science Tutor",
    subject: "science",
    description: "Physics and Chemistry",
    satisfactionRating: 92,
    studentsHelped: 876,
    isActive: true,
    contractAddress: "0x6D1...E5F6",
  },
]

// Mock data for user progress
const mockUserProgress: UserProgress[] = [
  {
    subject: "math",
    progress: 75,
    lastSession: new Date(Date.now() - 86400000 * 2), // 2 days ago
    tokensEarned: 50,
  },
  {
    subject: "coding",
    progress: 90,
    lastSession: new Date(Date.now() - 86400000 * 5), // 5 days ago
    tokensEarned: 75,
  },
  {
    subject: "science",
    progress: 60,
    lastSession: new Date(Date.now() - 86400000 * 1), // 1 day ago
    tokensEarned: 30,
  },
]

// Mock data for session logs
const mockSessionLogs: SessionLog[] = [
  {
    id: "session1",
    tutorId: "1",
    tutorName: "Math Tutor",
    subject: "math",
    startTime: new Date(Date.now() - 86400000 * 2),
    endTime: new Date(Date.now() - 86400000 * 2 + 3600000),
    duration: 60,
    rating: 5,
    tokensEarned: 15,
  },
  {
    id: "session2",
    tutorId: "2",
    tutorName: "Coding Tutor",
    subject: "coding",
    startTime: new Date(Date.now() - 86400000 * 5),
    endTime: new Date(Date.now() - 86400000 * 5 + 7200000),
    duration: 120,
    rating: 4,
    tokensEarned: 25,
  },
  {
    id: "session3",
    tutorId: "3",
    tutorName: "Science Tutor",
    subject: "science",
    startTime: new Date(Date.now() - 86400000 * 1),
    endTime: new Date(Date.now() - 86400000 * 1 + 1800000),
    duration: 30,
    rating: 5,
    tokensEarned: 10,
  },
]

export function AITutorProvider({ children }: { children: React.ReactNode }) {
  const { connected, address } = useBlockchain()
  const [tutors, setTutors] = useState<TutorModel[]>([])
  const [activeTutor, setActiveTutor] = useState<TutorModel | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  // Simulate fetching tutors from blockchain
  useEffect(() => {
    const fetchTutors = async () => {
      // In a real implementation, we would fetch from the blockchain
      // For demo purposes, we'll use mock data with a delay
      setTimeout(() => {
        setTutors(mockTutors)
        setLoading(false)
      }, 1000)
    }

    fetchTutors()
  }, [])

  // Simulate fetching user progress and session logs when wallet is connected
  useEffect(() => {
    if (connected && address) {
      // In a real implementation, we would fetch from the blockchain
      setUserProgress(mockUserProgress)
      setSessionLogs(mockSessionLogs)
    } else {
      setUserProgress([])
      setSessionLogs([])
    }
  }, [connected, address])

  // Start a new session when a tutor is activated
  useEffect(() => {
    if (activeTutor) {
      const newSessionId = `session-${Date.now()}`
      const newSession: SessionLog = {
        id: newSessionId,
        tutorId: activeTutor.id,
        tutorName: activeTutor.name,
        subject: activeTutor.subject,
        startTime: new Date(),
      }

      setSessionLogs((prev) => [newSession, ...prev])
      setCurrentSessionId(newSessionId)
    } else {
      setCurrentSessionId(null)
    }
  }, [activeTutor])

  // End the current session
  const endCurrentSession = () => {
    if (currentSessionId && activeTutor) {
      setSessionLogs((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                endTime: new Date(),
                duration: Math.floor((Date.now() - session.startTime.getTime()) / 60000), // duration in minutes
              }
            : session,
        ),
      )

      // Update user progress
      setUserProgress((prev) =>
        prev.map((progress) =>
          progress.subject === activeTutor.subject
            ? {
                ...progress,
                lastSession: new Date(),
                progress: Math.min(100, progress.progress + 5), // Increment progress
              }
            : progress,
        ),
      )

      setActiveTutor(null)
    }
  }

  // Rate a session
  const rateSession = (sessionId: string, rating: number) => {
    // Update session with rating
    setSessionLogs((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              rating,
              tokensEarned: rating * 5, // Simple calculation: 5 tokens per star
            }
          : session,
      ),
    )

    // Find the session to update progress
    const session = sessionLogs.find((s) => s.id === sessionId)
    if (session) {
      // Update user progress with tokens earned
      setUserProgress((prev) =>
        prev.map((progress) =>
          progress.subject === session.subject
            ? {
                ...progress,
                tokensEarned: progress.tokensEarned + rating * 5,
              }
            : progress,
        ),
      )
    }
  }

  return (
    <AITutorContext.Provider
      value={{
        tutors,
        activeTutor,
        setActiveTutor,
        userProgress,
        sessionLogs,
        loading,
        rateSession,
        endCurrentSession,
        currentSessionId,
      }}
    >
      {children}
    </AITutorContext.Provider>
  )
}

