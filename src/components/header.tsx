import { Wind } from "lucide-react"

export default function DashboardHeader() {


  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wind className="h-10 w-10 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">AmbienTrack</h1>
        </div>


      </div>
    </header>
  )
}

