import { describe, expect, it } from "vitest"

import {
  isValidChannelId,
  isValidHandle,
  isValidPageToken,
  isValidPlaylistId,
  isValidVideoId,
} from "@/lib/validators"

describe("isValidHandle", () => {
  it("accepts simple @handle", () => {
    expect(isValidHandle("@MrBeast")).toBe(true)
    expect(isValidHandle("MrBeast")).toBe(true)
  })

  it("accepts handles with dots, underscores, and hyphens", () => {
    expect(isValidHandle("mr.beast_official")).toBe(true)
    expect(isValidHandle("channel-name")).toBe(true)
  })

  it("rejects empty and single-character values", () => {
    expect(isValidHandle("")).toBe(false)
    expect(isValidHandle("a")).toBe(false)
  })

  it("rejects values longer than 100 characters", () => {
    expect(isValidHandle("a".repeat(101))).toBe(false)
  })

  it("rejects values with spaces or angle brackets", () => {
    expect(isValidHandle("mr beast")).toBe(false)
    expect(isValidHandle("<script>")).toBe(false)
  })
})

describe("isValidChannelId", () => {
  it("accepts a valid 24-char channel ID", () => {
    expect(isValidChannelId("UCX6OQ3DkcsbYNE6H8uQQuVA")).toBe(true)
    expect(isValidChannelId("UC-9-kyTW8ZkZNDHQJ6FgpwQ")).toBe(true)
  })

  it("rejects IDs that don't start with UC", () => {
    expect(isValidChannelId("UUX6OQ3DkcsbYNE6H8uQQuVA")).toBe(false)
    expect(isValidChannelId("UCX6OQ3")).toBe(false)
  })

  it("rejects too-short or too-long IDs", () => {
    expect(isValidChannelId("UC12345")).toBe(false)
    expect(isValidChannelId("UC" + "a".repeat(30))).toBe(false)
  })
})

describe("isValidPlaylistId", () => {
  it("accepts uploads playlist (UU prefix)", () => {
    expect(isValidPlaylistId("UUX6OQ3DkcsbYNE6H8uQQuVA")).toBe(true)
  })

  it("accepts public playlist (PL prefix)", () => {
    expect(isValidPlaylistId("PLbpi6ZahtOH6Ar_3GPy3lkjgAVRoukpgs")).toBe(true)
  })

  it("rejects IDs that are too short", () => {
    expect(isValidPlaylistId("PL123")).toBe(false)
  })

  it("rejects IDs with special characters", () => {
    expect(isValidPlaylistId("PL<script>")).toBe(false)
    expect(isValidPlaylistId("PL test")).toBe(false)
  })
})

describe("isValidVideoId", () => {
  it("accepts 11-character video IDs", () => {
    expect(isValidVideoId("dQw4w9WgXcQ")).toBe(true)
    expect(isValidVideoId("_9VUPq3SxOc")).toBe(true)
  })

  it("rejects IDs that are not exactly 11 characters", () => {
    expect(isValidVideoId("dQw4w9WgXc")).toBe(false)
    expect(isValidVideoId("dQw4w9WgXcQQ")).toBe(false)
  })

  it("rejects IDs with spaces or special characters", () => {
    expect(isValidVideoId("dQw4w9WgX!Q")).toBe(false)
  })
})

describe("isValidPageToken", () => {
  it("accepts valid base64url page tokens", () => {
    expect(isValidPageToken("EAAYACIGCMiBhrEB")).toBe(true)
    expect(isValidPageToken("CAUQAA")).toBe(true)
  })

  it("rejects tokens longer than 500 characters", () => {
    expect(isValidPageToken("a".repeat(501))).toBe(false)
  })

  it("rejects tokens with angle brackets or spaces", () => {
    expect(isValidPageToken("token<script>")).toBe(false)
    expect(isValidPageToken("token value")).toBe(false)
  })
})
