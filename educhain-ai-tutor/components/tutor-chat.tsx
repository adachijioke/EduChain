"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Loader2 } from 'lucide-react'
import { useAITutor } from "./ai-tutor-service"

type Message = {
  id: string
  content: string
  sender: "user" | "tutor"
  timestamp: Date
}

export default function TutorChat() {
  const { activeTutor } = useAITutor()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat with appropriate greeting based on tutor type
  useEffect(() => {
    if (activeTutor) {
      const initialMessage: Message = {
        id: Date.now().toString(),
        content: getInitialGreeting(activeTutor.subject),
        sender: "tutor",
        timestamp: new Date(),
      }
      setMessages([initialMessage])
    }
  }, [activeTutor])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getInitialGreeting = (subject: string): string => {
    switch (subject) {
      case "math":
        return "Hello! I'm your Math AI Tutor. I can help with calculus, algebra, geometry, statistics, and more. What would you like to learn today?"
      case "coding":
        return "Hi there! I'm your Coding AI Tutor. I specialize in JavaScript, Python, React, and other programming languages and frameworks. What coding challenge are you working on?"
      case "science":
        return "Welcome! I'm your Science AI Tutor. I can help with physics, chemistry, biology, and other scientific disciplines. What scientific topic would you like to explore today?"
      default:
        return `Hello! I'm your ${subject.charAt(0).toUpperCase() + subject.slice(1)} AI Tutor. How can I assist you today?`
    }
  }

  const generateResponse = (userInput: string): string => {
    if (!activeTutor) return "Please select a tutor first."

    // Convert to lowercase for easier matching
    const input = userInput.toLowerCase()

    // Math Tutor responses
    if (activeTutor.subject === "math") {
      // Check if it's a math calculation
      if (/[0-9+\-*/^()]+/.test(input) && /[+\-*/^]/.test(input)) {
        try {
          // Replace ^ with ** for exponentiation
          const sanitizedInput = input.replace(/\^/g, "**")
          // Use Function constructor to safely evaluate the expression
          const result = new Function(`return ${sanitizedInput}`)()
          return `The result of ${userInput} is ${result}.`
        } catch (error) {
          return `I'm having trouble calculating that expression. Could you check the format and try again?`
        }
      }

      if (input.includes("derivative")) {
        return "The derivative measures the rate of change of a function with respect to a variable. For a function f(x), the derivative is written as f'(x) or df/dx. Would you like me to explain how to find derivatives of specific functions?"
      } else if (input.includes("integral")) {
        return "Integration is the reverse of differentiation. It helps us find the area under a curve or the original function from its derivative. Would you like to learn about definite or indefinite integrals?"
      } else if (input.includes("limit")) {
        return "Limits describe the behavior of a function as its input approaches a particular value. They're fundamental to calculus and help us understand continuity and derivatives. Do you need help with a specific limit problem?"
      } else if (input.includes("algebra")) {
        return "Algebra is a branch of mathematics dealing with symbols and the rules for manipulating these symbols. It's the foundation for solving equations and understanding relationships between variables. What specific algebraic concept are you interested in?"
      } else if (input.includes("calculus")) {
        return "Calculus is the mathematical study of continuous change. The two main branches are differential calculus (concerning rates of change and slopes of curves) and integral calculus (concerning accumulation of quantities and areas under curves). Which aspect would you like to explore?"
      } else if (input.includes("equation")) {
        return "I can help you solve various types of equations. Could you provide the specific equation you're working with? For example, is it a linear equation, quadratic equation, or something else?"
      } else if (input.includes("probability")) {
        return "Probability theory is the branch of mathematics that deals with analyzing random phenomena. The probability of an event is a number between 0 and 1, where 0 indicates impossibility and 1 indicates certainty. What specific probability concept would you like to learn about?"
      } else if (input.includes("statistics")) {
        return "Statistics involves collecting, analyzing, interpreting, and presenting data. It helps us make sense of large amounts of information and draw meaningful conclusions. Are you interested in descriptive statistics, inferential statistics, or a specific statistical test?"
      }
    }

    // Coding Tutor responses
    else if (activeTutor.subject === "coding") {
      if (input.includes("javascript") || input.includes("js")) {
        return "JavaScript is a versatile programming language primarily used for web development. It allows you to add interactive elements to websites. Would you like to learn about variables, functions, objects, or perhaps more advanced concepts like closures or promises?"
      } else if (input.includes("python")) {
        return "Python is known for its readability and simplicity, making it great for beginners and powerful enough for professionals. It's widely used in data science, AI, web development, and automation. What specific Python concept would you like to explore?"
      } else if (input.includes("react")) {
        return "React is a JavaScript library for building user interfaces, particularly single-page applications. It's all about components, state management, and efficient DOM updates. Would you like to learn about components, hooks, or state management in React?"
      } else if (input.includes("html") || input.includes("css")) {
        return "HTML and CSS are the building blocks of web pages. HTML provides the structure, while CSS handles the styling. What specific aspect of web development are you interested in learning about?"
      } else if (input.includes("algorithm") || input.includes("data structure")) {
        return "Algorithms and data structures are fundamental to computer science and efficient programming. They help solve problems in optimal ways. Would you like to learn about sorting algorithms, search algorithms, or specific data structures like arrays, linked lists, trees, or graphs?"
      } else if (input.includes("api")) {
        return "APIs (Application Programming Interfaces) allow different software applications to communicate with each other. They define the methods and data formats that applications can use to request and exchange information. Would you like to learn about RESTful APIs, GraphQL, or how to consume APIs in a specific language?"
      } else if (input.includes("database") || input.includes("sql")) {
        return "Databases are organized collections of data stored and accessed electronically. SQL (Structured Query Language) is used to communicate with relational databases. Would you like to learn about database design, SQL queries, or specific database systems like MySQL, PostgreSQL, or MongoDB?"
      } else if (input.includes("function")) {
        return "Functions are blocks of reusable code designed to perform a specific task. They help organize code, reduce repetition, and improve maintainability. Would you like to learn about function parameters, return values, scope, or more advanced concepts like higher-order functions or recursion?"
      }
    }

    // Science Tutor responses
    else if (activeTutor.subject === "science") {
      if (input.includes("physics")) {
        return "Physics is the natural science that studies matter, its motion and behavior through space and time, and the related entities of energy and force. Would you like to explore mechanics, thermodynamics, electromagnetism, quantum physics, or another branch of physics?"
      } else if (input.includes("chemistry")) {
        return "Chemistry is the scientific study of the properties and behavior of matter. It involves the study of atoms, molecules, and their interactions. Are you interested in organic chemistry, inorganic chemistry, biochemistry, or another area?"
      } else if (input.includes("biology")) {
        return "Biology is the natural science that studies life and living organisms. This includes their physical structure, chemical processes, molecular interactions, physiological mechanisms, development, and evolution. What aspect of biology would you like to explore?"
      } else if (input.includes("astronomy") || input.includes("space")) {
        return "Astronomy is the study of everything in the universe beyond Earth's atmosphere. This includes planets, stars, galaxies, and the properties of space itself. What celestial objects or cosmic phenomena are you curious about?"
      } else if (input.includes("science")) {
        return "Science encompasses a vast range of disciplines that seek to understand the natural world through observation and experimentation. The main branches include physics, chemistry, biology, and earth sciences. Which scientific field would you like to explore further?"
      } else if (input.includes("element") || input.includes("periodic table")) {
        return "The periodic table organizes all known chemical elements based on their properties and atomic structure. Each element has a unique atomic number, symbol, and set of chemical properties. Would you like to learn about a specific element or about the organization of the periodic table?"
      } else if (input.includes("evolution")) {
        return "Evolution is the process by which different kinds of living organisms developed from earlier forms during the history of the Earth. The theory of evolution by natural selection was proposed by Charles Darwin and explains how species adapt to their environment over time. What specific aspect of evolution would you like to explore?"
      } else if (input.includes("climate") || input.includes("environment")) {
        return "Climate science studies long-term weather patterns and how they affect the Earth and its ecosystems. Environmental science is an interdisciplinary field that integrates physical, biological, and information sciences to study the environment and find solutions to environmental problems. What specific topic within climate or environmental science interests you?"
      }
    }

    // Generic responses for all tutors
    if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return `Hello there! I'm your ${activeTutor.name}. How can I help you today?`
    } else if (input.includes("thank")) {
      return "You're welcome! If you have any more questions, feel free to ask. I'm here to help you succeed in your learning journey."
    } else if (input.includes("i am") || input.includes("my name is") || input.includes("i'm")) {
      const nameMatch = userInput.match(/i am (.*)|my name is (.*)|i'm (.*)/i)
      if (nameMatch) {
        const name = nameMatch[1] || nameMatch[2] || nameMatch[3]
        return `Nice to meet you${name ? `, ${name}` : ""}! I'm your ${activeTutor.name}. What would you like to learn about today?`
      }
    } else if (input === "wow" || input === "cool" || input === "amazing") {
      return `I'm glad you're enthusiastic! Is there a specific topic in ${activeTutor.subject} you'd like to explore further?`
    } else if (input.includes("how are you")) {
      return `I'm functioning well, thank you for asking! I'm here to help you with ${activeTutor.subject}. What would you like to learn today?`
    } else if (input.includes("who are you")) {
      return `I'm an AI tutor specialized in ${activeTutor.subject}, part of the EduChain AI Tutor DAO. I'm designed to help students learn and understand concepts in ${activeTutor.subject} through personalized instruction. How can I assist you today?`
    } else if (input.includes("help")) {
      return `I'd be happy to help you with ${activeTutor.subject}! To get started, you can ask me specific questions about topics you're studying, request explanations of concepts, or ask for help solving problems. What specific aspect of ${activeTutor.subject} would you like assistance with?`
    } else if (input.includes("explain")) {
      return `I'd be happy to explain concepts related to ${activeTutor.subject}. Could you specify which topic or concept you'd like me to explain in more detail?`
    }

    // Default response based on tutor type
    return `I understand you're asking about "${userInput}". As your ${activeTutor.name}, I'd be happy to help with this. Could you provide more specific details about what you'd like to learn? I can explain concepts, solve problems, or provide practice exercises related to ${activeTutor.subject}.`
  }

  const handleSend = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Generate AI response with a realistic delay
    setTimeout(
      () => {
        const response = generateResponse(userMessage.content)

        const tutorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: "tutor",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, tutorMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds for realism
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}
            >
              {message.sender === "tutor" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Tutor" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div>
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-zinc-600 text-white rounded-tr-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {message.content}
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
              {message.sender === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex flex-row items-start gap-2 max-w-[80%]">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Tutor" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="p-3 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Typing...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3 bg-white">
        <div className="flex items-center gap-2">
          <Input
            placeholder={`Ask your ${activeTutor?.name || "tutor"} a question...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={input.trim() === "" || isTyping}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}