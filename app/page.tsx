'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

const CATEGORIES = [
  { name: 'Food', icon: '🍔', color: '#ff6b6b' },
  { name: 'Transport', icon: '🚗', color: '#4ecdc4' },
  { name: 'Shopping', icon: '🛍️', color: '#ffe66d' },
  { name: 'Entertainment', icon: '🎮', color: '#a8e6cf' },
  { name: 'Bills', icon: '📄', color: '#ff8c94' },
  { name: 'Health', icon: '💊', color: '#c7ceea' },
  { name: 'Other', icon: '📦', color: '#b4a7d6' },
]

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [description, setDescription] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const saved = localStorage.getItem('expenses')
    if (saved) {
      setExpenses(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = () => {
    if (!amount || parseFloat(amount) <= 0) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      description: description || 'No description',
      date: new Date().toISOString(),
    }

    setExpenses([newExpense, ...expenses])
    setAmount('')
    setDescription('')
    setShowAddForm(false)
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const filteredExpenses = filter === 'All'
    ? expenses
    : expenses.filter(e => e.category === filter)

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  const getCategoryIcon = (categoryName: string) => {
    return CATEGORIES.find(c => c.name === categoryName)?.icon || '📦'
  }

  const getCategoryColor = (categoryName: string) => {
    return CATEGORIES.find(c => c.name === categoryName)?.color || '#b4a7d6'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const categoryTotals = CATEGORIES.map(cat => {
    const total = expenses
      .filter(e => e.category === cat.name)
      .reduce((sum, e) => sum + e.amount, 0)
    return { ...cat, total }
  }).filter(cat => cat.total > 0)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>💰 Expense Tracker</h1>
        <div className={styles.totalCard}>
          <div className={styles.totalLabel}>Total Expenses</div>
          <div className={styles.totalAmount}>${totalExpenses.toFixed(2)}</div>
        </div>
      </header>

      {categoryTotals.length > 0 && (
        <div className={styles.categoriesSection}>
          <h2 className={styles.sectionTitle}>Spending by Category</h2>
          <div className={styles.categoryGrid}>
            {categoryTotals.map(cat => (
              <div
                key={cat.name}
                className={styles.categoryCard}
                style={{ background: cat.color }}
              >
                <div className={styles.categoryIcon}>{cat.icon}</div>
                <div className={styles.categoryName}>{cat.name}</div>
                <div className={styles.categoryAmount}>${cat.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${filter === 'All' ? styles.active : ''}`}
            onClick={() => setFilter('All')}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              className={`${styles.filterButton} ${filter === cat.name ? styles.active : ''}`}
              onClick={() => setFilter(cat.name)}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.expensesList}>
        {filteredExpenses.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <p>No expenses yet</p>
            <p className={styles.emptySubtext}>Tap the + button to add one</p>
          </div>
        ) : (
          filteredExpenses.map(expense => (
            <div key={expense.id} className={styles.expenseItem}>
              <div
                className={styles.expenseIcon}
                style={{ background: getCategoryColor(expense.category) }}
              >
                {getCategoryIcon(expense.category)}
              </div>
              <div className={styles.expenseDetails}>
                <div className={styles.expenseDescription}>{expense.description}</div>
                <div className={styles.expenseMeta}>
                  {expense.category} • {formatDate(expense.date)}
                </div>
              </div>
              <div className={styles.expenseRight}>
                <div className={styles.expenseAmount}>-${expense.amount.toFixed(2)}</div>
                <button
                  className={styles.deleteButton}
                  onClick={() => deleteExpense(expense.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddForm && (
        <div className={styles.modal} onClick={() => setShowAddForm(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Add Expense</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                className={styles.input}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                autoFocus
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select
                className={styles.select}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.name} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <input
                type="text"
                className={styles.input}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What did you spend on?"
              />
            </div>
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                className={styles.addButton}
                onClick={addExpense}
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className={styles.fab}
        onClick={() => setShowAddForm(true)}
      >
        +
      </button>
    </div>
  )
}
