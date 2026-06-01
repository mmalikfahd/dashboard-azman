"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, TrendingDown, Loader2 } from "lucide-react"
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

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("3")
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    monthlyData: [] as { month: string; income: number; expense: number }[],
    categoryData: [] as { category: string; amount: number; icon: string }[],
    habitData: [] as { habit: string; rate: number; habit_type?: string }[],
  })

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [transactionsResult, habitsResult, habitLogsResult] = await Promise.all([
      supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: true }),
      supabase.from("habits").select("*").eq("user_id", user.id),
      supabase.from("habit_logs").select("*").eq("user_id", user.id),
    ])

    if (transactionsResult.error) {
      console.error("Transactions error:", transactionsResult.error)
    }

    const allTxs = transactionsResult.data || []
    
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    
    const startDate = period === "1" 
      ? `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`
      : new Date(currentYear, currentMonth - parseInt(period), 1).toISOString().split("T")[0]
    
    const txs = period === "all"
      ? allTxs
      : allTxs.filter((tx: any) => tx.transaction_date >= startDate)

    const totalIncome = txs
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + (parseFloat(t.amount) || 0), 0)
    const totalExpense = txs
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + (parseFloat(t.amount) || 0), 0)

    const monthlyMap = new Map<string, { income: number; expense: number }>()
    txs.forEach((tx: any) => {
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

    const categoryMap = new Map<string, number>()
    txs
      .filter((t: any) => t.type === "expense")
      .forEach((tx: any) => {
        const catName = tx.category || "Lainnya"
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + (parseFloat(tx.amount) || 0))
      })

    const categoryData = Array.from(categoryMap.entries())
      .map(([category, amount]) => {
        return { category, amount, icon: "📦" }
      })
      .sort((a, b) => b.amount - a.amount)

    const habitData = (habitsResult.data || []).map((habit: any) => {
      const logs = (habitLogsResult.data || []).filter(
        (log: any) => log.habit_id === habit.id
      )
      const completed = logs.filter((l: any) => l.is_completed).length
      const rate = logs.length > 0 ? Math.round((completed / logs.length) * 100) : 0
      return { habit: habit.name, rate, habit_type: habit.habit_type }
    })

    setData({
      totalIncome,
      totalExpense,
      monthlyData,
      categoryData,
      habitData,
    })

    setIsLoading(false)
  }

  const avgSavingRate = data.totalIncome > 0
    ? Math.round(((data.totalIncome - data.totalExpense) / data.totalIncome) * 100)
    : 0

  const maxCategoryAmount = Math.max(...data.categoryData.map((d) => d.amount), 1)
  const maxMonthlyValue = Math.max(
    ...data.monthlyData.map((d) => Math.max(d.income, d.expense)),
    1
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Laporan</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Analisis keuangan dan kebiasaanmu</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Periode:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:border-primary outline-none text-xs sm:text-sm appearance-none cursor-pointer"
          >
            <option value="1" className="bg-background text-foreground">Bulan Ini</option>
            <option value="3" className="bg-background text-foreground">3 Bulan</option>
            <option value="6" className="bg-background text-foreground">6 Bulan</option>
            <option value="12" className="bg-background text-foreground">1 Tahun</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-green-600" size={18} />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">Pemasukan</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-green-600 truncate">{formatCurrency(data.totalIncome)}</p>
        </div>

        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingDown className="text-red-600" size={18} />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">Pengeluaran</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-red-600 truncate">{formatCurrency(data.totalExpense)}</p>
        </div>

        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="text-primary" size={18} />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">Saving Rate</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-primary">{avgSavingRate}%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Income vs Expense Trend */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <h3 className="font-semibold text-foreground text-sm sm:text-base mb-4 sm:mb-6">Tren Pemasukan vs Pengeluaran</h3>
          {data.monthlyData.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-end justify-between h-40 sm:h-48 px-2 sm:px-4 gap-1 sm:gap-2 overflow-x-auto">
                {data.monthlyData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 sm:gap-2 flex-1 min-w-[40px] sm:min-w-[50px]">
                    <div className="w-full flex items-end justify-center gap-1 h-32 sm:h-40">
                      <div
                        className="flex-1 min-w-[6px] sm:min-w-[8px] bg-green-400 rounded-t transition-all"
                        style={{ height: `${(data.income / maxMonthlyValue) * 100}%` }}
                      />
                      <div
                        className="flex-1 min-w-[6px] sm:min-w-[8px] bg-red-400 rounded-t transition-all"
                        style={{ height: `${(data.expense / maxMonthlyValue) * 100}%` }}
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

        {/* Spending by Category */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <h3 className="font-semibold text-foreground text-sm sm:text-base mb-4 sm:mb-6">Pengeluaran per Kategori</h3>
          {data.categoryData.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-80 overflow-y-auto">
              {data.categoryData.map((data, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1 gap-2 min-w-0">
                    <span className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1 min-w-0 flex-1">
                      <span className="flex-shrink-0">{data.icon}</span>
                      <span className="truncate">{data.category}</span>
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">{formatCurrency(data.amount)}</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full"
                      style={{ width: `${(data.amount / maxCategoryAmount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 sm:h-48 flex items-center justify-center text-muted-foreground text-sm">
              Tidak ada data
            </div>
          )}
        </div>
      </div>

      {/* Habit Report */}
      <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Laporan Habit</h3>
        </div>
        {data.habitData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {data.habitData.map((data, i) => {
              const isBadHabit = data.habit_type === "bad_habit"
              return (
              <div key={i} className={`rounded-xl p-2 sm:p-3 md:p-4 text-center transition-all hover:shadow-md ${isBadHabit ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' : 'bg-accent'}`}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1 sm:mb-2 md:mb-3 rounded-full flex items-center justify-center flex-shrink-0 ${isBadHabit ? 'bg-orange-100 dark:bg-orange-900/40' : 'bg-primary/10'}`}>
                  <span className={`text-xs sm:text-sm md:text-lg font-bold ${isBadHabit ? 'text-orange-600 dark:text-orange-400' : 'text-primary'}`}>{data.rate}%</span>
                </div>
                <p className={`text-xs sm:text-sm font-medium truncate line-clamp-2 ${isBadHabit ? 'text-orange-700 dark:text-orange-300' : 'text-foreground'}`}>{data.habit}</p>
                {isBadHabit && <p className="text-xs text-orange-500 dark:text-orange-400 mt-0.5">(Buruk)</p>}
                <div className="mt-1.5 sm:mt-2 h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isBadHabit ? 'bg-orange-500' : 'bg-primary'}`}
                    style={{ width: `${data.rate}%` }}
                  />
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm">
            Tidak ada data habit
          </div>
        )}
      </div>
    </div>
  )
}
