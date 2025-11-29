import { estilosPorParametro } from "./estilosGraficos";

export interface DatoAmbiental {
  hora: string;
  valor: number;
}

export type Parametro =
  | "temperature"
  | "humidity"
  | "lux"
  | "noise"
  | "airQuality"
  | "all";

export const NOMBRES_PARAMETROS: Record<Parametro, string> = {
  temperature: "Temperatura",
  humidity: "Humedad",
  lux: "Iluminación",
  noise: "Ruido",
  airQuality: "Calidad de aire",
  all: "Ambiente General",
};

export function evaluarParametro(
  valor: number,
  idealMin: number,
  idealMax: number,
  minGrafico: number,
  maxGrafico: number
): string {
  const limiteInferior = (idealMin + minGrafico) / 2
  const limiteSuperior = (idealMax + maxGrafico) / 2

  if (valor < limiteInferior) return "Muy Baja"
  if (valor < idealMin) return "Baja"
  if (valor <= idealMax) return "Normal"
  if (valor <= limiteSuperior) return "Alta"
  return "Muy Alta"
}

export function obtenerEstrato(estado: string): 3 | 2 | 1 {
  const e = estado.trim().toLowerCase();
  if (e === "normal") return 3;
  if (e === "alto" || e === "bajo") return 2;
  if (e.startsWith("muy")) return 1;
  return 3;
}

interface RangoIdeal {
  min: number
  max: number
}

interface RangoGrafico {
  min: number
  max: number
}

export function calcularCondicionGeneral(
  valores: Record<Parametro, number>,
  rangosIdeales: Record<Parametro, RangoIdeal>
): DatoAmbiental {
  const estratos = Object.entries(valores)
    .filter(([param]) => param !== "all")
    .map(([param, valor]) => {
      const p = param as Parametro;
      const { min: idealMin, max: idealMax } = rangosIdeales[p];
      const ticks = estilosPorParametro[p].ticks;
      const minGrafico = Math.min(...ticks);
      const maxGrafico = Math.max(...ticks);

      const estado = evaluarParametro(valor, idealMin, idealMax, minGrafico, maxGrafico);
      return obtenerEstrato(estado);
    });
  const suma = estratos.reduce((acc, e) => acc + e, 0);
  const promedio = estratos.length > 0 ? suma / estratos.length : 3;

  return {
    hora: new Date().toISOString().slice(11, 16),
    valor: Number(promedio.toFixed(2)),
  };
}