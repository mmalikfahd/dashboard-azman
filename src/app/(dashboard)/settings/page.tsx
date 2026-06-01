"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { User, Bell, Shield, Palette, HelpCircle, LogOut, Camera, Loader2, Upload, X } from "lucide-react"
import { createClient } from "@/lib/client"
import { useTheme } from "@/components/providers/ThemeProvider"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    currency: "IDR",
    avatarUrl: "",
  })
  const [notifications, setNotifications] = useState({
    habitReminder: true,
    budgetAlert: true,
    weeklyReport: false,
    dailyReminder: true,
  })

  useEffect(() => {
    const getUserData = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error || !profileData) {
          setProfile({
            fullName: user.user_metadata?.full_name || "",
            email: user.email || "",
            currency: "IDR",
            avatarUrl: "",
          })
        } else {
          setProfile({
            fullName: profileData?.full_name || user.user_metadata?.full_name || "",
            email: user.email || "",
            currency: profileData?.currency || "IDR",
            avatarUrl: profileData?.avatar_url || "",
          })
        }
      }
      setIsLoading(false)
    }
    
    getUserData()
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 2MB.')
      return
    }

    setIsUploadingAvatar(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setIsUploadingAvatar(false)
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      alert('Gagal upload foto: ' + uploadError.message)
      setIsUploadingAvatar(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
        })
        .eq('id', user.id)
    } else {
      await supabase
        .from('profiles')
        .insert({ 
          id: user.id,
          avatar_url: publicUrl,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
        })
    }

    setProfile({ ...profile, avatarUrl: publicUrl })
    setIsUploadingAvatar(false)
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()
      
      if (existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            full_name: profile.fullName,
          })
          .eq('id', user.id)
        
        if (error) {
          console.error('Error updating profile:', error)
          alert('Gagal menyimpan profil: ' + error.message)
        }
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert({ 
            id: user.id,
            full_name: profile.fullName,
            email: user.email,
          })
        
        if (error) {
          console.error('Error creating profile:', error)
          alert('Gagal membuat profil: ' + error.message)
        }
      }
    }
    
    setIsSaving(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-3xl mx-auto px-0">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Pengaturan</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Kelola akun dan preferensi kamu</p>
      </div>

      {/* Profile Section */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center gap-2 sm:gap-3">
            <User className="text-muted-foreground" size={18} />
            <h2 className="font-semibold text-foreground text-sm sm:text-base">Profil</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-lg sm:text-2xl font-bold overflow-hidden">
                {profile.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-accent rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent/80 transition-colors disabled:opacity-50"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="animate-spin" size={12} />
                ) : (
                  <Camera size={12} />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{profile.fullName || "User"}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{profile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-foreground text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-input bg-muted text-muted-foreground cursor-not-allowed text-sm sm:text-base"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Mata Uang</label>
              <select
                value={profile.currency}
                onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-foreground text-sm sm:text-base appearance-none cursor-pointer"
              >
                <option value="IDR" className="bg-background text-foreground">IDR - Rupiah Indonesia</option>
                <option value="USD" className="bg-background text-foreground">USD - US Dollar</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 text-sm sm:text-base"
          >
            {isSaving && <Loader2 className="animate-spin" size={16} />}
            Simpan
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center gap-2 sm:gap-3">
            <Bell className="text-muted-foreground" size={18} />
            <h2 className="font-semibold text-foreground text-sm sm:text-base">Notifikasi</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {[
            { key: "habitReminder", label: "Reminder Kebiasaan", desc: "Pengingat untuk checklist habit" },
            { key: "budgetAlert", label: "Alert Budget", desc: "Peringatan saat budget hampir habis" },
            { key: "weeklyReport", label: "Laporan Mingguan", desc: "Kirim ringkasan setiap minggu" },
            { key: "dailyReminder", label: "Reminder Harian", desc: "Pengingat untuk mencatat transaksi" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground text-sm sm:text-base">{item.label}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                className={`w-11 h-6 sm:w-12 sm:h-7 rounded-full transition-colors relative flex-shrink-0 ${
                  notifications[item.key as keyof typeof notifications] ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? "translate-x-5 sm:translate-x-6" : "translate-x-0.5 sm:translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="text-muted-foreground" size={18} />
            <h2 className="font-semibold text-foreground text-sm sm:text-base">Keamanan</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <button className="w-full flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4 bg-accent hover:bg-accent/80 rounded-xl transition-colors">
            <span className="font-medium text-foreground text-sm sm:text-base">Ubah Password</span>
            <span className="text-muted-foreground">→</span>
          </button>
          <button className="w-full flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4 bg-accent hover:bg-accent/80 rounded-xl transition-colors">
            <span className="font-medium text-foreground text-sm sm:text-base">Autentikasi Dua Faktor</span>
            <span className="text-muted-foreground">→</span>
          </button>
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center gap-2 sm:gap-3">
            <Palette className="text-muted-foreground" size={18} />
            <h2 className="font-semibold text-foreground text-sm sm:text-base">Tampilan</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-3">Tema</label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button
              onClick={() => theme !== "light" && toggleTheme()}
              className={`p-2 sm:p-4 rounded-xl border-2 ${theme === "light" ? "border-primary" : "border-border"} bg-card hover:border-primary/50 transition-colors`}
            >
              <div className="w-full h-6 sm:h-8 bg-background border border-border rounded mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-medium text-foreground">Light</p>
            </button>
            <button
              onClick={() => theme !== "dark" && toggleTheme()}
              className={`p-2 sm:p-4 rounded-xl border-2 ${theme === "dark" ? "border-primary" : "border-border"} bg-card hover:border-primary/50 transition-colors`}
            >
              <div className="w-full h-6 sm:h-8 bg-foreground rounded mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-medium text-foreground">Dark</p>
            </button>
            <button
              onClick={() => toggleTheme()}
              className="p-2 sm:p-4 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-colors"
            >
              <div className="w-full h-6 sm:h-8 bg-gradient-to-r from-background to-foreground rounded mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-medium text-foreground">System</p>
            </button>
          </div>
        </div>
      </div>

      {/* Help & Logout */}
      <div className="space-y-2 sm:space-y-3">
        <button className="w-full flex items-center gap-2 sm:gap-3 py-2 sm:py-3 px-3 sm:px-4 bg-accent hover:bg-accent/80 rounded-xl transition-colors text-foreground">
          <HelpCircle size={18} className="text-muted-foreground flex-shrink-0" />
          <span className="font-medium text-sm sm:text-base">Pusat Bantuan</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 sm:gap-3 py-2 sm:py-3 px-3 sm:px-4 bg-red-100 hover:bg-red-200 rounded-xl transition-colors text-red-600"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className="font-medium text-sm sm:text-base">Keluar</span>
        </button>
      </div>
    </div>
  )
}
