'use client'

import { useEffect } from 'react'
import { AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">Oops! Ada Kesalahan</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {error.message || 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'}
        </p>

        {error.digest && (
          <p className="text-xs text-muted-foreground mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Coba Lagi
          </button>
          <Link
            href="/dashboard"
            className="flex-1 px-4 py-2 bg-accent text-foreground rounded-xl font-medium hover:bg-accent/80 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={18} />
            <span>Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
