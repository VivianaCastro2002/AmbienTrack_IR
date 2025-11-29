"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import GridTarjetas from "@/components/gridTarjetas"
import { obtenerUltimosValores, TelemetriaAmbiental } from "@/lib/thingsboardApi"
import GraficoGeneral from "@/components/graficoGeneral"
import { Parametro, DatoAmbiental, calcularCondicionGeneral, evaluarParametro } from "@/utils/parametros"
import Alertas from "@/components/alertas"
import { estilosPorParametro } from "@/utils/estilosGraficos"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Recomendaciones from "@/components/recomendaciones";
import { recomendacionesPorParametro } from "@/utils/recomendacionesData";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb"


const PARAMETROS: { key: Exclude<Parametro, "all">; label: string }[] = [
  { key: "temperature", label: "Temperatura" },
  { key: "humidity", label: "Humedad" },
  { key: "lux", label: "Iluminación" },
  { key: "noise", label: "Ruido" },
  { key: "airQuality", label: "Calidad de aire" },
];

export default function Dashboard() {
    const searchParams = useSearchParams()
    const salaId = searchParams.get("sala")
    const [valores, setValores] = useState<TelemetriaAmbiental | null>(null)
    const [loading, setLoading] = useState(true)
    const [historial, setHistorial] = useState<Record<Parametro, DatoAmbiental[]>>({
    temperature: [],
    humidity: [],
    lux: [],
    noise: [],
    airQuality: [],
    all: [],
    });
    const [rangosIdeales, setRangosIdeales] = useState<Record<Parametro, { min: number; max: number }>>()
    const [tab, setTab] = useState("general");
    const [nombreSala, setNombreSala] = useState<string>("");

  useEffect(() => {
    let intervalo: NodeJS.Timeout
    let deviceId: string | null = null

    const obtenerYActualizarDatos = async () => {
      if (!deviceId) return
      try {
        const datos = await obtenerUltimosValores(deviceId)
        setValores(datos)
        
    const timestamp = new Date().toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    setHistorial((prev) => {
      const nuevoHistorial = { ...prev };

      (Object.keys(datos) as Parametro[]).forEach((param) => {
        if (param !== "all") {
          nuevoHistorial[param] = [
            ...prev[param],
            { hora: timestamp, valor: datos[param] }
          ].slice(-12);
        }
      });

        if (rangosIdeales) {
        const datosSinAll = Object.fromEntries(
        Object.entries(datos).filter(([key]) => key !== "all")
        ) as Record<Parametro, number>;
        const promedioCondicion = calcularCondicionGeneral(datosSinAll, rangosIdeales);
        nuevoHistorial["all"] = [
            ...prev["all"],
            { hora: timestamp, valor: promedioCondicion }
        ].slice(-12);
        }
        console.log("Historial actualizado:", nuevoHistorial["all"]);
      return nuevoHistorial;
    });


      } catch (err) {
        console.error("Error al obtener datos de ThingsBoard:", err)
      } finally {
        setLoading(false)
      }
    }

    const iniciarActualizacion = async () => {
    if (!salaId) return;

    const { data, error } = await supabase
        .from("sala")
        .select(`thingsboard_device_id,parametro_sala (tipo, valor_min, valor_max), nombre`)
        .eq("id", salaId)
        .single();

    if (error || !data?.thingsboard_device_id) {
        console.error("Error al obtener el deviceId:", error);
        setLoading(false);
        return;
    }

    setNombreSala(data.nombre || "");

    const nuevosRangos: Record<Parametro, { min: number; max: number }> = {
        temperature: { min: 0, max: 0 },
        humidity: { min: 0, max: 0 },
        lux: { min: 0, max: 0 },
        noise: { min: 0, max: 0 },
        airQuality: { min: 0, max: 0 },
        all: { min: 0, max: 0 },
    };

    if (data.parametro_sala) {
        for (const p of data.parametro_sala) {
        const tipo = p.tipo as Parametro;
        if (nuevosRangos[tipo]) {
            nuevosRangos[tipo] = {
            min: p.valor_min,
            max: p.valor_max,
            };
        }
        }
    }

    deviceId = data.thingsboard_device_id;
    setRangosIdeales(nuevosRangos);

    
    await obtenerYActualizarDatos();

    intervalo = setInterval(obtenerYActualizarDatos, 3000);
    };


    iniciarActualizacion()

    return () => {
      if (intervalo) clearInterval(intervalo)
    }
  }, [salaId])

  useEffect(() => {
    if (!valores || !rangosIdeales) return;

    const timestamp = new Date().toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const datosSinAll = Object.fromEntries(
      Object.entries(valores).filter(([key]) => key !== "all")
    ) as Record<Parametro, number>;

    const promedioCondicion = calcularCondicionGeneral(datosSinAll, rangosIdeales);

    setHistorial((prev): Record<Parametro, DatoAmbiental[]> => ({
      ...prev,
      all: [...prev.all, promedioCondicion].slice(-12),
    }));
  }, [valores, rangosIdeales]);


  function getAlerta(param: { key: Exclude<Parametro, "all">; label: string }) {
    if (!valores || !rangosIdeales) return null;
    const valor = valores[param.key];
    const { min: idealMin, max: idealMax } = rangosIdeales[param.key];
    const ticks = estilosPorParametro[param.key].ticks;
    const minGrafico = Math.min(...ticks);
    const maxGrafico = Math.max(...ticks);
    const estado = evaluarParametro(valor, idealMin, idealMax, minGrafico, maxGrafico);
    const estadoLower = estado.toLowerCase();
    let variant: "advertencia" | "destructiva" = "advertencia";
    if (estadoLower.includes("muy")) variant = "destructiva";
    return {
      mensaje: `${param.label} ${estadoLower}`,
      variant,
      mostrar: estadoLower !== "normal",
    };
  }

  const mensajesAlerta = valores && rangosIdeales
    ? PARAMETROS.map(getAlerta)
        .filter((alerta) => alerta && alerta.mostrar)
        .sort((a, b) => (a && b && a.variant === "destructiva" ? -1 : 1))
    : [];


  function getRecomendacion(param: { key: Exclude<Parametro, "all">; label: string }) {
    if (!valores || !rangosIdeales) return null;
    const valor = valores[param.key];
    const { min: idealMin, max: idealMax } = rangosIdeales[param.key];
    const ticks = estilosPorParametro[param.key].ticks;
    const minGrafico = Math.min(...ticks);
    const maxGrafico = Math.max(...ticks);
    const estado = evaluarParametro(valor, idealMin, idealMax, minGrafico, maxGrafico).toLowerCase();
    const acciones = recomendacionesPorParametro[param.key]?.[estado];
    if (acciones && acciones.length > 0) {
      return {
        titulo: `${param.label} ${estado}`,
        acciones,
        critica: estado.includes("muy"),
      };
    }
    return null;
  }

  const recomendaciones = valores && rangosIdeales
    ? (PARAMETROS.map(getRecomendacion).filter(Boolean) as { titulo: string; acciones: string[]; critica: boolean }[])
    : [];

  return (
    <main className="items-center min-h-full sm:px-6 sm:py-3">
      <div className="px-6">
        <Breadcrumb className="py-2">
          <BreadcrumbList>
            <BreadcrumbItem >
              <BreadcrumbLink href="/ambientrack/gestion-salas">Gestión Salas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{nombreSala || "Sala"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full px-6">
            <TabsTrigger value="general">Vista General</TabsTrigger>
            <TabsTrigger value="recomendaciones">Recomendaciones</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            {loading && <p>Cargando datos...</p>}
            {!loading && valores && rangosIdeales && (
              <GridTarjetas valores={valores} rangosIdeales={rangosIdeales} />
            )}
            {!loading && valores && rangosIdeales && (
              <GraficoGeneral
                valores={valores}
                historial={historial}
                setHistorial={setHistorial}
              />
            )}
            {mensajesAlerta.map((alerta, idx) => (
              alerta && (
                <Alertas
                  key={idx}
                  mensaje={alerta.mensaje}
                  variant={alerta.variant}
                  onVerRecomendaciones={() => setTab("recomendaciones")}
                />
              )
            ))}
          </TabsContent>
          <TabsContent value="recomendaciones">
            <Recomendaciones recomendaciones={recomendaciones} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}