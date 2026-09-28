import { useState, useEffect, useMemo } from 'react'

// ─── Placeholder URLs (replace with real URLs when ready) ───────────────────
// Search for "PLACEHOLDER_" to find all URLs that need replacing.

export const NOW_CONFIG = {
  prices: {
    indonesia: 'Rp. 99.000',
    world: '$5.99',
  },
  buyUrls: {
    mayar: 'https://xandr.myr.id/catalog/now-desktop-pixel-companion',    // Indonesia
    polar: 'https://PLACEHOLDER_POLAR_URL.example.com/now',    // Rest of world
  },
  downloadUrls: {
    windows: 'https://dl.ricardoalexander.dev/releases/v0.1.0/Now_0.1.0_x64-setup.exe',
    macos: 'https://PLACEHOLDER_DOWNLOAD.example.com/now-macos.dmg',
    linux: 'https://PLACEHOLDER_DOWNLOAD.example.com/now-linux.AppImage',
  },
  // Platforms whose download is live. The rest show "Coming Soon" across the page.
  availablePlatforms: {
    windows: true,
    macos: false,
    linux: false,
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

export type Platform = 'windows' | 'macos' | 'linux'
export type DetectedOS = Platform | 'mobile' | 'unknown'

export function useDetectedOS(): DetectedOS {
  return useMemo(() => {
    const ua = navigator.userAgent
    // Check phones/tablets first: iPhone UAs contain "Mac OS X" and Android UAs contain "Linux".
    // iPadOS reports a desktop Mac UA, so touch support is what gives it away.
    if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return 'mobile'
    if (ua.includes('Mac') && navigator.maxTouchPoints > 1) return 'mobile'
    if (ua.includes('Win')) return 'windows'
    if (ua.includes('Mac')) return 'macos'
    if (ua.includes('Linux')) return 'linux'
    return 'unknown'
  }, [])
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export const PLATFORMS: Platform[] = ['windows', 'macos', 'linux']

const PLATFORM_LABELS: Record<Platform, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
}

export function getPlatformLabel(platform: Platform): string {
  return PLATFORM_LABELS[platform]
}

export function isPlatformAvailable(platform: Platform): boolean {
  return NOW_CONFIG.availablePlatforms[platform]
}

// False while a URL in NOW_CONFIG is still a PLACEHOLDER_ value
export function isLiveUrl(url: string): boolean {
  return !url.includes('PLACEHOLDER_')
}

export function getDownloadUrl(platform: Platform): string {
  return NOW_CONFIG.downloadUrls[platform]
}

// "Windows", "macOS and Linux", "Windows, macOS, and Linux"
export function joinPlatformLabels(platforms: Platform[]): string {
  const labels = platforms.map(getPlatformLabel)
  if (labels.length <= 2) return labels.join(' and ')
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`
}
