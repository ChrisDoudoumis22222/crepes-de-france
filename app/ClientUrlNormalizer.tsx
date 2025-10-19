'use client'
import { useEffect } from 'react'

export default function ClientUrlNormalizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const { pathname, search, hash } = window.location
      const fixed = pathname.replace(/\/{2,}/g, '/')
      if (fixed !== pathname) {
        // No full reload; update address bar silently
        window.history.replaceState(null, '', fixed + search + hash)
      }
    } catch {
      // If anything goes wrong, fallback to a hard replace to root
      window.location.replace('/')
    }
  }, [])
  return null
}
