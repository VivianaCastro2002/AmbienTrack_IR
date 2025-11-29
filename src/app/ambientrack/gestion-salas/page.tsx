"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Edit, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ParametroIdeal {
  min: number
  max: number
  unidad: string
}

interface Sala {
  id: string
  nombre: string
  parametros: Record<string, ParametroIdeal>
  thingsboard_device_id?: string
  thingsboard_access_token?: string
}

const UNIDADES: Record<string, string> = {
  temperature: "°C",
  humidity: "%",
  lux: "lux",
  noise: "pdm",
  airQuality: "AQI"
}
const NOMBRES_PARAMETROS: Record<string, string> = {
  temperature: "Temperatura",
  humidity: "Humedad",
  lux: "Luminosidad",
  noise: "Ruido",
  airQuality: "Calidad del Aire"
}


const keysParametros = Object.keys(UNIDADES)

export default function GestionSalas() {
  const [salas, setSalas] = useState<Sala[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [salaEditando, setSalaEditando] = useState<Sala | null>(null)
  const [formulario, setFormulario] = useState({ nombre: "", parametros: {} as Record<string, ParametroIdeal>, deviceId: "", accessToken: "" })
  const router = useRouter()

  useEffect(() => {
    cargarSalas()
  }, [])

  const cargarSalas = async () => {
    const { data: salasRaw } = await supabase.from("sala").select("id, nombre, thingsboard_device_id, thingsboard_access_token")
    if (!salasRaw) return

    const salasConParametros: Sala[] = []
    for (const sala of salasRaw) {
      const { data: parametros } = await supabase
        .from("parametro_sala")
        .select("tipo, valor_min, valor_max")
        .eq("sala_id", sala.id)

      const paramObj: Record<string, ParametroIdeal> = {}
      parametros?.forEach((p) => {
        paramObj[p.tipo] = {
          min: p.valor_min,
          max: p.valor_max,
          unidad: UNIDADES[p.tipo]
        }
      })

      salasConParametros.push({ id: sala.id, nombre: sala.nombre, parametros: paramObj, thingsboard_device_id: sala.thingsboard_device_id, thingsboard_access_token: sala.thingsboard_access_token })
    }
    setSalas(salasConParametros)
  }

  const abrirModalCrear = () => {
    setSalaEditando(null)
    setFormulario({ nombre: "", parametros: defaultParametros() })
    setModalAbierto(true)
  }

  const abrirModalEditar = (sala: Sala) => {
    const parametrosCompletos: Record<string, ParametroIdeal> = {
      ...defaultParametros(),
      ...sala.parametros
    }
    setSalaEditando(sala)
    setFormulario({ nombre: sala.nombre, parametros: parametrosCompletos, deviceId: sala.thingsboard_device_id ?? "", accessToken: sala.thingsboard_access_token ?? "" })
    setModalAbierto(true)
  }

  const defaultParametros = (): Record<string, ParametroIdeal> => {
    return {
      temperature: { min: 20, max: 24, unidad: "°C" },
      humidity: { min: 40, max: 60, unidad: "%" },
      lux: { min: 300, max: 500, unidad: "lux" },
      noise: { min: 0, max: 200, unidad: "pdm" },
      airQuality: { min: 0, max: 750, unidad: "AQI" }
    }
  }

  const guardarSala = async () => {
    if (!formulario.nombre) return

    if (salaEditando) {
      await supabase.from("sala").update({ nombre: formulario.nombre, thingsboard_device_id:formulario.deviceId, thingsboard_access_token:formulario.accessToken }).eq("id", salaEditando.id)
      for (const tipo of keysParametros) {
        const p = formulario.parametros[tipo]
        await supabase.from("parametro_sala").upsert({
          sala_id: salaEditando.id,
          tipo,
          valor_min: p.min,
          valor_max: p.max
        })
      }
    } else {
      const { data: nuevaSala } = await supabase.from("sala").insert({ nombre: formulario.nombre, thingsboard_device_id:formulario.deviceId, thingsboard_access_token:formulario.accessToken }).select().single()
      if (nuevaSala) {
        for (const tipo of keysParametros) {
          const p = formulario.parametros[tipo]
          await supabase.from("parametro_sala").insert({
            sala_id: nuevaSala.id,
            tipo,
            valor_min: p.min,
            valor_max: p.max
          })
        }
      }
    }
    setModalAbierto(false)
    cargarSalas()
  }

  const eliminarSala = async (id: string) => {
    await supabase.from("parametro_sala").delete().eq("sala_id", id)
    await supabase.from("sala").delete().eq("id", id)
    cargarSalas()
  }

  const handleParametroChange = (tipo: string, campo: "min" | "max", valor: string) => {
    setFormulario((prev) => ({
      ...prev,
      parametros: {
        ...prev.parametros,
        [tipo]: {
          ...prev.parametros[tipo],
          [campo]: Number.parseFloat(valor) || 0,
        },
      },
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Salas</h1>
          <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
            <DialogTrigger asChild>
              <Button onClick={abrirModalCrear} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Nueva Sala
              </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-8xl min-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{salaEditando ? "Editar Sala" : "Crear Nueva Sala"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Sala</Label>
                  <Input id="nombre" value={formulario.nombre} onChange={(e) => setFormulario((f) => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div className="space-y-2">

                <Label htmlFor="device_id">ID del Dispositivo (ThingsBoard)</Label>
                <Input
                  id="device_id"
                  value={formulario.deviceId ?? ""}
                  onChange={(e) =>
                    setFormulario((f) => ({ ...f, deviceId: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="access_token">Access Token del Dispositivo</Label>
                <Input
                  id="access_token"
                  value={formulario.accessToken ?? ""}
                  onChange={(e) =>
                    setFormulario((f) => ({ ...f, accessToken: e.target.value }))
                  }
                />
              </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Parámetros Ideales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {keysParametros.map((tipo) => (
                      <Card key={tipo}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm capitalize">
                            {NOMBRES_PARAMETROS[tipo]}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Label className="text-xs">Mínimo</Label>
                              <Input type="number" value={formulario.parametros[tipo]?.min ?? 0} onChange={(e) => handleParametroChange(tipo, "min", e.target.value)} className="h-8" />
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs">Máximo</Label>
                              <Input type="number" value={formulario.parametros[tipo]?.max ?? 0} onChange={(e) => handleParametroChange(tipo, "max", e.target.value)} className="h-8" />
                            </div>
                            <div className="w-16">
                              <Label className="text-xs">Unidad</Label>
                              <div className="h-8 flex items-center text-sm text-gray-600">
                                {UNIDADES[tipo]}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setModalAbierto(false)}>Cancelar</Button>
                  <Button onClick={guardarSala}>{salaEditando ? "Actualizar" : "Crear"} Sala</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {salas.map((sala) => (
            <Card key={sala.id} className="cursor-pointer hover:shadow-lg" onClick={() => router.push(`/ambientrack/dashboard?sala=${sala.id}`)}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{sala.nombre}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); abrirModalEditar(sala); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); eliminarSala(sala.id); }} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {salas.length === 0 && (
          <Alert>
            <AlertDescription>No hay salas configuradas.</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
