"use client"

import { useState } from "react"
import { X, AlertTriangle } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isDangerous?: boolean
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-background border border-border rounded-lg shadow-lg max-w-sm w-full pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              {isDangerous && (
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              )}
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-border">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                isDangerous
                  ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }`}
            >
              Yakin Hapus
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
