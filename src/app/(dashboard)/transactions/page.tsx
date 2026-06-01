"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  X,
  Loader2,
} from "lucide-react"
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    note: "",
    transaction_date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const txResult = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("transaction_date", { ascending: false })

    if (txResult.data) setTransactions(txResult.data)
    
    setIsLoading(false)
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === "all" || tx.type === filterType
    const matchesSearch =
      tx.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      user_id: user.id,
      category: formData.category,
      type: formData.type,
      amount: parseFloat(formData.amount),
      note: formData.note,
      transaction_date: formData.transaction_date,
    }

    if (editingId) {
      await supabase
        .from("transactions")
        .update(payload)
        .eq("id", editingId)
    } else {
      await supabase.from("transactions").insert(payload)
    }

    setShowModal(false)
    setEditingId(null)
    setFormData({
      type: "expense",
      category: "",
      amount: "",
      note: "",
      transaction_date: new Date().toISOString().split("T")[0],
    })
    await fetchData()
    setIsSaving(false)
  }

  const handleEdit = (tx: any) => {
    setEditingId(tx.id)
    setFormData({
      type: tx.type,
      category: tx.category || "",
      amount: tx.amount.toString(),
      note: tx.note || "",
      transaction_date: tx.transaction_date,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus transaksi ini?")) return
    
    const supabase = createClient()
    await supabase.from("transactions").delete().eq("id", id)
    await fetchData()
  }

  const openAddModal = () => {
    setEditingId(null)
    setFormData({
      type: "expense",
      category: "",
      amount: "",
      note: "",
      transaction_date: new Date().toISOString().split("T")[0],
    })
    setShowModal(true)
  }

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Transaksi</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Kelola pemasukan dan pengeluaranmu</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base"
        >
          <Plus size={18} />
          Tambah
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
          />
        </div>
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border bg-background">
          <Filter className="text-muted-foreground" size={18} />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-background text-foreground focus:outline-none text-sm sm:text-base appearance-none cursor-pointer"
          >
            <option value="all" className="bg-background text-foreground">Semua</option>
            <option value="income" className="bg-background text-foreground">Pemasukan</option>
            <option value="expense" className="bg-background text-foreground">Pengeluaran</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-accent border-b border-border">
                <tr>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-muted-foreground">Transaksi</th>
                  <th className="hidden sm:table-cell text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Kategori</th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-muted-foreground">Tanggal</th>
                  <th className="text-right px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-muted-foreground">Jumlah</th>
                  <th className="text-right px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => {
                  return (
                    <tr key={tx.id} className="hover:bg-accent transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
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
                          <span className="font-medium text-foreground text-xs sm:text-base truncate">{tx.note || "-"}</span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.type === "income"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {tx.category || tx.type}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-muted-foreground text-xs sm:text-base">{formatDate(tx.transaction_date)}</td>
                      <td className={`px-3 sm:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-base ${
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(tx)}
                            className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-xs sm:text-sm text-muted-foreground">Belum ada transaksi</p>
            <button
              onClick={openAddModal}
              className="mt-2 text-blue-600 hover:underline font-medium text-xs sm:text-sm"
            >
              Tambah transaksi pertama
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border sticky top-0 bg-card">
              <h2 className="text-base sm:text-lg font-semibold">
                {editingId ? "Edit Transaksi" : "Tambah Transaksi"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingId(null)
                }}
                className="text-muted-foreground hover:text-muted-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Type Toggle */}
              <div className="flex gap-2 p-1 bg-accent rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    formData.type === "expense"
                      ? "bg-red-600 text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    formData.type === "income"
                      ? "bg-green-600 text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Pemasukan
                </button>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Kategori</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                  placeholder="Contoh: Makanan, Transportasi"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Jumlah (IDR)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Catatan</label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                  placeholder="Opsional"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Tanggal</label>
                <input
                  type="date"
                  required
                  value={formData.transaction_date}
                  onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
              >
                {isSaving && <Loader2 className="animate-spin" size={16} />}
                {editingId ? "Update" : "Simpan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
