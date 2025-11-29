'use client'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { LogOut, Wind, ChevronUp, ChevronDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function DashboardHeader() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id

      if (!userId) return

      const { data, error } = await supabase
        .from("perfil")
        .select("nombre, apellido, tipo_usuario")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error cargando perfil:", error.message)
        return
      }

      setUser({
        name: `${data.nombre} ${data.apellido}`,
        role: data.tipo_usuario
      })
    }

    fetchUserData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wind className="h-10 w-10 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">AmbienTrack</h1>
        </div>

        {user && (
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                  {/* <span className="text-xs text-gray-500 capitalize">{user.role}</span>s */}
                   
                </div>
                {isDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2 text-stone-950" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}

