"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function useSupabaseQuery<T>(query: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await query()
        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, dependencies)

  return { data, loading, error, refetch: () => query() }
}

export function useRealtimeSubscription<T>(table: string, callback: (payload: any) => void) {
  useEffect(() => {
    const subscription = supabase
      .channel(`realtime-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, callback)
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [table, callback])
}
