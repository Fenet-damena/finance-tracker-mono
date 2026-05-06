Distributed Financial Management System (DFMS)
A Monorepo-Based Architectural Implementation

 # Project Overview
This project represents a sophisticated Distributed Financial Management System (DFMS) developed as a collaborative academic assignment. The system is engineered using a Monorepo architecture, emphasizing modularity, scalability, and code reusability. By leveraging a centralized codebase for shared logic and UI components, the project demonstrates advanced software engineering principles including Component-Based Development (CBD) and Service-Oriented Architecture (SOA) integration.

The platform provides a comprehensive suite for:
- Strategic Budgeting: Goal-oriented financial planning and allocation.
- Real-time Expense Tracking: Granular monitoring of financial outflows.
- Advanced Analytics: Visual data synthesis and spending trend forecasting.
- Multi-currency Support: Globalized financial management capabilities.


# System Architecture
The repository utilizes Turborepo and Yarn PnP to manage a high-performance workspace. This architecture ensures strict dependency management and optimized build pipelines across multiple internal packages.

```text
finance-tracker-mono/
├── apps/
│   └── web/                # Next.js Consumer Application (App Router)
├── packages/
│   ├── ui-components/      # Shared Design System & Atomic UI Components
│   ├── utils/              # Core Logic, Formatters, and Shared Helpers
│   ├── feature-auth/       # Identity & Access Management
│   ├── feature-budget/     # Budgetary Control Logic
│   ├── feature-expense/    # Transactional Management
│   ├── feature-dashboard/  # Data Aggregation & Summary Services
│   ├── feature-reports/    # Visualization & Analytics Engine
│   └── feature-goals/      # Financial Planning & Insights
├── package.json            # Workspace Configuration
└── README.md               # Technical Documentation
```

---

# Technology Stack
*   Framework: [Next.js 14+](https://nextjs.org/) (React 18, App Router)
*   Infrastructure: [Turborepo](https://turbo.build/) (High-performance Build System)
*   Backend as a Service (BaaS): [Firebase](https://firebase.google.com/) (Firestore & Authentication)
*   Visualization: [Recharts](https://recharts.org/) (D3-based Data Presentation)
*   Styling: Modern CSS / Tailwind (Responsive Design)
*   Package Management: Yarn (Berry/PnP)

---

# Team Roles

# Fenet-damena | System Architect & Core Infrastructure*
*   Environment Design: set the entire Turborepo environment, configuring workspace protocols and Yarn PnP for optimal development workflow.
*   Core Logic: Established foundational shared packages including `ui-components` and `utils`.
*   Full-Stack Integration: Engineered the connection between the Budget, Expenses, and Dashboard modules with the Firebase backend.
*   Project Oversight: Handled initial repository commits, resolved structural merge conflicts, and finalized the budget system implementation.


# sumaya Adem | Analytics & Visualization
*   Feature Implementation: Architected the `feature-reports` package, establishing the foundation for data-driven insights.
*   Visualization: Developed the `SpendingBreakdown` (Categorical Analysis) and `SavingsTrend` (Temporal Trends) components using advanced charting libraries.
*   Integration: Facilitated the seamless integration of the ReportDashboard into the primary web application, including navigation schema and route optimization.
*   Infrastructure: Managed the initial setup of analytics utilities and maintained repository synchronization through complex merge operations.

# Eyu Ashenafi | 
*   Feature Development: Conceptualized and implemented the Financial Goals and Insights modules, providing users with actionable financial intelligence.
*   Documentation: Authored the technical specification for the Financial Goals feature (`FINANCIAL_GOAL_FEATURE.md`), ensuring high documentation standards.
*   Code Quality: Led refactoring initiatives for authentication handling to improve logic flow and security.

#### Yafet Tesfaye | *Security Engineer: Identity Management*
*   Authentication: Implemented a robust security layer using Firebase Auth, enabling secure user onboarding and data isolation.
*   Identity Service: Developed the core authentication flows that underpin the system's security model.

# Yabets Workaferahu |Internationalization
*   Currency Systems: Built the multi-currency converter system, allowing for real-time exchange rate logic and global usability.
*   Interface Design: Developed the currency selection interface and the underlying mathematical models for accurate financial conversion.

---

# Getting Started

#### 1. Repository Initialization
Install all workspace dependencies using Yarn:
```bash
yarn install
```

#### 2. Development Environment
Launch the Next.js application and all package watchers:
```bash
yarn dev
```

#### 3. Access the Platform
The application will be served at [http://localhost:3000](http://localhost:3000).

---

### 🧠 Key Engineering Concepts
- Monorepo Strategy: Centralized management of multiple packages to reduce code duplication.
- Service Isolation: Features are built as independent packages to ensure low coupling and high cohesion.
- Asynchronous Data Handling: Real-time synchronization with Firebase Firestore for persistent state management.
- Modular UI: A proprietary component library that ensures visual consistency across all feature modules.


