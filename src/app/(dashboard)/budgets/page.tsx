"use client"

import { useState } from "react"
import { Plus, AlertCircle, CheckCircle2, X, Edit2, Trash2 } from "lucide-react"

const mockBudgets = [
  { id: 1, category: "Makanan", icon: "🍔", spent: 450000, limit: 500000, period: "May 2026" },
  { id: 2, category: "Transportasi", icon: "🚗", spent: 200000, limit: 250000, period: "May 2026" },
  { id: 3, category: "Hiburan", icon: "🎬", spent: 180000, limit: 150000, period: "May 2026" },
  { id: 4, category: "Internet", icon: "📱", spent: 150000, limit: 150000, period: "May 2026" },
  { id: 5, category: "Pendidikan", icon: "📚", spent: 100000, limit: 200000, period: "May 2026" },
  { id: 6, category: "Kebutuhan Rumah", icon: "🏠", spent: 75000, limit: 300000, period: "May 2026" },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStatus(percentage: number) {
  if (percentage >= 100) return { label: "Melebihi Budget", color: "text-red-600", bg: "bg-red-100" }
  if (percentage >= 70) return { label: "Hampir Habis", color: "text-yellow-600", bg: "bg-yellow-100" }
  return { label: "Aman", color: "text-green-600", bg: "bg-green-100" }
}

export default function BudgetsPage() {
  const [showModal, setShowModal] = useState(false)

  const totalBudget = mockBudgets.reduce((acc, b) => acc + b.limit, 0)
  const totalSpent = mockBudgets.reduce((acc, b) => acc + b.spent, 0)
  const totalPercentage = Math.round((totalSpent / totalBudget) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Budget</h1>
          <p className="text-slate-500">Kelola batas pengeluaran per kategori</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          <Plus size={20} />
          Tambah Budget
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Total Budget Bulan Ini</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatus(totalPercentage).bg} ${getStatus(totalPercentage).color}`}>
            {getStatus(totalPercentage).label}
          </span>
        </div>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalSpent)}</p>
            <p className="text-sm text-slate-500">dari {formatCurrency(totalBudget)}</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalPercentage}%</p>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              totalPercentage >= 100 ? "bg-red-500" : totalPercentage >= 70 ? "bg-yellow-500" : "bg-blue-500"
            }`}
            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockBudgets.map((budget) => {
          const percentage = Math.round((budget.spent / budget.limit) * 100)
          const status = getStatus(percentage)

          return (
            <div key={budget.id} className="bg-white rounded-2xl p-5 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                    {budget.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{budget.category}</h3>
                    <p className="text-sm text-slate-500">{budget.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {percentage >= 100 ? (
                    <AlertCircle className="text-red-500" size={20} />
                  ) : percentage >= 70 ? (
                    <AlertCircle className="text-yellow-500" size={20} />
                  ) : (
                    <CheckCircle2 className="text-green-500" size={20} />
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                  </span>
                  <span className={`text-sm font-semibold ${status.color}`}>{percentage}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentage >= 100 ? "bg-red-500" : percentage >= 70 ? "bg-yellow-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              {percentage >= 100 && (
                <div className="flex items-center gap-1 text-sm text-red-600 mb-3">
                  <AlertCircle size={14} />
                  <span>Melebihi budget {formatCurrency(budget.spent - budget.limit)}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button className="flex-1 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                  <Edit2 size={14} /> Edit
                </button>
                <button className="flex-1 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold">Tambah Budget</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none">
                  <option value="">Pilih kategori</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Hiburan">Hiburan</option>
                  <option value="Internet">Internet</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Kebutuhan Rumah">Kebutuhan Rumah</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Batas Budget (IDR)</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="500000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Periode</label>
                <input
                  type="month"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
