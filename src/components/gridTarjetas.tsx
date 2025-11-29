import TarjetaEstado from "@/components/tarjetaEstado";
import { Thermometer, Droplets, Lightbulb, Volume2, Wind } from "lucide-react";
import { TelemetriaAmbiental } from "@/lib/thingsboardApi"
import { evaluarParametro, Parametro } from "@/utils/parametros";
import { estilosPorParametro } from "@/utils/estilosGraficos";


interface Props {
  valores: TelemetriaAmbiental;
  rangosIdeales: Record<Parametro, { min: number, max: number }>;
}


export default function GridTarjetas({ valores, rangosIdeales }: Props){
  if (!valores) return <p>No hay datos disponibles</p>;
  const parametros = [
    { key: "temperature",  title: "Temperatura", icon:<Thermometer className="w-5 h-5"/>, unidad: "°" },
    { key: "humidity", title: "Humedad", icon:<Droplets className="w-5 h-5"/>, unidad: "%" },
    { key: "lux", title: "Iluminación", icon:<Lightbulb className="w-5 h-5"/>, unidad: "lux" },
    { key: "noise", title: "Ruido", icon:<Volume2 className="w-5 h-5"/>, unidad: "pdm" },
    { key: "airQuality", title: "Calidad de Aire", icon:<Wind className="w-5 h-5"/>, unidad: "AQ" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pb-2">
      {parametros.map((param) => {
        const valorActual = valores[param.key as keyof TelemetriaAmbiental] ?? 0;
        const { min, max } = rangosIdeales[param.key as Parametro] || { min: 0, max: 0 };
        const config = estilosPorParametro[param.key as Parametro];
        const estadoActual = evaluarParametro(
          valorActual,
          min,
          max,
          Math.min(...config.ticks),
          Math.max(...config.ticks)
        );

        return (
          <TarjetaEstado
            key={param.key}
            title={param.title}
            icon={param.icon}
            valor={`${valorActual}${param.unidad}`}
            estado={estadoActual}
          />
        );
      })}
    </div>
  );
}
