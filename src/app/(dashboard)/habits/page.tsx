"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import {
  Plus,
  CheckCircle2,
  Circle,
  Flame,
  TrendingUp,
  Calendar,
  X,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react"
import { createClient } from "@/lib/client"

// Force dynamic rendering
export const dynamic = "force-dynamic"

function getToday() {
  return new Date().toISOString().split("T")[0]
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Selamat pagi"
  if (hour < 18) return "Selamat sore"
  return "Selamat malam"
}

function calculateStreak(logs: any[]) {
  if (!logs || logs.length === 0) return 0
  
  const sortedDates = logs
    .filter((log) => log.is_completed)
    .map((log) => log.log_date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  
  if (sortedDates.length === 0) return 0
  
  let streak = 0
  let currentDate = new Date(getToday())
  
  for (const dateStr of sortedDates) {
    const logDate = new Date(dateStr)
    const diffDays = Math.floor(
      (currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (diffDays === 0 || diffDays === 1) {
      streak++
      currentDate = logDate
    } else {
      break
    }
  }
  
  return streak
}

function calculateCompletionRate(logs: any[], habitCreatedAt: string) {
  if (!logs || logs.length === 0) return 0
  
  const created = new Date(habitCreatedAt)
  const today = new Date(getToday())
  const totalDays = Math.max(1, Math.ceil(
    (today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  ))
  
  const completedDays = logs.filter((log) => log.is_completed).length
  return Math.round((completedDays / totalDays) * 100)
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<any[]>([])
  const [habitLogs, setHabitLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"today" | "all">("today")
  const [isSaving, setIsSaving] = useState(false)
  const [editingHabit, setEditingHabit] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    habit_type: "checkbox",
    target_value: "1",
    unit: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = getToday()

    const [habitsResult, allLogsResult, todayLogsResult] = await Promise.all([
      supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("log_date", { ascending: false }),
      supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", today),
    ])

    if (habitsResult.data) {
      const habitsWithStats = habitsResult.data.map((habit: any) => {
        const habitLogsForHabit = allLogsResult.data?.filter(
          (log: any) => log.habit_id === habit.id
        ) || []
        const streak = calculateStreak(habitLogsForHabit)
        const completion_rate = calculateCompletionRate(
          habitLogsForHabit,
          habit.created_at
        )
        return { ...habit, streak, completion_rate }
      })
      setHabits(habitsWithStats)
    }

    if (todayLogsResult.data) setHabitLogs(todayLogsResult.data)
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsSaving(false)
      return
    }

    // Validasi form
    if (!formData.name.trim()) {
      alert("Nama habit tidak boleh kosong")
      setIsSaving(false)
      return
    }

    if (formData.habit_type === "numeric") {
      if (!formData.target_value || parseFloat(formData.target_value) <= 0) {
        alert("Target value harus diisi dan lebih dari 0 untuk habit numeric")
        setIsSaving(false)
        return
      }
      if (!formData.unit.trim()) {
        alert("Unit harus diisi untuk habit numeric (contoh: jam, halaman, dll)")
        setIsSaving(false)
        return
      }
    }

    if (editingHabit) {
      // Update payload - jangan include user_id
      const updatePayload: Record<string, any> = {
        name: formData.name,
        habit_type: formData.habit_type,
        frequency: "daily",
      }

      if (formData.habit_type === "numeric") {
        updatePayload.target_value = parseFloat(formData.target_value) || 1
        updatePayload.unit = formData.unit
      } else {
        updatePayload.target_value = null
        updatePayload.unit = null
      }
      
      if (formData.description) {
        updatePayload.description = formData.description
      } else {
        updatePayload.description = null
      }

      const { error } = await supabase
        .from("habits")
        .update(updatePayload)
        .eq("id", editingHabit.id)
        .eq("user_id", user.id)
      
      if (error) {
        console.error("Error updating habit:", error)
        alert("Gagal mengupdate habit: " + (error.message || "Unknown error"))
        setIsSaving(false)
        return
      }
    } else {
      // Insert payload - include user_id
      const insertPayload: Record<string, any> = {
        user_id: user.id,
        name: formData.name,
        habit_type: formData.habit_type,
        frequency: "daily",
      }

      if (formData.habit_type === "numeric") {
        insertPayload.target_value = parseFloat(formData.target_value) || 1
        insertPayload.unit = formData.unit
      } else {
        insertPayload.target_value = 1
        insertPayload.unit = null
      }
      
      if (formData.description) {
        insertPayload.description = formData.description
      }

      console.log("Insert payload:", insertPayload)
      const { data: newHabit, error: insertError } = await supabase
        .from("habits")
        .insert(insertPayload)
        .select()
        .single()
      
      if (insertError) {
        console.error("Error inserting habit:", insertError)
        console.error("Insert payload was:", insertPayload)
        alert("Gagal menyimpan habit: " + (insertError.message || JSON.stringify(insertError)))
        setIsSaving(false)
        return
      }
      
      if (newHabit) {
        const { error: logError } = await supabase.from("habit_logs").insert({
          user_id: user.id,
          habit_id: newHabit.id,
          log_date: getToday(),
          is_completed: false,
          value: 0,
        })
        
        if (logError) {
          console.error("Error creating habit log:", logError)
        }
      }
    }

    setShowModal(false)
    setEditingHabit(null)
    setFormData({ name: "", description: "", habit_type: "checkbox", target_value: "1", unit: "" })
    await fetchData()
    setIsSaving(false)
  }

  const handleEdit = (habit: any) => {
    setEditingHabit(habit)
    setFormData({
      name: habit.name,
      description: habit.description || "",
      habit_type: habit.habit_type,
      target_value: habit.target_value?.toString() || "1",
      unit: habit.unit || "",
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus habit ini?")) return
    
    const supabase = createClient()
    await supabase.from("habits").delete().eq("id", id)
    await fetchData()
  }

  const handleToggleHabit = async (habit: any) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const existingLog = habitLogs.find((log) => log.habit_id === habit.id)

    if (existingLog) {
      await supabase
        .from("habit_logs")
        .update({ 
          is_completed: !existingLog.is_completed,
          value: !existingLog.is_completed ? (habit.target_value || 1) : 0,
        })
        .eq("id", existingLog.id)
    } else {
      await supabase.from("habit_logs").insert({
        user_id: user.id,
        habit_id: habit.id,
        log_date: getToday(),
        is_completed: true,
        value: habit.target_value || 1,
      })
    }

    await fetchData()
  }

  const openAddModal = () => {
    setEditingHabit(null)
    setFormData({ name: "", description: "", habit_type: "checkbox", target_value: "1", unit: "" })
    setShowModal(true)
  }

  const todayLogsMap = habitLogs.reduce((acc: any, log) => {
    acc[log.habit_id] = log
    return acc
  }, {})

  const todayCompleted = habitLogs.filter((l) => l.is_completed).length
  const todayTotal = habits.length
  const overallRate = todayTotal > 0 
    ? Math.round((todayCompleted / todayTotal) * 100) 
    : 0

  const bestStreakHabit = habits.reduce((best: any, habit) => {
    return habit.streak > (best?.streak || 0) ? habit : best
  }, null)

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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Kebiasaan</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Lacak dan bangun kebiasaan baik</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base"
        >
          <Plus size={18} />
          Tambah
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Hari Ini</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-1">
                {todayCompleted}/{todayTotal}
              </p>
              <p className="text-xs text-muted-foreground mt-1">selesai</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Best Streak</p>
              <p className="text-lg sm:text-2xl font-bold text-orange-500 mt-1 flex items-center gap-1">
                <Flame size={18} /> {bestStreakHabit?.streak || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {bestStreakHabit?.name || "-"}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Flame className="text-orange-500" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Completion</p>
              <p className="text-lg sm:text-2xl font-bold text-primary mt-1">{overallRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">bulan ini</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-primary" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-accent rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("today")}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            activeTab === "today"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Hari Ini
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            activeTab === "all"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Semua
        </button>
      </div>

      {/* Habit List */}
      {activeTab === "today" ? (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-border bg-accent">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Calendar size={14} />
              <span>
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </div>
          {habits.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {habits.map((habit) => {
                const log = todayLogsMap[habit.id]
                const isCompleted = log?.is_completed || false
                const isBadHabit = habit.habit_type === "bad_habit"
                return (
                  <div key={habit.id} className={`flex items-center justify-between p-3 sm:p-4 hover:bg-accent ${isBadHabit ? 'bg-orange-50 dark:bg-orange-950/20' : ''}`}>
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                      <button
                        onClick={() => handleToggleHabit(habit)}
                        className={`p-1 rounded-full transition-colors flex-shrink-0 ${
                          isBadHabit
                            ? isCompleted ? "text-orange-500" : "text-slate-300 hover:text-orange-500"
                            : isCompleted ? "text-green-500" : "text-slate-300 hover:text-green-500"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={24} />
                        ) : (
                          <Circle size={24} />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium text-sm sm:text-base truncate ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                          {habit.name}
                          {isBadHabit && <span className="ml-2 text-xs text-orange-500 font-normal">(Buruk)</span>}
                        </p>
                        {habit.habit_type === "numeric" && (
                          <p className="text-xs text-muted-foreground">
                            Target: {habit.target_value} {habit.unit}
                          </p>
                        )}
                        {isBadHabit && (
                          <p className="text-xs text-orange-500">
                            Bad Habit
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-xs sm:text-sm text-muted-foreground">Belum ada habit</p>
              <button
                onClick={openAddModal}
                className="mt-2 text-blue-600 hover:underline font-medium text-xs sm:text-sm"
              >
                Tambah habit pertama
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {habits.map((habit) => {
            const log = todayLogsMap[habit.id]
            const isCompleted = log?.is_completed || false
            const isBadHabit = habit.habit_type === "bad_habit"
            return (
              <div key={habit.id} className={`bg-card rounded-2xl p-4 sm:p-5 border ${isBadHabit ? 'border-orange-300' : 'border-border'}`}>
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{habit.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {habit.habit_type === "checkbox"
                        ? "Checkbox"
                        : habit.habit_type === "bad_habit"
                        ? "Bad Habit"
                        : `Target: ${habit.target_value} ${habit.unit}`}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isBadHabit ? 'bg-orange-100 text-orange-600' : 'bg-orange-100 text-orange-500'
                  }`}>
                    <Flame size={12} />
                    {habit.streak || 0}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      {isBadHabit ? 'Reduction' : 'Completion'}
                    </span>
                    <span className="text-xs font-semibold text-foreground">{habit.completion_rate || 0}%</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isBadHabit ? 'bg-orange-500' : 'bg-blue-500'}`}
                      style={{ width: `${habit.completion_rate || 0}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <button
                    onClick={() => handleEdit(habit)}
                    className="flex-1 py-2 text-xs sm:text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="flex-1 py-2 text-xs sm:text-sm text-muted-foreground hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border sticky top-0 bg-card">
              <h2 className="text-base sm:text-lg font-semibold">
                {editingHabit ? "Edit Habit" : "Tambah Habit Baru"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingHabit(null)
                }}
                className="text-muted-foreground hover:text-muted-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Nama Habit</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                  placeholder="Contoh: Belajar coding 2 jam"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Tipe Habit</label>
                <select
                  value={formData.habit_type}
                  onChange={(e) => setFormData({ ...formData, habit_type: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base appearance-none cursor-pointer"
                >
                  <option value="checkbox" className="bg-background text-foreground">Checkbox (ya/tidak)</option>
                  <option value="numeric" className="bg-background text-foreground">Numeric (dengan target angka)</option>
                  <option value="bad_habit" className="bg-background text-foreground">Bad Habit (kurangi)</option>
                </select>
              </div>

              {formData.habit_type === "numeric" && (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Target</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.target_value}
                      onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Unit</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                      placeholder="jam, halaman"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
              >
                {isSaving && <Loader2 className="animate-spin" size={16} />}
                {editingHabit ? "Update" : "Simpan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
