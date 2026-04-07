import { useState, useEffect, useMemo } from 'react'

// ─── Placeholder URLs (replace with real URLs when ready) ───────────────────
// Search for "PLACEHOLDER_" to find all URLs that need replacing.

export const NOW_CONFIG = {
  prices: {
    indonesia: 'Rp. 99.000',
    world: '$5.99',
  },
  buyUrls: {
    mayar: 'https://PLACEHOLDER_MAYAR_URL.example.com/now',    // Indonesia
    paddle: 'https://PLACEHOLDER_PADDLE_URL.example.com/now',  // Rest of world
  },
  downloadUrls: {
    windows: 'https://PLACEHOLDER_DOWNLOAD.example.com/now-windows.exe',
    macos: 'https://PLACEHOLDER_DOWNLOAD.example.com/now-macos.dmg',
    linux: 'https://PLACEHOLDER_DOWNLOAD.example.com/now-linux.AppImage',
  },
} as const

// ─── Geolocation hook ───────────────────────────────────────────────────────

export function useCountryCode() {
  const [countryCode, setCountryCode] = useState<string | null>(() => {
    try { return sessionStorage.getItem('now_country_code') } catch { return null }
  })
  const [loading, setLoading] = useState(() => {
    try { return !sessionStorage.getItem('now_country_code') } catch { return true }
  })

  useEffect(() => {
    if (countryCode) return

    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const code = data.country_code || null
        if (code) {
          try { sessionStorage.setItem('now_country_code', code) } catch { /* noop */ }
        }
        setCountryCode(code)
      })
      .catch(() => setCountryCode(null))
      .finally(() => setLoading(false))
  }, [countryCode])

  return {
    countryCode,
    isIndonesia: countryCode === 'ID',
    loading,
  }
}

// ─── OS detection hook ──────────────────────────────────────────────────────

export type DetectedOS = 'windows' | 'macos' | 'linux' | 'unknown'

export function useDetectedOS(): DetectedOS {
  return useMemo(() => {
    const ua = navigator.userAgent
    if (ua.includes('Win')) return 'windows'
    if (ua.includes('Mac')) return 'macos'
    if (ua.includes('Linux')) return 'linux'
    return 'unknown'
  }, [])
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const OS_LABELS: Record<DetectedOS, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  unknown: 'Windows',
}

export function getOSLabel(os: DetectedOS): string {
  return OS_LABELS[os]
}

export function getDownloadUrl(os: DetectedOS): string {
  const key = os === 'unknown' ? 'windows' : os
  return NOW_CONFIG.downloadUrls[key]
}
