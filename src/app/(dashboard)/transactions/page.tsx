"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  X,
} from "lucide-react"

const mockTransactions = [
  { id: 1, type: "expense", category: "Makanan", amount: 25000, note: "Makan siang", date: "27 May 2026" },
  { id: 2, type: "income", category: "Freelance", amount: 500000, note: "Project website", date: "27 May 2026" },
  { id: 3, type: "expense", category: "Transportasi", amount: 15000, note: "Bensin motor", date: "26 May 2026" },
  { id: 4, type: "expense", category: "Internet", amount: 150000, note: "Paket data bulan Mei", date: "25 May 2026" },
  { id: 5, type: "expense", category: "Hiburan", amount: 75000, note: "Nonton film", date: "24 May 2026" },
  { id: 6, type: "income", category: "Gaji", amount: 4500000, note: "Gaji bulan Mei", date: "20 May 2026" },
  { id: 7, type: "expense", category: "Pendidikan", amount: 100000, note: "Buku programming", date: "18 May 2026" },
  { id: 8, type: "expense", category: "Makanan", amount: 35000, note: "Makan malam", date: "17 May 2026" },
]

const categories = {
  income: ["Gaji", "Freelance", "Uang saku", "Bonus", "Jualan", "Lainnya"],
  expense: ["Makanan", "Transportasi", "Internet", "Hiburan", "Pendidikan", "Kebutuhan rumah", "Lainnya"],
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function TransactionsPage() {
  const [showModal, setShowModal] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  })

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesType = filterType === "all" || tx.type === filterType
    const matchesSearch = tx.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to Supabase
    console.log("Submit:", formData)
    setShowModal(false)
    setFormData({ type: "expense", category: "", amount: "", note: "", date: new Date().toISOString().split("T")[0] })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transaksi</h1>
          <p className="text-slate-500">Kelola pemasukan dan pengeluaranmu</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          <Plus size={20} />
          Tambah Transaksi
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-slate-400" size={20} />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
          >
            <option value="all">Semua</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Transaksi</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Kategori</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Tanggal</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Jumlah</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
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
                      <span className="font-medium text-slate-800">{tx.note}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tx.type === "income"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{tx.date}</td>
                  <td className={`px-6 py-4 text-right font-semibold ${
                    tx.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">Tidak ada transaksi yang ditemukan</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold">Tambah Transaksi</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Type Toggle */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    formData.type === "expense"
                      ? "bg-red-500 text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    formData.type === "income"
                      ? "bg-green-500 text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Pemasukan
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="">Pilih kategori</option>
                  {categories[formData.type as keyof typeof categories].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Jumlah</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Catatan</label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="Opsional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
