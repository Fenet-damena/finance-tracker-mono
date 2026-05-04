"use client";

import { create } from "zustand";

type Expense = {
  id: string;
  title: string;
  amount: number;
};

type FinanceState = {
  budget: number;
  expenses: Expense[];

  setBudget: (value: number) => void;
  addExpense: (expense: Expense) => void;

  totalExpense: () => number;
  balance: () => number;
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  budget: 0,
  expenses: [],

  setBudget: (value) => set({ budget: value }),

  addExpense: (expense) =>
    set((state) => ({
      expenses: [...state.expenses, expense],
    })),

  totalExpense: () =>
    get().expenses.reduce((sum, e) => sum + e.amount, 0),

  balance: () => get().budget - get().totalExpense(),
}));