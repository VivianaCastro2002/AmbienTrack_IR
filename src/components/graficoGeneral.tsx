'use client'
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { TrendingUp } from "lucide-react";
import { estilosPorParametro } from "@/utils/estilosGraficos";
import { DatoAmbiental, Parametro } from "@/utils/parametros";
import { TelemetriaAmbiental } from "@/lib/thingsboardApi";

interface Props {
  valores: TelemetriaAmbiental;
  historial: Record<Parametro, DatoAmbiental[]>;
  setHistorial: React.Dispatch<React.SetStateAction<Record<Parametro, DatoAmbiental[]>>>;
}

export default function GraficoGeneral({ valores, historial }: Props) {
  const parametrosDisponibles: Parametro[] = [
    "all",
    "temperature",
    "humidity",
    "lux",
    "noise",
    "airQuality",
  ];

  const nombresParametros: Record<Parametro, string> = {
    temperature: "Temperatura",
    humidity: "Humedad",
    lux: "Iluminación",
    noise: "Ruido",
    airQuality: "Calidad del Aire",
    all: "Ambiente General",
  };

  const [selectedParameter, setSelectedParameter] = useState<Parametro>("all");

  const config = estilosPorParametro[selectedParameter] ?? estilosPorParametro["temperature"];
  const datos = historial[selectedParameter] ?? [];

  const chartConfig = {
    valor: {
      label: "Valor",
    },
  } satisfies ChartConfig;

  return (
    <Card className="mb-2 py-4 gap-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center ">
              <TrendingUp className="h-5 w-5 mr-2" />
              {`Nivel de ${nombresParametros[selectedParameter]}`}
            </CardTitle>
            <CardDescription>
              {`Estado actual de ${nombresParametros[selectedParameter]}`}
            </CardDescription>
          </div>
          <Select value={selectedParameter} onValueChange={(value) => setSelectedParameter(value as Parametro)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar parámetro" />
            </SelectTrigger>
            <SelectContent>
              {parametrosDisponibles.map((param) => (
                <SelectItem key={param} value={param}>
                  {nombresParametros[param]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {datos.length === 0 ? (
          <p className="text-muted-foreground">Cargando datos...</p>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[200px] max-h-72 w-full">
            <LineChart
              accessibilityLayer
              data={datos}
              margin={{ left: 0, right: 22 }}
            >
              <CartesianGrid vertical horizontal strokeDasharray="3 3" />
              <XAxis
                dataKey="hora"
                tickLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                tickMargin={8}
                ticks={config.ticks}
                tickFormatter={(value) => config.formato?.(value) ?? value}
              />
              <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => config.formato ? config.formato(Number(value)) : value} />
              <Line
                dataKey="valor"
                stroke={config.color}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
