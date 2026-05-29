"use client"

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  CheckCircle2,
  Flame,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

// Mock data - will connect to Supabase later
const mockStats = {
  balance: 2850000,
  income: 5000000,
  expense: 2150000,
  savingRate: 57,
}

const mockHabitsToday = [
  { id: 1, name: "Belajar coding 2 jam", completed: true, type: "checkbox" },
  { id: 2, name: "Minum air 2 liter", completed: true, type: "numeric", target: 8, current: 8 },
  { id: 3, name: "Membaca 10 halaman", completed: false, type: "numeric", target: 10, current: 0 },
  { id: 4, name: "Tidur sebelum jam 23.00", completed: false, type: "checkbox" },
  { id: 5, name: "Catat pengeluaran", completed: true, type: "checkbox" },
]

const mockRecentTransactions = [
  { id: 1, type: "expense", category: "Makanan", amount: 25000, note: "Makan siang", date: "27 May 2026" },
  { id: 2, type: "income", category: "Freelance", amount: 500000, note: "Project website", date: "27 May 2026" },
  { id: 3, type: "expense", category: "Transportasi", amount: 15000, note: "Bensin motor", date: "26 May 2026" },
  { id: 4, type: "expense", category: "Internet", amount: 150000, note: "Paket data bulan Mei", date: "25 May 2026" },
  { id: 5, type: "expense", category: "Hiburan", amount: 75000, note: "Nonton film", date: "24 May 2026" },
]

const mockBudgets = [
  { category: "Makanan", spent: 450000, limit: 500000, color: "bg-green-500" },
  { category: "Transportasi", spent: 200000, limit: 250000, color: "bg-blue-500" },
  { category: "Hiburan", spent: 180000, limit: 150000, color: "bg-red-500" },
  { category: "Internet", spent: 150000, limit: 150000, color: "bg-yellow-500" },
]

const mockHabitStats = {
  completedToday: 3,
  totalToday: 5,
  completionRate: 76,
  bestStreak: 14,
  weakestHabit: "Membaca buku",
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Good evening, Azman</h1>
        <p className="text-slate-500">Tuesday, 27 May 2026</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Saldo Bulan Ini</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {formatCurrency(mockStats.balance)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Wallet className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pemasukan</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(mockStats.income)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pengeluaran</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(mockStats.expense)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Saving Rate</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {mockStats.savingRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900">Pemasukan vs Pengeluaran</h3>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600">
              <option>7 hari terakhir</option>
              <option>Bulan ini</option>
              <option>6 bulan terakhir</option>
            </select>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-8 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-slate-600">Pemasukan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-slate-600">Pengeluaran</span>
                </div>
              </div>
              {/* Simple bar chart visualization */}
              <div className="flex items-end justify-center gap-4 h-32">
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day, i) => {
                  const income = [120, 80, 150, 200, 100, 300, 250][i]
                  const expense = [60, 90, 70, 180, 50, 120, 80][i]
                  return (
                    <div key={day} className="flex items-end gap-1">
                      <div
                        className="w-6 bg-green-400 rounded-t"
                        style={{ height: `${income * 0.3}px` }}
                      />
                      <div
                        className="w-6 bg-red-400 rounded-t"
                        style={{ height: `${expense * 0.3}px` }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-center gap-4 mt-2 text-xs text-slate-400">
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
                  <span key={day} className="w-12 text-center">{day}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Habit Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Habit Hari Ini</h3>
            <span className="text-sm text-blue-600 font-medium">
              {mockHabitStats.completedToday}/{mockHabitStats.totalToday} selesai
            </span>
          </div>
          <div className="space-y-3">
            {mockHabitsToday.map((habit) => (
              <div
                key={habit.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  habit.completed ? "bg-green-50" : "bg-slate-50"
                }`}
              >
                {habit.completed ? (
                  <CheckCircle2 className="text-green-500" size={20} />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                )}
                <span
                  className={`text-sm ${
                    habit.completed ? "text-slate-700" : "text-slate-500"
                  }`}
                >
                  {habit.name}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{mockHabitStats.completionRate}%</p>
              <p className="text-xs text-slate-500">Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                <Flame size={20} /> {mockHabitStats.bestStreak}
              </p>
              <p className="text-xs text-slate-500">Best Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Status and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Budget Bulanan</h3>
            <button className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1">
              <Plus size={16} /> Tambah
            </button>
          </div>
          <div className="space-y-4">
            {mockBudgets.map((budget, i) => {
              const percentage = Math.round((budget.spent / budget.limit) * 100)
              const isOver = percentage > 100
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{budget.category}</span>
                    <span className={`text-sm ${isOver ? "text-red-600" : "text-slate-600"}`}>
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${budget.color} ${
                        isOver ? "opacity-80" : ""
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  {isOver && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={12} className="text-red-500" />
                      <span className="text-xs text-red-500">Melebihi budget</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Transaksi Terbaru</h3>
            <button className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1">
              <Plus size={16} /> Tambah
            </button>
          </div>
          <div className="space-y-3">
            {mockRecentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === "income"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {tx.type === "income" ? (
                      <ArrowUpRight size={18} />
                    ) : (
                      <ArrowDownRight size={18} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{tx.category}</p>
                    <p className="text-xs text-slate-500">{tx.note}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      tx.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-slate-400">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Insights */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <AlertCircle size={20} /> Smart Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm text-blue-100">Pengeluaran bulan ini</p>
            <p className="text-lg font-semibold">turun 18% dari bulan lalu</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm text-blue-100">Kategori paling boros</p>
            <p className="text-lg font-semibold">Makanan (Rp 450.000)</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm text-blue-100">Habit paling konsisten</p>
            <p className="text-lg font-semibold">Belajar Coding</p>
          </div>
        </div>
      </div>
    </div>
  )
}
