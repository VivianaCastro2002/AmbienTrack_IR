"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/ambientrack/gestion-salas")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">Redirigiendo al dashboard...</p>
    </div>
  )
}
