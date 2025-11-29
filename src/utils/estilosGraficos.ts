import type { Parametro } from "@/utils/parametros";

const estilosPorParametro: Record<
  Parametro,
  {
    color: string
    ticks: number[]
    formato?: (value: number) => string
  }
> = {
all: {
  color: "#5E60CE",
  ticks: [1, 1.5, 2, 2.5, 3],
  formato: (valor: number) => {
    if (valor >= 2.95) return "Excelente";
    if (valor >= 2.5) return "Aceptable";
    if (valor >= 2) return "Regular";
    if (valor >= 1.5) return "Poco Tol.";
    if (valor >= 1) return "Mala";
    return "Indef.";
  }
},

  temperature: {
    color: "var(--chart-1)",
    ticks: [0, 10, 20, 30, 40, 50],
    formato: (value) => `${value}°C`
  },
  humidity: {
    color: "var(--chart-6)",
    ticks: [0, 20, 40, 60, 80, 100],
    formato: (value) => `${value}%`
  },
  lux: {
    color: "var(--chart-5)",
    ticks: [0, 200, 400, 600, 800],
    formato: (value) => `${value} lx`
  },
  noise: {
    color: "var(--chart-2)",
    ticks: [0, 100, 200, 300, 400, 500],
    formato: (value) => `${value} pdm`
  },
  airQuality: {
    color: "var(--chart-7)",
    ticks: [200, 600, 1000, 1400],
    formato: (value) => `${value} AQI`
  }
}
export { estilosPorParametro}
