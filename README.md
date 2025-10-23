# Event Storming Designer

An **interactive learning platform** that guides you from business requirements to production-ready API designs using **Event Storming** and **Domain-Driven Design (DDD)**.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Overview

Event Storming Designer is a comprehensive, AI-powered educational tool that walks you through the complete process of:

1. **Analyzing business requirements** with AI insights
2. **Conducting Event Storming workshops** to discover your domain model
3. **Generating Product Requirements Documents (PRDs)** automatically
4. **Designing APIs** (REST and GraphQL) with intelligent recommendations
5. **Architecting microservices** based on bounded contexts

All while **tracking costs** and providing **interactive explanations** of key concepts.

## Features

### Interactive Learning Journey

- **Step-by-Step Guidance**: Structured workflow from requirements to API design
- **AI-Powered Suggestions**: Get intelligent recommendations at every step
- **Concept Explanations**: Click to learn about Domain Events, Aggregates, REST, GraphQL, and more
- **Real-time Cost Tracking**: See exactly how much AI API calls cost

### Event Storming Workshop

- **Domain Events**: Identify what happens in your system
- **Commands**: Discover user actions and intentions
- **Aggregates**: Define cohesive domain entities
- **Bounded Contexts**: Establish logical boundaries

### PRD Generation

- Comprehensive Product Requirements Documents
- User stories in proper format
- Functional and non-functional requirements
- Domain model visualization

### API Design

- **REST vs GraphQL Recommendations**: Learn when to use each with detailed rationale
- **Endpoint Generation**: Get production-ready REST API specifications
- **GraphQL Schema**: Generate complete GraphQL SDL
- **Microservices Architecture**: Design services based on bounded contexts

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Anthropic Claude API** for AI-powered insights
- **CORS** and **Helmet** for security

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
   ```bash
   cd eventstorming-designer
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**

   Create `server/.env` file:
   ```env
   PORT=3001
   NODE_ENV=development

   # Get your API key from https://console.anthropic.com/
   ANTHROPIC_API_KEY=your_api_key_here

   # Cost per 1M tokens (update as needed)
   ANTHROPIC_INPUT_COST=3.00
   ANTHROPIC_OUTPUT_COST=15.00

   # CORS
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This starts:
   - Backend API at `http://localhost:3001`
   - Frontend app at `http://localhost:3000` (or `http://localhost:5173` with Vite)

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## Usage Guide

### 1. Business Requirements

Start by entering your business requirements:

- **Project Title**: Name of your project
- **Detailed Description**: Features, goals, stakeholders, constraints

Click **"Load Example"** to see a sample e-commerce platform.

Click **"Analyze Requirements"** to get AI insights about:
- Key domain concepts
- Potential domain events
- Possible commands
- Suggested bounded contexts

### 2. Event Storming Workshop

Work through each phase:

**Domain Events** (Yellow)
- Things that happen in your system
- Written in past tense (e.g., "Order Placed", "Payment Processed")
- Add manually or get AI suggestions

**Commands** (Blue)
- User actions and intentions
- Written in imperative (e.g., "Place Order", "Process Payment")
- Triggers domain events

**Aggregates** (Pink)
- Cohesive clusters of domain objects
- Examples: Order, User, Product
- Handle commands and produce events

**Bounded Contexts** (Green)
- Logical boundaries in your domain
- Examples: Order Management, Billing, Inventory
- Group related aggregates

### 3. PRD Generation

Review your Event Storming summary and click **"Generate PRD"**.

The AI creates a comprehensive document with:
- Executive summary
- Objectives and goals
- User stories
- Functional requirements
- Non-functional requirements
- Domain model
- API strategy

Download as Markdown for documentation.

### 4. API Design

**Phase 1: API Type Recommendation**
- Get AI analysis of REST vs GraphQL
- Understand the rationale and trade-offs
- Learn when to use each approach

**Phase 2: REST Endpoints**
- Generate RESTful API specifications
- Proper HTTP methods and status codes
- Request/response examples
- Download as documentation

**Phase 3: GraphQL Schema**
- Complete GraphQL SDL
- Types, Queries, Mutations, Subscriptions
- Input types for mutations
- Download as `.graphql` file

**Phase 4: Microservices Architecture**
- Service design based on bounded contexts
- Responsibilities and dependencies
- Communication patterns
- Deployment recommendations

### 5. Cost Tracking

Click the **$ button** in the header to see:
- Total cost in USD
- Total tokens used
- Number of API calls
- Detailed breakdown by step

This helps you understand real-world AI costs.

### 6. Learn Concepts

