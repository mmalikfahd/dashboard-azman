"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, Calendar } from "lucide-react"

const mockMonthlyData = [
  { month: "Jan", income: 4500000, expense: 2800000 },
  { month: "Feb", income: 4800000, expense: 3100000 },
  { month: "Mar", income: 4500000, expense: 2500000 },
  { month: "Apr", income: 5000000, expense: 3200000 },
  { month: "May", income: 5000000, expense: 2150000 },
]

const mockCategoryData = [
  { category: "Makanan", amount: 450000, color: "bg-red-500" },
  { category: "Transportasi", amount: 200000, color: "bg-blue-500" },
  { category: "Hiburan", amount: 180000, color: "bg-purple-500" },
  { category: "Internet", amount: 150000, color: "bg-yellow-500" },
  { category: "Pendidikan", amount: 100000, color: "bg-green-500" },
  { category: "Lainnya", amount: 170000, color: "bg-slate-400" },
]

const mockHabitData = [
  { habit: "Belajar Coding", rate: 85 },
  { habit: "Catat Pengeluaran", rate: 95 },
  { habit: "Minum Air", rate: 92 },
  { habit: "Tidur Tepat Waktu", rate: 68 },
  { habit: "Membaca", rate: 45 },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function ReportsPage() {
  const [period, setPeriod] = useState("this_month")

  const maxCategory = Math.max(...mockCategoryData.map((d) => d.amount))
  const avgHabitRate = Math.round(
    mockHabitData.reduce((acc, h) => acc + h.rate, 0) / mockHabitData.length
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan</h1>
          <p className="text-slate-500">Analisis keuangan dan kebiasaanmu</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-slate-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
          >
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
            <option value="3_months">3 Bulan Terakhir</option>
            <option value="6_months">6 Bulan Terakhir</option>
            <option value="this_year">Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <span className="text-sm text-slate-500">Total Pemasukan</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(23800000)}</p>
          <p className="text-sm text-slate-500 mt-1">5 bulan terakhir</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-red-600 rotate-180" size={20} />
            </div>
            <span className="text-sm text-slate-500">Total Pengeluaran</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(13750000)}</p>
          <p className="text-sm text-slate-500 mt-1">5 bulan terakhir</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-blue-600" size={20} />
            </div>
            <span className="text-sm text-slate-500">Saving Rate Rata-rata</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">42%</p>
          <p className="text-sm text-slate-500 mt-1">5 bulan terakhir</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Trend */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-6">Tren Pemasukan vs Pengeluaran</h3>
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-slate-600">Pemasukan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-slate-600">Pengeluaran</span>
            </div>
          </div>
          <div className="flex items-end justify-between h-48 px-2">
            {mockMonthlyData.map((data, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center gap-1 h-40">
                  <div
                    className="w-6 bg-green-400 rounded-t transition-all"
                    style={{ height: `${(data.income / 5000000) * 100}%` }}
                  />
                  <div
                    className="w-6 bg-red-400 rounded-t transition-all"
                    style={{ height: `${(data.expense / 5000000) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spending by Category */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-6">Pengeluaran per Kategori</h3>
          <div className="space-y-4">
            {mockCategoryData.map((data, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{data.category}</span>
                  <span className="text-sm text-slate-600">{formatCurrency(data.amount)}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${data.color}`}
                    style={{ width: `${(data.amount / maxCategory) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Habit Report */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-900">Laporan Habit</h3>
          <span className="text-sm text-blue-600 font-medium">Rata-rata: {avgHabitRate}%</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {mockHabitData.map((data, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">{data.rate}%</span>
              </div>
              <p className="text-sm font-medium text-slate-700">{data.habit}</p>
              <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${data.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
