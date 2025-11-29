import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "./ui/button";
import { AlertTriangle, OctagonAlert, ChevronRight } from "lucide-react";

interface AlertasProps {
  variant?: "advertencia" | "destructiva";
  mensaje: string;
  onVerRecomendaciones?: () => void;
}

const estilos = {
  advertencia: {
    alert: "bg-yellow-50 border-yellow-200 text-yellow-500",
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Advertencia",
    button: "hover:bg-yellow-100 hover:text-yellow-600",
  },
  destructiva: {
    alert: "bg-red-50 border-red-200 text-red-500",
    icon: <OctagonAlert className="w-6 h-6" />,
    title: "Alerta",
    button: "hover:bg-red-100 hover:text-red-600",
  },
};

export default function Alertas({
  variant = "advertencia",
  mensaje,
  onVerRecomendaciones,
}: AlertasProps) {
  const estilo = estilos[variant];

  return (
    <Alert
      className={`flex mb-1 py-2 justify-between items-center ${estilo.alert}`}
      variant={variant === "destructiva" ? "destructive" : undefined}
    >
      <div className="flex items-center space-x-4">
        {estilo.icon}
        <div>
          <AlertTitle className="text-base">{estilo.title}</AlertTitle>
          <AlertDescription>{mensaje}</AlertDescription>
        </div>
      </div>
      <Button
        variant="outline"
        className={estilo.button}
        onClick={onVerRecomendaciones}
      >
        Ver Recomendaciones
        <ChevronRight />
      </Button>
    </Alert>
  );
}