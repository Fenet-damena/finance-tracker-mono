```md
# 💼 Finance Tracker Monorepo System

## 📌 Project Overview

This project is a **Monorepo-based Finance Tracker System** developed as part of a group assignment. It demonstrates **component-based architecture, code reusability, and modular feature development** using modern frontend technologies.

The system allows users to:
- Set and manage budgets
- Track expenses
- View financial summaries via a dashboard

---

## 🧱 Monorepo Structure

This project uses **Yarn Workspaces** to manage multiple packages in a single repository.

```

finance-tracker/
│
├── apps/
│   └── web/                # Main Next.js application
│
├── packages/
│   ├── ui-components/      # Reusable UI components
│   ├── utils/              # Shared utility functions
│   ├── feature-budget/     # Budget feature
│   ├── feature-expense/    # Expense feature
│   ├── feature-dashboard/  # Dashboard feature
│   └── feature-reports/    # Reports feature
│
├── package.json
└── README.md

```

---

## 🎨 UI Components (`ui-components`)

A shared component library built for reuse across all features.

### Includes:
- Button
- Input
- Card

### Purpose:
- Maintain consistent design
- Promote reusability
- Reduce duplicated code

---

## 🛠️ Utility Library (`utils`)

Shared helper functions used across features.

### Examples:
- Currency formatting
- Data manipulation helpers

---

## 🚀 Features Implemented

### 🟩 1. Budget Planner (`feature-budget`)
- Set monthly budget
- Save budget to Firebase Firestore
- Load and display saved budget
- Persistent data (no loss on refresh)

---

### 🟦 2. Expense Tracker (`feature-expense`)
- Add expenses (title + amount)
- Display list of expenses
- Calculate total expenses
- Dynamic UI updates

---

### 🟨 3. Dashboard (`feature-dashboard`)
- Display financial summary:
  - Total budget
  - Total expenses
  - Remaining balance
- Integrated with Firebase backend

---

### 📊 4. Reports / Analytics (`feature-reports`)
- **Spending Breakdown**: Visualizes expenses by category using a Pie Chart.
- **Monthly Trend**: Tracks spending patterns over time with a Bar Chart.
- **AI Insights**: Generates automated summaries of spending habits.
- **Modular Design**: Built as a standalone package using `recharts` and shared `utils`.


---

## 🔗 Backend Integration (Firebase)

The system uses **Firebase Firestore** as a backend database.

### Features:
- Real-time data storage
- Persistent state across pages
- Cloud-based data management

### Example Data Structure:

```

finance
└── main
budget: number

expenses
└── autoId
title: string
amount: number

```

---

## ⚙️ Technologies Used

- Next.js (App Router)
- React
- Firebase Firestore
- Yarn Workspaces (Monorepo)
- Component-Based Architecture

---

## ▶️ Getting Started

### 1. Install dependencies
```

yarn install

```

### 2. Run the development server
```

yarn dev

```

### 3. Open in browser
```

[http://localhost:3000](http://localhost:3000)

```

---

## 👥 Team Contribution

Each group member contributes:

- Shared packages (`ui-components`, `utils`)
- At least two feature systems
- Integration within the monorepo architecture

---

## 🧠 Key Concepts Demonstrated

- Monorepo architecture
- Code reusability
- Component-based design
- Feature modularization
- Backend integration with Firebase

---

## 📌 Notes

- Firestore rules are set to allow read/write during development
- Future improvements may include authentication and advanced analytics

---

## 📎 Submission

This repository contains:
- All required packages
- Feature implementations
- Documentation

```
