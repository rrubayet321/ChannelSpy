"use client"

import { useCallback, useEffect, useState } from "react"
import type { Channel } from "@/lib/types"

const STORAGE_KEY = "channelspy_recent"
const MAX_RECENT = 6

export type RecentChannel = {
  handle: string
  title: string
  thumbnailUrl: string
  subscriberCount: number
  savedAt: number
}

function toRecentChannel(channel: Channel, input: string): RecentChannel {
  const handle = channel.handle
    ? `@${channel.handle}`
    : input.trim().startsWith("@")
      ? input.trim()
      : input.trim()
  return {
    handle,
    title: channel.title,
    thumbnailUrl: channel.thumbnailUrl,
    subscriberCount: channel.subscriberCount,
    savedAt: Date.now(),
  }
}

function readFromStorage(): RecentChannel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeToStorage(channels: RecentChannel[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(channels))
  } catch {
    // Storage quota exceeded or private browsing — degrade silently
  }
}

export function useRecentChannels() {
  const [recents, setRecents] = useState<RecentChannel[]>([])

  useEffect(() => {
    setRecents(readFromStorage())
  }, [])

  const addRecent = useCallback((channel: Channel, input: string) => {
    setRecents((prev) => {
      const entry = toRecentChannel(channel, input)
      // Replace existing entry for same handle to avoid duplicates
      const filtered = prev.filter(
        (r) => r.handle.toLowerCase() !== entry.handle.toLowerCase(),
      )
      const next = [entry, ...filtered].slice(0, MAX_RECENT)
      writeToStorage(next)
      return next
    })
  }, [])

  const clearRecents = useCallback(() => {
    writeToStorage([])
    setRecents([])
  }, [])

  return { recents, addRecent, clearRecents }
}
