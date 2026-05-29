"use client"

import { useState } from "react"
import { User, Bell, Shield, Palette, HelpCircle, LogOut, Camera } from "lucide-react"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    fullName: "Azman",
    email: "azman@email.com",
    currency: "IDR",
  })

  const [notifications, setNotifications] = useState({
    habitReminder: true,
    budgetAlert: true,
    weeklyReport: false,
    dailyReminder: true,
  })

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-500">Kelola akun dan preferensi kamu</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <User className="text-slate-400" size={20} />
            <h2 className="font-semibold text-slate-900">Profil</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                A
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{profile.fullName}</h3>
              <p className="text-sm text-slate-500">{profile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mata Uang</label>
              <select
                value={profile.currency}
                onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="IDR">IDR - Rupiah Indonesia</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>
          </div>

          <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Bell className="text-slate-400" size={20} />
            <h2 className="font-semibold text-slate-900">Notifikasi</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: "habitReminder", label: "Reminder Kebiasaan", desc: "Pengingat untuk checklist habit harian" },
            { key: "budgetAlert", label: "Alert Budget", desc: "Peringatan saat budget hampir habis" },
            { key: "weeklyReport", label: "Laporan Mingguan", desc: "Kirim ringkasan setiap minggu" },
            { key: "dailyReminder", label: "Reminder Harian", desc: "Pengingat untuk mencatat transaksi" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{item.label}</p>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  notifications[item.key as keyof typeof notifications] ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Shield className="text-slate-400" size={20} />
            <h2 className="font-semibold text-slate-900">Keamanan</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <button className="w-full flex items-center justify-between py-3 px-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
            <span className="font-medium text-slate-700">Ubah Password</span>
            <span className="text-slate-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between py-3 px-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
            <span className="font-medium text-slate-700">Autentikasi Dua Faktor</span>
            <span className="text-slate-400">→</span>
          </button>
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Palette className="text-slate-400" size={20} />
            <h2 className="font-semibold text-slate-900">Tampilan</h2>
          </div>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">Tema</label>
          <div className="grid grid-cols-3 gap-3">
            <button className="p-4 rounded-xl border-2 border-blue-500 bg-white">
              <div className="w-full h-8 bg-white border border-slate-200 rounded mb-2" />
              <p className="text-sm font-medium text-slate-700">Light</p>
            </button>
            <button className="p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300">
              <div className="w-full h-8 bg-slate-800 rounded mb-2" />
              <p className="text-sm font-medium text-slate-700">Dark</p>
            </button>
            <button className="p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300">
              <div className="w-full h-8 bg-gradient-to-r from-white to-slate-800 rounded mb-2" />
              <p className="text-sm font-medium text-slate-700">System</p>
            </button>
          </div>
        </div>
      </div>

      {/* Help & Logout */}
      <div className="space-y-3">
        <button className="w-full flex items-center gap-3 py-3 px-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-700">
          <HelpCircle size={20} className="text-slate-400" />
          <span className="font-medium">Pusat Bantuan</span>
        </button>
        <button className="w-full flex items-center gap-3 py-3 px-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-red-600">
          <LogOut size={20} />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </div>
  )
}
