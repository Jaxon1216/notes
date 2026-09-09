export type FixedWindowRateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
  resetAt: number
}

type FixedWindowEntry = {
  count: number
  resetAt: number
}

type FixedWindowRateLimiterOptions = {
  limit: number
  windowMs: number
  maxEntries: number
}

/**
 * In-memory fixed-window limiting is intentionally best-effort: each warm
 * server instance has its own bounded state and no external service is needed.
 */
export class FixedWindowRateLimiter {
  private readonly entries = new Map<string, FixedWindowEntry>()
  private checksSincePrune = 0

  constructor(private readonly options: FixedWindowRateLimiterOptions) {
    if (
      !Number.isInteger(options.limit) ||
      options.limit <= 0 ||
      !Number.isInteger(options.windowMs) ||
      options.windowMs <= 0 ||
      !Number.isInteger(options.maxEntries) ||
      options.maxEntries <= 0
    ) {
      throw new Error('Fixed-window rate-limit options must be positive integers.')
    }
  }

  check(key: string, now = Date.now()): FixedWindowRateLimitResult {
    this.checksSincePrune += 1
    if (this.checksSincePrune >= 64) {
      this.pruneExpired(now)
      this.checksSincePrune = 0
    }

    const current = this.entries.get(key)

    if (!current || now >= current.resetAt) {
      if (current) {
        this.entries.delete(key)
      }

      this.ensureCapacity(now)

      const resetAt = now + this.options.windowMs
      this.entries.set(key, { count: 1, resetAt })

      return {
        allowed: true,
        remaining: this.options.limit - 1,
        retryAfterSeconds: 0,
        resetAt,
      }
    }

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000),
    )

    if (current.count >= this.options.limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds,
        resetAt: current.resetAt,
      }
    }

    current.count += 1

    return {
      allowed: true,
      remaining: this.options.limit - current.count,
      retryAfterSeconds: 0,
      resetAt: current.resetAt,
    }
  }

  get entryCount() {
    return this.entries.size
  }

  private ensureCapacity(now: number) {
    if (this.entries.size < this.options.maxEntries) return

    this.pruneExpired(now)

    while (this.entries.size >= this.options.maxEntries) {
      const oldestKey = this.entries.keys().next().value as string | undefined
      if (oldestKey === undefined) break
      this.entries.delete(oldestKey)
    }
  }

  private pruneExpired(now: number) {
    for (const [key, entry] of this.entries) {
      if (now >= entry.resetAt) {
        this.entries.delete(key)
      }
    }
  }
}
