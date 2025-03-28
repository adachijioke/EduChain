"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Star } from "lucide-react"
import { useAITutor } from "./ai-tutor-service"
import { useToast } from "@/hooks/use-toast"

interface RateTutorDialogProps {
  sessionId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RateTutorDialog({ sessionId, open, onOpenChange }: RateTutorDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const { rateSession } = useAITutor()
  const { toast } = useToast()

  const handleRateSession = () => {
    if (sessionId && rating > 0) {
      rateSession(sessionId, rating)

      toast({
        title: "Session Rated",
        description: `You rated this session ${rating} stars. Thank you for your feedback!`,
      })

      onOpenChange(false)
      setRating(0)
      setHoveredRating(0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Tutor Session</DialogTitle>
          <DialogDescription>How would you rate your experience with this AI tutor?</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <Star
                  className={`h-10 w-10 ${
                    star <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRateSession} disabled={rating === 0}>
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

