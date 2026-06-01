"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
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
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/client"

// Force dynamic rendering
export const dynamic = "force-dynamic"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getToday() {
  return new Date().toISOString().split("T")[0]
}

const categoryMapping: Record<string, string[]> = {
  "MAKANAN": ["makan", "makanan", "jajan", "jajanan", "pangan", "nasi", "bubur", "soto", "ayam", "ikan", "sayur", "buah", "gorengan", "martabak", "bakso", "sate", "gadogado", "rujak", "es teh", "kopi", "teh", "sarapan", "lunch", "makan siang", "makan malam", "dinner", "breakfast", "mie", "nasgor", "sambal", "lalap", "kerupuk", "telur", "daging", "udang", "cumi", "sushi", "pizza", "burger", "kfc", "mcd", "starbucks", "warung", "rumah makan", "kedai", "kantin"],
  "BELANJA": ["belanja", "belanjaan", "shopping", "toko", "supermarket", "minimarket", "indomaret", "alfamart", "carrefour", "hypermart", "transmart", "giant", "lotte", "total", "family", "alfamidi", "inkmart"],
  "TRANSPORTASI": ["bensin", "pertamax", "solar", "shell", "pertamina", "jamsostek", "parkir", "tol", "ojek", "gojek", "grab", "maxim", "taxi", "transport", "transportasi", "bus", "kereta", "krl", "mrt", "lrt", "pesawat", "kereta api", "kapal", "ferry"],
  "HIBURAN": ["hiburan", "nonton", "film", "bioskop", "konser", "game", "gaming", "netflix", "spotify", "youtube", "disney", "playstation", "xbox", "steam", "epic", "wifi", "internet", "kuota"],
  "KESEHATAN": ["kesehatan", "obat", "apotek", "dokter", "rumah sakit", "klinik", "medical", "check up", "vitamin", "suplemen", "masker", "hand sanitizer", "paracetamol", "bodrex", "promag", "obat batuk", "obat flu", "asuransi kesehatan"],
  "EDUKASI": ["edukasi", "sekolah", "kuliah", "universitas", "kursus", "buku", "seragam", "alat tulis", "printer", "laptop", "komputer", "kelas", "les", "privat", "bimbel", "pendidikan", "studypal", "skripsi", "thesis", "tugas"],
  "TAGIHAN": ["tagihan", "listrik", "pln", "air", "pdam", "gas", "pgas", "wifi", "internet", "bpjs", "abonemen", "langganan", "premi", "cicilan", "angsuran", "kredit"],
  "LAINNYA": [],
}

