import { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface TarjetaEstadoProps {
  title: string
  icon: ReactNode
  valor: number | string
  estado: string
}

  function colorEstado(estado: string): string {
  switch (estado.toLowerCase()) {
    case "normal":
    case "estable":
      return "bg-green-200 text-green-800"
    case "alto": 
    case "bajo":
    case "alta": 
    case "baja":
      return "bg-yellow-200 text-yellow-800"
    case "muy bajo":
    case "muy alto":
    case "muy baja":
    case "muy alta":
      return "bg-red-200 text-red-800"
    default:
      return "bg-gray-200"
  }
}

export default function TarjetaEstado({title, icon, valor, estado }: TarjetaEstadoProps){
    return(
        <Card className="p-5 gap-2">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">{title}</span>
                <div className="text-gray-400">{icon}</div>
            </div>
            <div className="">
                <div className="text-2xl font-bold text-gray-900 mb-2">{valor}</div>    
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorEstado(estado)}`}>{estado}</span>
            </div>
        </Card>
    )
}
