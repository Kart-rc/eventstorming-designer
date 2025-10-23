# Quick Start Guide

Get started with Event Storming Designer in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- An Anthropic API key (free trial available at https://console.anthropic.com/)

## Installation

### 1. Clone and Install

```bash
cd eventstorming-designer
npm run install:all
```

### 2. Configure API Key

Create `server/.env`:

```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 3. Start the App

```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 3000/5173).

### 4. Open Browser

Visit: http://localhost:3000

## Your First Project

### Step 1: Enter Business Requirements

1. Click "Start Your Journey"
2. Click "Load Example" to see an e-commerce platform example
3. Or enter your own project details
4. Click "Analyze Requirements" to get AI insights

### Step 2: Event Storming

1. **Domain Events** (Yellow sticky notes):
   - Click "Get AI Suggestions" for recommendations
   - Or manually add events like "Order Placed", "Payment Processed"
   - Need at least 1 event to proceed

2. **Commands** (Blue sticky notes):
   - Get AI suggestions for user actions
   - Or add commands like "Place Order", "Process Payment"
   - Need at least 1 command to proceed

3. **Aggregates** (Pink sticky notes):
   - Let AI identify domain entities
   - Or add aggregates like "Order", "User", "Product"
   - Need at least 1 aggregate to proceed

4. **Bounded Contexts** (Green sticky notes):
   - Get AI recommendations for logical boundaries
   - Or define contexts like "Order Management", "Billing"
   - Need at least 1 context to proceed

5. Click "Continue to PRD Generation"

### Step 3: Generate PRD

1. Review your Event Storming summary
2. Click "Generate Product Requirements Document"
3. AI creates a comprehensive PRD with:
   - Overview and objectives
   - User stories
   - Requirements
   - Domain model
4. Download as Markdown
5. Click "Continue to API Design"

### Step 4: Design APIs

1. **API Type Recommendation**:
   - Click "Get Recommendation"
   - Learn when to use REST vs GraphQL
   - Understand the rationale

2. **REST Endpoints**:
   - Click "Generate REST APIs"
   - Get specifications for all aggregates
   - Download the documentation

3. **GraphQL Schema**:
   - Click "Generate GraphQL Schema"
   - Get complete SDL for all contexts
   - Download the schema file

4. **Microservices Architecture**:
   - Click "Design Microservices"
   - Get service boundaries and interactions
   - Download the design

### Step 5: Track Costs

Click the **$** button in the header to see:
- Total cost (typically $0.10-0.25 per session)
- Token usage
- Breakdown by step

### Step 6: Learn Concepts

Click "Learn Concepts" to get AI explanations of:
- Event Storming terminology
- DDD principles
- API design patterns
- Microservices concepts

## Example Session Flow

1. **Business Requirements** (1 minute):
   - Enter "E-Commerce Platform" details
   - Get AI analysis

2. **Event Storming** (3-5 minutes):
   - Add 5-6 domain events
   - Add 5-6 commands
   - Identify 3-4 aggregates
   - Define 2-3 bounded contexts

3. **PRD Generation** (1 minute):
   - Generate comprehensive PRD
   - Download documentation

4. **API Design** (3-5 minutes):
   - Get REST vs GraphQL recommendation
   - Generate REST endpoints
   - Generate GraphQL schema
   - Design microservices

**Total Time**: 10-15 minutes
**Total Cost**: ~$0.15

## Tips for Success

### Domain Events
- Use past tense: "Order Placed" not "Place Order"
- Focus on business significance
- Think "what happened that stakeholders care about"

### Commands
- Use imperative form: "Place Order" not "Order Placed"
- Represent user intentions
- Should trigger one or more events

### Aggregates
- Cluster related concepts
- Examples: Order, User, Product, Payment
- Should have clear boundaries

### Bounded Contexts
- Represent different parts of your domain
- Examples: Order Management, Billing, Inventory
- Should have minimal dependencies

## Common Issues

### "Failed to analyze requirements"
- Check your `server/.env` has valid `ANTHROPIC_API_KEY`
- Ensure backend is running on port 3001
- Check browser console for errors

### "Cannot proceed to next step"
- Make sure you have at least one item in each Event Storming phase
- All phases (Events, Commands, Aggregates, Contexts) must have items

### High costs
- Each API call costs ~$0.01-0.02
- Click the $ button to monitor in real-time
- A full session typically costs $0.10-0.25

## Next Steps

After completing your first project:

1. **Try your own business idea**:
   - Enter real requirements
   - Build your own domain model
   - Design your APIs

2. **Explore concepts**:
   - Use "Learn Concepts" to deepen understanding
   - Read about Event Storming and DDD
   - Study the generated PRD and API designs

3. **Export your work**:
   - Download PRD as Markdown
   - Download REST documentation
   - Download GraphQL schema
   - Use these as foundation for development

## Learn More

- Full documentation: See [README.md](README.md)
- Event Storming: https://www.eventstorming.com/
- Domain-Driven Design: https://martinfowler.com/bliki/DomainDrivenDesign.html
- REST API Design: https://restfulapi.net/
- GraphQL: https://graphql.org/learn/

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review the example e-commerce project
- Use the "Learn Concepts" feature in the app
- Open an issue on GitHub

---

Happy Event Storming! 🚀
