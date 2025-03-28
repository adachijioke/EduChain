import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">EduChain AI Tutor DAO</h1>
            <p className="text-xl md:text-2xl mb-8">
              Decentralized AI tutoring with incentives aligned to student success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
                <Link href="/dashboard">
                  Launch App <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>AI Tutors</CardTitle>
                <CardDescription>Specialized AI tutors for every subject</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Access personalized AI tutors that adapt to your learning style and pace. Each tutor is specialized in
                  specific subjects and continuously improves through on-chain governance.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>DAO Governance</CardTitle>
                <CardDescription>Community-driven education</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Token holders vote on curriculum, teaching methodologies, and AI model improvements. Students and
                  educators collaborate to create the best learning experience.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance Incentives</CardTitle>
                <CardDescription>Rewards aligned with outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Smart contracts ensure tutors are rewarded based on student success. Students earn tokens for
                  completing milestones, creating a sustainable learning ecosystem.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">The Technology</h2>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-purple-100 rounded-full p-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-800">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Smart Contract Registry</h3>
                  <p className="text-gray-600">
                    Our Tutor Registry Contract manages AI tutor models and their specializations, ensuring quality and
                    accountability.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-purple-100 rounded-full p-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-800">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Matching Algorithm</h3>
                  <p className="text-gray-600">
                    The Student-Tutor Matching Contract pairs students with the optimal AI tutors based on learning
                    style and goals.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-purple-100 rounded-full p-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-800">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Performance Escrow</h3>
                  <p className="text-gray-600">
                    Our Performance Escrow Contract holds payment until learning outcomes are verified, ensuring
                    incentives are aligned.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/technology">
                  Explore Our Technology <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform education?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of learners and educators building the future of decentralized education.
          </p>
          <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
            <Link href="/dashboard">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

