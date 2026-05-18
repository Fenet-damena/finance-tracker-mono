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
# Fenet-damena | System Architect
Workspace Setup: Configured the Turborepo workspace environment and package structure to manage our modular codebase.

Shared Components: Created the foundational shared packages (ui-components and utils) utilized by the rest of the team.

Core Trackers: Developed the primary Budget Tracker and Expense Tracker modules, defining their core logic and state.

Database Integration: Connected the frontend modules (Budget, Expenses, and Dashboard) to the Firebase backend.

Project Coordination: Handled the initial repo setup, resolved structural merge conflicts, and finalized the core tracker integrations.

# Sumaya Adem | Analytics & Visualization
Reports Module: Built the independent feature-reports package to isolate the application's data analysis logic.

Visualization Components: Developed the SpendingBreakdown (categorical charts) and SavingsTrend (temporal trends) UI components using charting libraries.

Routing & Integration: Integrated the ReportDashboard component into the main application layout with optimized navigation routes.

Module Maintenance: Set up localized analytics utilities and assisted with repository syncing during feature merges.

# Eyu Ashenafi | Financial Goals & Insights
Feature Modules: Designed and implemented the Financial Goals and Insights components to give users automated feedback on their spending habit trends.

Component Documentation: Authored the technical markdown specification for the goals feature (FINANCIAL_GOAL_FEATURE.md) to map out its component design.

Code Refactoring: Led code clean-up initiatives for the authentication components to improve project structure and security flow.

# Yafet Tesfaye | Identity Management & Route Protection
Authentication Component: Developed the standalone feature-auth package using Firebase Auth to handle sign-up, login, and logout flows with error handling.

Route Guards: Implemented secure route checks across the budget, expense, dashboard, and currency views to restrict access to authenticated users.

Conditional Navigation: Updated the main layout components so that navigation menus dynamically adapt based on whether a user is signed in.

User Profile View: Shipped the account interface component where users can view their session details and safely sign out.

# Yabets Workaferahu | Multi-Currency & Recurring Finance
Currency Component: Built a reusable money library and multi-currency converter module supporting 12 currencies with live exchange rates.

Recurring Finance Module: Designed and implemented the recurring-expenses feature component to track subscriptions with pause/resume states.

Shared Primitives: Expanded the team's shared library with reusable UI elements like status pills, progress bars, and KPI tiles.

Dashboard Wiring: Connected the currency and recurring expense features into the main dashboard layout and navigation paths.
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


