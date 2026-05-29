"use client"

import { useState } from "react"
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
} from "lucide-react"

const mockHabits = [
  {
    id: 1,
    name: "Belajar coding 2 jam",
    type: "numeric",
    target: 2,
    unit: "jam",
    frequency: "daily",
    streak: 14,
    completionRate: 85,
    isActive: true,
  },
  {
    id: 2,
    name: "Minum air 2 liter",
    type: "numeric",
    target: 8,
    unit: "gelas",
    frequency: "daily",
    streak: 7,
    completionRate: 92,
    isActive: true,
  },
  {
    id: 3,
    name: "Membaca 10 halaman",
    type: "numeric",
    target: 10,
    unit: "halaman",
    frequency: "daily",
    streak: 3,
    completionRate: 45,
    isActive: true,
  },
  {
    id: 4,
    name: "Tidur sebelum jam 23.00",
    type: "checkbox",
    target: 1,
    unit: "",
    frequency: "daily",
    streak: 5,
    completionRate: 68,
    isActive: true,
  },
  {
    id: 5,
    name: "Catat pengeluaran",
    type: "checkbox",
    target: 1,
    unit: "",
    frequency: "daily",
    streak: 21,
    completionRate: 95,
    isActive: true,
  },
]

const todayLogs = [
  { id: 1, habitId: 1, name: "Belajar coding 2 jam", completed: true, value: 2 },
  { id: 2, habitId: 2, name: "Minum air 2 liter", completed: true, value: 8 },
  { id: 3, habitId: 3, name: "Membaca 10 halaman", completed: false, value: 0 },
  { id: 4, habitId: 4, name: "Tidur sebelum jam 23.00", completed: false, value: 0 },
  { id: 5, habitId: 5, name: "Catat pengeluaran", completed: true, value: 1 },
]

export default function HabitsPage() {
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"today" | "all">("today")

  const todayCompleted = todayLogs.filter((l) => l.completed).length
  const todayTotal = todayLogs.length
  const overallRate = Math.round(
    todayLogs.reduce((acc, log) => {
      const habit = mockHabits.find((h) => h.id === log.habitId)
      return acc + (habit?.completionRate || 0)
    }, 0) / todayTotal
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kebiasaan</h1>
          <p className="text-slate-500">Lacak dan bangun kebiasaan baik</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          <Plus size={20} />
          Tambah Habit
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Hari Ini</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {todayCompleted}/{todayTotal}
              </p>
              <p className="text-xs text-slate-500 mt-1">habit selesai</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Best Streak</p>
              <p className="text-2xl font-bold text-orange-500 mt-1 flex items-center gap-1">
                <Flame size={24} /> 21
              </p>
              <p className="text-xs text-slate-500 mt-1">Catat pengeluaran</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flame className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completion Rate</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{overallRate}%</p>
              <p className="text-xs text-slate-500 mt-1">bulan ini</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("today")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "today"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Hari Ini
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "all"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Semua Habit
        </button>
      </div>

      {/* Habit List */}
      {activeTab === "today" ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar size={16} />
              <span>Selasa, 27 May 2026</span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {todayLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <button className={`p-1 rounded-full transition-colors ${
                    log.completed ? "text-green-500" : "text-slate-300 hover:text-green-500"
                  }`}>
                    {log.completed ? (
                      <CheckCircle2 size={28} />
                    ) : (
                      <Circle size={28} />
                    )}
                  </button>
                  <div>
                    <p className={`font-medium ${log.completed ? "text-slate-700" : "text-slate-600"}`}>
                      {log.name}
                    </p>
                    {log.value > 0 && (
                      <p className="text-sm text-slate-500">{log.value}x selesai</p>
                    )}
                  </div>
                </div>
                {!log.completed && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="0"
                      className="w-20 px-3 py-2 text-center border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      Done
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockHabits.map((habit) => (
            <div key={habit.id} className="bg-white rounded-2xl p-5 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{habit.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Target: {habit.target} {habit.unit}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                  <Flame size={14} />
                  {habit.streak} hari
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">Completion Rate</span>
                  <span className="text-sm font-semibold text-slate-900">{habit.completionRate}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${habit.completionRate}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button className="flex-1 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                  <Edit2 size={14} /> Edit
                </button>
                <button className="flex-1 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold">Tambah Habit Baru</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Habit</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="Contoh: Belajar coding 2 jam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipe Habit</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none">
                  <option value="checkbox">Checkbox (ya/tidak)</option>
                  <option value="numeric">Numeric (dengan target angka)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Target</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Unit</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="jam, halaman, dll"
                  />
                </div>
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