const normalizeCategory = (category: string): string => {
  if (!category) return "LAINNYA"
  const catLower = category.toLowerCase()
  for (const [baseCategory, keywords] of Object.entries(categoryMapping)) {
    if (catLower === baseCategory.toLowerCase()) return baseCategory
    if (keywords.some(keyword => catLower.includes(keyword))) {
      return baseCategory
    }
  }
  return catLower.toUpperCase()
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expense: 0,
    savingRate: 0,
  })
  
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [monthlyTransactions, setMonthlyTransactions] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [habits, setHabits] = useState<any[]>([])
  const [habitLogs, setHabitLogs] = useState<any[]>([])
  const [budgets, setBudgets] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = getToday()
    const currentMonth = `${today.substring(0, 7)}-01`

    const [
      profileResult,
      transactionsResult,
      transactionsAllResult,
      categoriesResult,
      habitsResult,
      habitLogsResult,
      budgetsResult,
    ] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .gte("transaction_date", currentMonth)
        .order("transaction_date", { ascending: false }),
      supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: true }),
      supabase.from("categories").select("*").eq("user_id", user.id),
      supabase.from("habits").select("*").eq("user_id", user.id),
      supabase.from("habit_logs").select("*").eq("user_id", user.id).eq("log_date", today),
      supabase.from("budgets").select("*").eq("user_id", user.id).eq("month", new Date().getMonth() + 1).eq("year", new Date().getFullYear()),
    ])

    if (profileResult?.data) {
      setUserName(profileResult.data.full_name || "User")
    }

    if (transactionsResult.data) {
      const txs = transactionsResult.data
      const income = txs.filter((t: any) => t.type === "income").reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0)
      const expense = txs.filter((t: any) => t.type === "expense").reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0)
      const balance = income - expense
      const savingRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0

      setStats({ balance, income, expense, savingRate })
      setRecentTransactions(txs.slice(0, 5))
    }

    if (transactionsAllResult.data) {
      setMonthlyTransactions(transactionsAllResult.data)
    }

    if (categoriesResult.data) setCategories(categoriesResult.data)
    if (habitsResult.data) setHabits(habitsResult.data)
    if (habitLogsResult.data) setHabitLogs(habitLogsResult.data)
    if (budgetsResult.data) setBudgets(budgetsResult.data)
    
    if (transactionsResult.data) {
      const monthExpenses = transactionsResult.data.filter((t: any) => t.type === "expense")
      setExpenses(monthExpenses)
    }

    setIsLoading(false)
  }

  const getCategoryById = (id: string) => categories.find((c: any) => c.id === id)

  const completedHabits = habitLogs.filter((l) => l.is_completed).length
  const totalHabits = habits.length
  const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0
  const bestStreak = habits.reduce((max: number, h: any) => Math.max(max, h.streak || 0), 0)
  const weakestHabit = habits.length > 0 ? habits.reduce((worst: any, h: any) => 
    (!worst || (h.completion_rate || 0) < (worst.completion_rate || 0)) ? h : worst
  , null) : null

  const getBudgetProgress = () => {
    return budgets.map((b: any) => {
      const budgetCategory = normalizeCategory(b.category || "")
      const spent = expenses
        .filter((e: any) => normalizeCategory(e.category || "") === budgetCategory)
        .reduce((sum: number, e: any) => sum + (parseFloat(e.amount) || 0), 0)
      const percentage = Math.round((spent / (parseFloat(b.amount) || 1)) * 100)
      return {
        ...b,
        spent,
        percentage,
        category: b.category || "Unknown",
        icon: "📦",
        color: percentage > 100 ? "bg-red-500" : percentage > 70 ? "bg-yellow-500" : "bg-green-500",
      }
    })
  }

  const budgetProgress = getBudgetProgress()

  const getDailyChartData = () => {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    const dailyData: { day: string; income: number; expense: number }[] = []

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
      const dayData = monthlyTransactions.filter((t: any) => t.transaction_date === dateStr)
      const income = dayData.filter((t: any) => t.type === "income").reduce((sum: number, t: any) => sum + (parseFloat(t.amount) || 0), 0)
      const expense = dayData.filter((t: any) => t.type === "expense").reduce((sum: number, t: any) => sum + (parseFloat(t.amount) || 0), 0)
      dailyData.push({
        day: String(i),
        income,
        expense,
      })
    }

    const maxValue = Math.max(...dailyData.map((d) => Math.max(d.income, d.expense)), 1)
    return { dailyData, maxValue }
  }

  const getMonthlyChartData = () => {
    const supabase = createClient()
    const allTransactions = monthlyTransactions
    
    const monthlyMap = new Map<string, { income: number; expense: number }>()
    allTransactions.forEach((tx: any) => {
      const monthKey = tx.transaction_date?.substring(0, 7) || ""
      const existing = monthlyMap.get(monthKey) || { income: 0, expense: 0 }
      if (tx.type === "income") {
        existing.income += (parseFloat(tx.amount) || 0)
      } else {
        existing.expense += (parseFloat(tx.amount) || 0)
      }
      monthlyMap.set(monthKey, existing)
    })

    const monthlyData = Array.from(monthlyMap.entries()).map(([month, values]) => {
      const date = new Date(month + "-01")
      return {
        month: date.toLocaleDateString("id-ID", { month: "short" }),
        income: values.income,
        expense: values.expense,
      }
    })

    const maxValue = Math.max(
      ...monthlyData.map((d) => Math.max(d.income, d.expense)),
      1
    )
    return { monthlyData, maxValue }
  }

  const { monthlyData, maxValue } = getMonthlyChartData()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Good evening, {userName}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Saldo Bulan Ini</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-1 truncate">
                {formatCurrency(stats.balance)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Wallet className="text-primary" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Pemasukan</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600 mt-1 truncate">
                {formatCurrency(stats.income)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-green-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Pengeluaran</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600 mt-1 truncate">
                {formatCurrency(stats.expense)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingDown className="text-red-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Saving Rate</p>
              <p className="text-lg sm:text-2xl font-bold text-primary mt-1 truncate">
                {stats.savingRate}%
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Target className="text-primary" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Income vs Expense Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Pemasukan vs Pengeluaran</h3>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
            </span>
          </div>
          {monthlyData.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-end justify-between h-40 sm:h-48 px-2 sm:px-4 gap-1 sm:gap-2 overflow-x-auto">
                {monthlyData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 sm:gap-2 flex-1 min-w-[40px] sm:min-w-[50px]">
                    <div className="w-full flex items-end justify-center gap-1 h-32 sm:h-40">
                      <div
                        className="flex-1 min-w-[6px] sm:min-w-[8px] bg-green-400 rounded-t transition-all"
                        style={{ height: `${(data.income / maxValue) * 100}%` }}
                      />
                      <div
                        className="flex-1 min-w-[6px] sm:min-w-[8px] bg-red-400 rounded-t transition-all"
                        style={{ height: `${(data.expense / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Pemasukan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Pengeluaran</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-40 sm:h-48 flex items-center justify-center text-muted-foreground text-sm">
              Tidak ada data
            </div>
          )}
        </div>

        {/* Habit Summary */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center justify-between mb-4 gap-2">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Habit Hari Ini</h3>
            <span className="text-xs sm:text-sm text-blue-600 font-medium whitespace-nowrap">
              {completedHabits}/{totalHabits}
            </span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {habits.slice(0, 5).map((habit: any) => {
              const log = habitLogs.find((l) => l.habit_id === habit.id)
              const isCompleted = log?.is_completed || false
              const isBadHabit = habit.habit_type === "bad_habit"
              return (
                <div
                  key={habit.id}
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl ${
                    isBadHabit
                      ? isCompleted ? "bg-orange-100 dark:bg-orange-900/30" : "bg-orange-50 dark:bg-orange-950/20"
                      : isCompleted ? "bg-green-100 dark:bg-green-900/30" : "bg-accent"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className={`${isBadHabit ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'} flex-shrink-0`} size={18} />
                  ) : (
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex-shrink-0 ${isBadHabit ? 'border-orange-400' : 'border-muted-foreground'}`} />
                  )}
                  <span
                    className={`text-xs sm:text-sm truncate font-medium ${
                      isBadHabit
                        ? isCompleted ? "text-orange-900 dark:text-orange-100" : "text-orange-700 dark:text-orange-300"
                        : isCompleted ? "text-green-900 dark:text-green-100" : "text-foreground"
                    }`}
                  >
                    {habit.name}
                    {isBadHabit && <span className="ml-1 text-xs opacity-70">(Buruk)</span>}
                  </span>
                </div>
              )
            })}
            {habits.length === 0 && (
              <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                Belum ada habit
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-primary">{completionRate}%</p>
              <p className="text-xs text-muted-foreground">Completion</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                <Flame size={16} /> {bestStreak}
              </p>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Status and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Budget Status */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center justify-between mb-4 gap-2">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Budget Bulanan</h3>
            <Link href="/budgets" className="text-xs sm:text-sm text-blue-600 hover:underline font-medium flex items-center gap-1 whitespace-nowrap">
              <Plus size={14} /> Tambah
            </Link>
          </div>
          {budgetProgress.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {budgetProgress.slice(0, 4).map((budget: any) => (
                <div key={budget.id}>
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1 truncate">
                      {budget.icon} {budget.category}
                    </span>
                    <span className={`text-xs sm:text-sm whitespace-nowrap ${budget.percentage > 100 ? "text-red-600" : "text-muted-foreground"}`}>
                      {formatCurrency(budget.spent)} / {formatCurrency(parseFloat(budget.amount) || 0)}
                    </span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${budget.color}`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
              Belum ada budget
            </p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center justify-between mb-4 gap-2">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Transaksi Terbaru</h3>
            <Link href="/transactions" className="text-xs sm:text-sm text-blue-600 hover:underline font-medium flex items-center gap-1 whitespace-nowrap">
              <Plus size={14} /> Tambah
            </Link>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {recentTransactions.map((tx: any) => {
                const cat = getCategoryById(tx.category_id)
                return (
                  <div key={tx.id} className="flex items-center justify-between py-2 gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          tx.type === "income"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tx.type === "income" ? (
                          <ArrowUpRight size={16} />
                        ) : (
                          <ArrowDownRight size={16} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                          {cat?.name || tx.type}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{tx.note || "-"}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${
                          tx.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(parseFloat(tx.amount))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.transaction_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
              Belum ada transaksi
            </p>
          )}
        </div>
      </div>

      {/* Smart Insights */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 sm:p-6 text-white">
        <h3 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
          <AlertCircle size={18} /> Smart Insights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white/10 rounded-xl p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-100">Pengeluaran bulan ini</p>
            <p className="text-base sm:text-lg font-semibold mt-1 truncate">
              {formatCurrency(stats.expense)}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-100">Saving Rate</p>
            <p className="text-base sm:text-lg font-semibold mt-1">{stats.savingRate}%</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-100">Habit selesai hari ini</p>
            <p className="text-base sm:text-lg font-semibold mt-1">
              {completedHabits}/{totalHabits}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
