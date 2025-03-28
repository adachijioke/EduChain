// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { ArrowRight, BookOpen, Brain, Coins, Users } from "lucide-react"

// export default function About() {
//   return (
//     <div className="container mx-auto px-4 py-12">
//       <div className="max-w-3xl mx-auto mb-12 text-center">
//         <h1 className="text-4xl font-bold mb-4">About EduChain AI Tutor DAO</h1>
//         <p className="text-xl text-gray-600">
//           Revolutionizing education through decentralized AI tutoring with aligned incentives
//         </p>
//       </div>

//       <div className="grid md:grid-cols-2 gap-12 mb-16">
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
//           <p className="text-gray-600 mb-4">
//             We believe that quality education should be accessible to everyone, regardless of location or economic
//             status. By combining the power of artificial intelligence with blockchain technology, we're creating a new
//             paradigm for educational experiences that are personalized, effective, and economically sustainable.
//           </p>
//           <p className="text-gray-600">
//             The EduChain AI Tutor DAO is more than just a platform—it's a community-owned educational ecosystem where
//             incentives are perfectly aligned between students, educators, and AI developers to maximize learning
//             outcomes.
//           </p>
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <Card>
//             <CardHeader className="pb-2">
//               <Brain className="h-8 w-8 text-purple-600 mb-2" />
//               <CardTitle>AI Tutoring</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600">Personalized learning experiences powered by specialized AI models</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <Users className="h-8 w-8 text-purple-600 mb-2" />
//               <CardTitle>DAO Governance</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600">Community-driven decision making for continuous improvement</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <Coins className="h-8 w-8 text-purple-600 mb-2" />
//               <CardTitle>Tokenomics</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600">Economic incentives aligned with educational outcomes</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
//               <CardTitle>Learning Paths</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600">Customized curriculum based on individual goals and progress</p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div className="mb-16">
//         <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
//         <div className="max-w-4xl mx-auto">
//           <div className="relative">
//             {/* Timeline line */}
//             <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-200"></div>

//             {/* Timeline items */}
//             <div className="relative z-10">
//               <div className="flex flex-col md:flex-row items-center mb-12">
//                 <div className="md:w-1/2 md:pr-12 mb-4 md:mb-0 md:text-right">
//                   <h3 className="text-xl font-bold mb-2">Student Registration</h3>
//                   <p className="text-gray-600">
//                     Students connect their wallet and create a learning profile with goals and preferences
//                   </p>
//                 </div>
//                 <div className="bg-purple-600 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
//                   1
//                 </div>
//                 <div className="md:w-1/2 md:pl-12 md:text-left"></div>
//               </div>

//               <div className="flex flex-col md:flex-row items-center mb-12">
//                 <div className="md:w-1/2 md:pr-12 mb-4 md:mb-0 md:text-right"></div>
//                 <div className="bg-purple-600 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
//                   2
//                 </div>
//                 <div className="md:w-1/2 md:pl-12 md:text-left">
//                   <h3 className="text-xl font-bold mb-2">AI Tutor Matching</h3>
//                   <p className="text-gray-600">
//                     Smart contracts match students with the most suitable AI tutors based on their needs
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-col md:flex-row items-center mb-12">
//                 <div className="md:w-1/2 md:pr-12 mb-4 md:mb-0 md:text-right">
//                   <h3 className="text-xl font-bold mb-2">Learning Sessions</h3>
//                   <p className="text-gray-600">
//                     Students engage with AI tutors through interactive sessions with real-time feedback
//                   </p>
//                 </div>
//                 <div className="bg-purple-600 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
//                   3
//                 </div>
//                 <div className="md:w-1/2 md:pl-12 md:text-left"></div>
//               </div>

//               <div className="flex flex-col md:flex-row items-center mb-12">
//                 <div className="md:w-1/2 md:pr-12 mb-4 md:mb-0 md:text-right"></div>
//                 <div className="bg-purple-600 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
//                   4
//                 </div>
//                 <div className="md:w-1/2 md:pl-12 md:text-left">
//                   <h3 className="text-xl font-bold mb-2">Performance Verification</h3>
//                   <p className="text-gray-600">
//                     Smart contracts verify learning outcomes through assessments and progress tracking
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-col md:flex-row items-center">
//                 <div className="md:w-1/2 md:pr-12 mb-4 md:mb-0 md:text-right">
//                   <h3 className="text-xl font-bold mb-2">Token Rewards</h3>
//                   <p className="text-gray-600">
//                     Students earn tokens for achievements, tutors earn based on student success
//                   </p>
//                 </div>
//                 <div className="bg-purple-600 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
//                   5
//                 </div>
//                 <div className="md:w-1/2 md:pl-12 md:text-left"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-purple-50 rounded-xl p-8 text-center mb-16">
//         <h2 className="text-2xl font-bold mb-4">Technical Architecture</h2>
//         <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
//           Our platform is built on EDU Chain, a Layer 3 blockchain on Arbitrum Orbit, with a focus on security,
//           scalability, and user experience.
//         </p>
//         <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
//           <Card>
//             <CardHeader>
//               <CardTitle>Smart Contracts</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="text-left text-gray-600 space-y-2">
//                 <li>• Tutor Registry Contract</li>
//                 <li>• Student-Tutor Matching</li>
//                 <li>• Performance Escrow</li>
//                 <li>• DAO Governance</li>
//                 <li>• Token Distribution</li>
//               </ul>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>AI Infrastructure</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="text-left text-gray-600 space-y-2">
//                 <li>• Specialized Tutor Models</li>
//                 <li>• Learning Analytics</li>
//                 <li>• Content Generation</li>
//                 <li>• Assessment Systems</li>
//                 <li>• Personalization Engine</li>
//               </ul>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>User Experience</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="text-left text-gray-600 space-y-2">
//                 <li>• Web3 Integration</li>
//                 <li>• Interactive Learning</li>
//                 <li>• Progress Tracking</li>
//                 <li>• Governance Interface</li>
//                 <li>• Token Management</li>
//               </ul>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div className="text-center">
//         <h2 className="text-2xl font-bold mb-6">Ready to Experience the Future of Education?</h2>
//         <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
//           <Link href="/dashboard">
//             Launch App <ArrowRight className="ml-2 h-5 w-5" />
//           </Link>
//         </Button>
//       </div>
//     </div>
//   )
// }





import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Navbar } from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EduChain AI Tutor DAO',
  description: 'Decentralized AI tutoring with incentives aligned to student success',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}