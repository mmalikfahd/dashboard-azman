"use client"

import { useState, useEffect } from "react"
import { Plus, AlertCircle, CheckCircle2, X, Edit2, Trash2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/client"

interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  month: number;
  year: number;
  created_at?: string;
}

interface Expense {
  id: string;
  user_id: string;
  category: string;
  type: string;
  amount: string | number;
  note?: string;
  transaction_date: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
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

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const startDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`
    const endDate = new Date(currentYear, currentMonth, 0).toISOString().split("T")[0]

    console.log("Date range:", startDate, "to", endDate)

    const [budgetsResult, expensesResult] = await Promise.all([
      supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", currentMonth)
        .eq("year", currentYear)
        .order("created_at", { ascending: true }),
      supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "expense"),
    ])

    console.log("Budgets result:", budgetsResult.data?.length, "expenses result:", expensesResult.data?.length)

    if (budgetsResult.data) setBudgets(budgetsResult.data)
    if (expensesResult.data) {
      const monthExpenses = expensesResult.data.filter((e: any) => {
        const txDate = e.transaction_date
        return txDate >= startDate && txDate <= endDate
      })
      console.log("Filtered expenses for this month:", monthExpenses.length)
      setExpenses(monthExpenses)
    }
    setIsLoading(false)
  }

  const getSpentAmount = (categoryName: string) => {
    const catNormalized = normalizeCategory(categoryName)
    const filtered = expenses.filter((e) => normalizeCategory(e.category || "") === catNormalized)
    return filtered.reduce((sum, e) => sum + (parseFloat(String(e.amount)) || 0), 0)
  }

  const getStatus = (spent: number, limit: number) => {
    const percentage = Math.round((spent / limit) * 100)
    if (percentage >= 100) return { label: "Melebihi Budget", color: "text-red-600", bg: "bg-red-100", barColor: "bg-red-500" }
    if (percentage >= 70) return { label: "Hampir Habis", color: "text-yellow-600", bg: "bg-yellow-100", barColor: "bg-yellow-500" }
    return { label: "Aman", color: "text-green-600", bg: "bg-green-100", barColor: "bg-blue-500" }
  }

  const totalBudget = budgets.reduce((sum, b) => sum + (parseFloat(b.amount.toString()) || 0), 0)
  const totalSpent = budgets.reduce((sum, b) => sum + getSpentAmount(b.category), 0)
  const totalPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      user_id: user.id,
      category: formData.category,
      amount: parseFloat(formData.amount),
      month: formData.month,
      year: formData.year,
    }

    if (editingBudget) {
      await supabase
        .from("budgets")
        .update(payload)
        .eq("id", editingBudget.id)
    } else {
      await supabase.from("budgets").insert(payload)
    }

    setShowModal(false)
    setEditingBudget(null)
    setFormData({ category: "", amount: "", month: new Date().getMonth() + 1, year: new Date().getFullYear() })
    await fetchData()
    setIsSaving(false)
  }

  const openAddModal = () => {
    setEditingBudget(null)
    setFormData({ category: "", amount: "", month: new Date().getMonth() + 1, year: new Date().getFullYear() })
    setShowModal(true)
  }

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category || "",
      amount: budget.amount.toString(),
      month: budget.month,
      year: budget.year,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus budget ini?")) return
    
    const supabase = createClient()
    await supabase.from("budgets").delete().eq("id", id)
    await fetchData()
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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Budget</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Kelola batas pengeluaran per kategori</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base"
        >
          <Plus size={18} />
          Tambah
        </button>
      </div>

      {/* Summary */}
      <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
        <div className="flex items-center justify-between mb-4 gap-2">
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Total Budget Bulan Ini</h3>
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
            totalPercentage >= 100 ? "bg-red-100 text-red-600" :
            totalPercentage >= 70 ? "bg-yellow-100 text-yellow-600" :
            "bg-green-100 text-green-600"
          }`}>
            {totalPercentage >= 100 ? "Melebihi" :
             totalPercentage >= 70 ? "Hampir Habis" : "Aman"}
          </span>
        </div>
        <div className="flex items-end justify-between mb-2 gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-2xl sm:text-3xl font-bold text-foreground truncate">{formatCurrency(totalSpent)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">dari {formatCurrency(totalBudget)}</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground flex-shrink-0">{totalPercentage}%</p>
        </div>
        <div className="h-3 sm:h-4 bg-accent rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              totalPercentage >= 100 ? "bg-red-500" :
              totalPercentage >= 70 ? "bg-yellow-500" : "bg-primary"
            }`}
            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Budget List */}
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {budgets.map((budget) => {
            const budgetAmount = parseFloat(budget.amount.toString()) || 0
            const spent = getSpentAmount(budget.category)
            const percentage = Math.round(budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0)
            const status = getStatus(spent, budgetAmount)

            return (
              <div key={budget.id} className="bg-card rounded-2xl p-4 sm:p-5 border border-border">
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-xl flex items-center justify-center text-lg sm:text-2xl flex-shrink-0">
                      📦
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{budget.category || "Unknown"}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  {percentage >= 100 ? (
                    <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                  ) : percentage >= 70 ? (
                    <AlertCircle className="text-yellow-600 flex-shrink-0" size={18} />
                  ) : (
                    <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground truncate">
                      {formatCurrency(spent)} / {formatCurrency(parseFloat(budget.amount.toString()) || 0)}
                    </span>
                    <span className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${status.color}`}>{percentage}%</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-accent rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${status.barColor}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {percentage >= 100 && (
                  <div className="flex items-center gap-1 text-xs text-red-600 mb-3">
                    <AlertCircle size={12} />
                    <span>Melebihi {formatCurrency(spent - (parseFloat(budget.amount.toString()) || 0))}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="flex-1 py-2 text-xs sm:text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="flex-1 py-2 text-xs sm:text-sm text-muted-foreground hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border text-center py-8 sm:py-12">
          <p className="text-xs sm:text-sm text-muted-foreground">Belum ada budget</p>
          <button
            onClick={openAddModal}
            className="mt-2 text-blue-600 hover:underline font-medium text-xs sm:text-sm"
          >
            Tambah budget pertama
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border sticky top-0 bg-card">
              <h2 className="text-base sm:text-lg font-semibold">
                {editingBudget ? "Edit Budget" : "Tambah Budget"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingBudget(null)
                }}
                className="text-muted-foreground hover:text-muted-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
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
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Batas Budget (IDR)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                  placeholder="500000"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
              >
                {isSaving && <Loader2 className="animate-spin" size={16} />}
                {editingBudget ? "Update" : "Simpan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
