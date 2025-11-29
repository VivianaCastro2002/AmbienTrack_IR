"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation'


export default function AuthForm() {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    nombre: "",
    apellido: "",
    tipoUsuario: "admin",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [mensaje, setMensaje] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMensaje("")

    const { email, password } = loginForm
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        setError(error.message)
        return
    }
    router.push("/ambientrack/gestion-salas")

  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMensaje("")

    const { email, password, confirmPassword, nombre, apellido, tipoUsuario } = registerForm
    if (password !== confirmPassword) return setError("Las contraseñas no coinciden")

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) return setError(signUpError.message)

    const userId = data?.user?.id
    if (userId) {
      const { error: perfilError } = await supabase.from("perfil").insert({
        id: userId,
        nombre,
        apellido,
        tipo_usuario: tipoUsuario,
      })
      if (perfilError) return setError(perfilError.message)
    }

    setMensaje("Cuenta creada correctamente")
  }

  return (
    
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label>Correo Electrónico</Label>
                    <Input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Contraseña</Label>
                    <Input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>

                  {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}
                  <Button type="submit" className="w-full">Entrar</Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        value={registerForm.nombre}
                        onChange={(e) => setRegisterForm({ ...registerForm, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Apellido</Label>
                      <Input
                        value={registerForm.apellido}
                        onChange={(e) => setRegisterForm({ ...registerForm, apellido: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Correo Electrónico</Label>
                    <Input
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Contraseña</Label>
                    <Input
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Confirmar Contraseña</Label>
                    <Input
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}
                  <Button type="submit" className="w-full">Crear Cuenta</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    
  )
}