Click **"Learn Concepts"** to get AI-powered explanations of:
- Domain Events
- Commands
- Aggregates
- Bounded Contexts
- REST APIs
- GraphQL
- Microservices
- Event Sourcing

Each explanation includes:
- Clear definition
- Why it matters
- Real-world examples
- Common mistakes
- Best practices

## Example Project

The app includes an **E-Commerce Platform** example:

**Domain Events**:
- User Registered
- Product Added to Catalog
- Order Placed
- Payment Processed
- Order Shipped
- Inventory Updated

**Commands**:
- Register User
- Add Product
- Place Order
- Process Payment
- Ship Order
- Update Inventory

**Aggregates**:
- User
- Product
- Order
- Payment
- Shipment

**Bounded Contexts**:
- User Management
- Product Catalog
- Order Management
- Payment Processing
- Fulfillment

## Architecture

```
eventstorming-designer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context
│   │   ├── services/      # API client
│   │   └── main.tsx       # Entry point
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── index.ts       # Server entry
│   └── package.json
│
├── shared/                # Shared TypeScript types
│   └── types.ts
│
└── package.json           # Workspace root
```

## API Endpoints

### Event Storming
- `POST /api/event-storming/analyze-requirements` - Analyze business requirements
- `POST /api/event-storming/suggest-events` - Get domain event suggestions
- `POST /api/event-storming/suggest-commands` - Get command suggestions
- `POST /api/event-storming/identify-aggregates` - Identify aggregates
- `POST /api/event-storming/identify-contexts` - Identify bounded contexts
- `POST /api/event-storming/explain` - Explain a concept

### PRD
- `POST /api/prd/generate` - Generate PRD from event storming
- `GET /api/prd/:id` - Get PRD by ID

### API Design
- `POST /api/api-design/recommend-type` - Recommend REST vs GraphQL
- `POST /api/api-design/generate-rest` - Generate REST endpoints
- `POST /api/api-design/generate-graphql` - Generate GraphQL schema
- `POST /api/api-design/design-microservices` - Design microservices

### Cost Tracking
- `GET /api/cost/:sessionId` - Get cost tracking for session

## Educational Value

### What You'll Learn

**Event Storming Concepts**:
- How to identify domain events
- The relationship between commands and events
- What makes a good aggregate
- How to define bounded context boundaries

**Domain-Driven Design**:
- Strategic design patterns
- Tactical design patterns
- Ubiquitous language
- Context mapping

**API Design**:
- RESTful principles and best practices
- GraphQL schema design
- When to use REST vs GraphQL
- Real-world trade-offs

**Microservices**:
- Service boundaries
- Communication patterns (sync/async)
- Data ownership
- Deployment strategies

## Cost Information

The app uses **Anthropic Claude API** (Sonnet 3.5) with real-time cost tracking.

**Approximate costs per session**:
- Business requirements analysis: ~$0.01-0.02
- Event storming suggestions (4 phases): ~$0.04-0.08
- PRD generation: ~$0.02-0.04
- API design (4 phases): ~$0.04-0.08
- Concept explanations: ~$0.01 each

**Total typical session**: ~$0.10-0.25

Costs are shown in real-time so you understand the economics of AI-powered features.

## Production Deployment

### Environment Variables

Set these in production:

```env
NODE_ENV=production
PORT=3001
ANTHROPIC_API_KEY=your_production_key
ANTHROPIC_INPUT_COST=3.00
ANTHROPIC_OUTPUT_COST=15.00
ALLOWED_ORIGINS=https://yourdomain.com
```

### Build

```bash
npm run build
```

### Start

```bash
npm start
```

### Recommended Hosting

- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Railway, Render, or AWS ECS
- **Database** (for persistence): PostgreSQL with Prisma ORM

## Future Enhancements

- [ ] Session persistence with database
- [ ] Multi-user collaboration
- [ ] Export to Miro/Figma
- [ ] Code generation from API specs
- [ ] Integration with Swagger/OpenAPI
- [ ] Real-time collaboration with WebSockets
- [ ] Visual Event Storming canvas with drag-and-drop
- [ ] Templates for common domains (e-commerce, SaaS, etc.)
- [ ] Integration with GitHub for automatic PR creation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- **Event Storming** methodology by Alberto Brandolini
- **Domain-Driven Design** principles by Eric Evans
- **Anthropic Claude** for AI-powered insights
- Built with love for the developer community

## Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Check the documentation
- Review the example project

---

**Built with Claude Code** - An interactive learning platform for modern software design.

Start your journey from business requirements to production-ready APIs today!