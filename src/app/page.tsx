"use client"
import type React from "react"
import { Wind, BarChart3, Lightbulb, Building2, Shield } from "lucide-react"
import AuthForm from "@/components/authForm"

export default function AuthPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-16">
          <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-4">
              <Wind className="h-14 w-14 text-blue-600" />
              <h1 className="text-6xl font-bold text-gray-900">AmbienTrack</h1>
          </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Monitorea y optimiza tu ambiente de trabajo</h2>
            <p className="text-xl text-gray-600 mb-8">
              AmbienTrack te permite supervisar en tiempo real las condiciones ambientales de tus espacios, recibir
              recomendaciones personalizadas y gestionar múltiples salas para crear el ambiente perfecto.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Monitoreo en Tiempo Real</h3>
                  <p className="text-sm text-gray-600">Datos actualizados constantemente</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Recomendaciones</h3>
                  <p className="text-sm text-gray-600">Sugerencias personalizadas</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gestión de Salas</h3>
                  <p className="text-sm text-gray-600">Administra múltiples espacios</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Configuración Avanzada</h3>
                  <p className="text-sm text-gray-600">Parámetros personalizables</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
        <AuthForm/>
        </div>  
      </div>
    </div>
  )
}
