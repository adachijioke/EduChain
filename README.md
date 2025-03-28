# EduChain AI Tutor DAO

A decentralized AI tutoring platform with incentives aligned to student success, built on EDU Chain.

## Project Overview

EduChain AI Tutor DAO is a revolutionary educational platform that combines artificial intelligence with blockchain technology to create a decentralized autonomous organization (DAO) focused on providing high-quality, personalized tutoring experiences.

The platform leverages smart contracts to ensure that incentives are perfectly aligned between students, AI tutors, and the broader educational ecosystem. By using performance-based tokenomics, the system rewards tutors based on student success and learning outcomes.

## Key Features

- **AI Tutors**: Specialized AI models that provide personalized tutoring across various subjects
- **DAO Governance**: Community-driven decision making for curriculum, teaching methodologies, and AI model improvements
- **Performance Incentives**: Smart contracts that ensure tutors are rewarded based on verified student success
- **On-chain Learning Records**: Secure, verifiable records of educational achievements and progress
- **Token Economy**: EDU tokens that power the ecosystem and align incentives

## Technical Architecture

The platform consists of several key smart contracts:

1. **TutorRegistry.sol**: Manages the registration and reputation of AI tutors
2. **StudentTutorMatching.sol**: Pairs students with the optimal AI tutors based on learning needs
3. **PerformanceEscrow.sol**: Holds payment until learning outcomes are verified
4. **TutorDAO.sol**: Handles governance and community decision-making
5. **EduToken.sol**: ERC20 token that powers the ecosystem

## Frontend Application

The frontend provides an intuitive interface for:

- Connecting wallets and interacting with the EDU Chain blockchain
- Browsing and selecting AI tutors
- Engaging in interactive learning sessions
- Tracking learning progress and achievements
- Participating in DAO governance

## Getting Started

1. Connect your wallet to the EDU Chain network
2. Register as a student and specify your learning preferences
3. Browse available AI tutors and start a learning session
4. Complete assessments to verify your learning outcomes
5. Earn EDU tokens for your achievements

## Development

This project is built using:

- Solidity for smart contracts
- Next.js for the frontend
- Tailwind CSS for styling
- shadcn/ui for UI components

## Hackathon Submission

This project is a submission for the EDU Chain Regional Hack - Lagos, part of the EDU Chain Semester 3 Hackathon. It addresses the AI track by combining artificial intelligence with blockchain technology to create a decentralized education platform.

## License

MIT



EduChain AI Tutor Project Setup
Prerequisites

Node.js (v18 or later)
npm or yarn
Git
A GitHub account
Vercel account

Local Development Setup
1. Clone the Repository
bashCopygit clone https://github.com/your-username/educhain-ai-tutor.git
cd educhain-ai-tutor
2. Install Dependencies
bashCopynpm install
# or
yarn install
3. Set Up Environment Variables
Create a .env.local file in the project root with the following variables:
Copy# Blockchain Configuration
NEXT_PUBLIC_EDU_CHAIN_RPC_URL=your_rpc_endpoint
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
4. Run Development Server
bashCopynpm run dev
# or
yarn dev
5. Build for Production
bashCopynpm run build
# or
yarn build
Testing
bashCopynpm run test
# or
yarn test
Smart Contract Development
bashCopy# Compile Solidity Contracts
npx hardhat compile

# Run Contract Tests
npx hardhat test
Project Structure
Copyeduchain-ai-tutor/
│
├── contracts/             # Solidity smart contracts
│   ├── TutorRegistry.sol
│   ├── StudentTutorMatching.sol
│   ├── PerformanceEscrow.sol
│   ├── TutorDAO.sol
│   └── EduToken.sol
│
├── components/            # React UI components
├── app/                   # Next.js app directory
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── public/                # Static assets
└── styles/                # Tailwind CSS styles
Contribution Guidelines

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
