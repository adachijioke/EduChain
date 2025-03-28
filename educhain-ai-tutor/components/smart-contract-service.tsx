"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { useBlockchain } from "./blockchain-service"

// Contract addresses
const CONTRACT_ADDRESSES = {
  tutorRegistry: "0x8F3...A1B2",
  studentTutorMatching: "0x7E2...C3D4",
  performanceEscrow: "0x6D1...E5F6",
  tutorDAO: "0x5C0...G7H8",
  eduToken: "0x4B9...I9J0",
}

// Define types for our smart contract service
interface SmartContractState {
  // TutorRegistry methods
  registerTutor: (name: string, subject: string, description: string) => Promise<string>
  getTutors: () => Promise<any[]>
  rateTutor: (tutorId: string, rating: number) => Promise<boolean>

  // StudentTutorMatching methods
  startSession: (tutorId: string) => Promise<string>
  endSession: (sessionId: string) => Promise<{ duration: number }>
  findBestTutorMatch: (subject: string) => Promise<string>

  // PerformanceEscrow methods
  createPayment: (sessionId: string, amount: number) => Promise<string>
  releasePayment: (paymentId: string) => Promise<{ tutorFee: number; daoFee: number }>

  // TutorDAO methods
  createProposal: (title: string, description: string, callData: string, targetContract: string) => Promise<string>
  castVote: (proposalId: string, support: boolean, voteWeight: number) => Promise<boolean>

  // General
  loading: boolean
  error: string | null
}

// Create context
const SmartContractContext = createContext<SmartContractState>({
  registerTutor: async () => "",
  getTutors: async () => [],
  rateTutor: async () => false,
  startSession: async () => "",
  endSession: async () => ({ duration: 0 }),
  findBestTutorMatch: async () => "",
  createPayment: async () => "",
  releasePayment: async () => ({ tutorFee: 0, daoFee: 0 }),
  createProposal: async () => "",
  castVote: async () => false,
  loading: false,
  error: null,
})

export const useSmartContract = () => useContext(SmartContractContext)

export function SmartContractProvider({ children }: { children: React.ReactNode }) {
  const { connected, executeSmartContract } = useBlockchain()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // TutorRegistry methods
  const registerTutor = async (name: string, subject: string, description: string) => {
    if (!connected) throw new Error("Wallet not connected")

    setLoading(true)
    setError(null)

    try {
      const result = await executeSmartContract(CONTRACT_ADDRESSES.tutorRegistry, "registerTutor", [
        name,
        subject,
        description,
      ])
      return result.tutorId
    } catch (err: any) {
      setError(err.message || "Failed to register tutor")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getTutors = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await executeSmartContract(CONTRACT_ADDRESSES.tutorRegistry, "getTutors")
      return result
    } catch (err: any) {
      setError(err.message || "Failed to get tutors")
      return []
    } finally {
      setLoading(false)
    }
  }

  const rateTutor = async (tutorId: string, rating: number) => {
    if (!connected) throw new Error("Wallet not connected")

    setLoading(true)
    setError(null)

    try {
      const result = await executeSmartContract(CONTRACT_ADDRESSES.tutorRegistry, "rateTutor", [tutorId, rating])
      return result.success
    } catch (err: any) {
      setError(err.message || "Failed to rate tutor")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // StudentTutorMatching methods
  const startSession = async (tutorId: string) => {
    if (!connected) throw new Error("Wallet not connected")

    setLoading(true)
    setError(null)

    try {
      const result = await executeSmartContract(CONTRACT_ADDRESSES.studentTutorMatching, "startSession", [tutorId])
      return result.sessionId
    } catch (err: any) {
      setError(err.message || "Failed to start session")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const endSession = async (sessionId: string) => {
    if (!connected) throw new Error("Wallet not connected")

    setLoading(true)
    setError(null)

    try {
      const result = await executeSmartContract(CONTRACT_ADDRESSES.studentTutorMatching, "endSession", [sessionId])
      return { duration: result.duration }
    } catch (err: any) {
      setError(err.message || "Failed to end session")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const findBestTutorMatch = async (subject: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await executeSmartContract(CONTRACT_ADDRESSES.studentTutorMatching, "findBestTutorMatch", [
        subject,
      ])
      return result.tutorId
    } catch (err: any) {
      setError(err.message || "Failed to find tutor match")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // PerformanceEscrow methods
  const createPayment = async (sessionId: string, amount: number) => {
    if (!connected) throw new Error("Wallet not connected")

    setLoading(true)
    setError(null)

    try {
      const result = await executeSmartContract(CONTRACT_ADDRESSES.performanceEscrow, "createPayment", [
        sessionId,
        amount,
      ])
      return result.paymentId
    } catch (err: any) {
      setError(err.message || "Failed to create payment")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const releasePayment = async (paymentId: string) => {
    if (!connected) throw new Error("Wallet not connected")

    setLoading(true)
    setError(null)

    try {
      const result = await executeSmartContract(CONTRACT_ADDRESSES.performanceEscrow, "releasePayment", [paymentId])
      return { tutorFee: result.tutorFee, daoFee: result.daoFee }
    } catch (err: any) {
      setError(err.message || "Failed to release payment")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // TutorDAO methods
  const createProposal = async (title: string, description: string, callData: string, targetContract: string) => {
    if (!connected) throw new Error("Wallet not connected")

    setLoading(true)
    setError(null)

    try {
      const result = await executeSmartContract(CONTRACT_ADDRESSES.tutorDAO, "createProposal", [
        title,
        description,
        callData,
        targetContract,
      ])
      return result.proposalId
    } catch (err: any) {
      setError(err.message || "Failed to create proposal")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const castVote = async (proposalId: string, support: boolean, voteWeight: number) => {
    if (!connected) throw new Error("Wallet not connected")

    setLoading(true)
    setError(null)

    try {
      const result = await executeSmartContract(CONTRACT_ADDRESSES.tutorDAO, "castVote", [
        proposalId,
        support,
        voteWeight,
      ])
      return result.success
    } catch (err: any) {
      setError(err.message || "Failed to cast vote")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <SmartContractContext.Provider
      value={{
        registerTutor,
        getTutors,
        rateTutor,
        startSession,
        endSession,
        findBestTutorMatch,
        createPayment,
        releasePayment,
        createProposal,
        castVote,
        loading,
        error,
      }}
    >
      {children}
    </SmartContractContext.Provider>
  )
}

