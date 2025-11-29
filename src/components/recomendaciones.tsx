import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Recomendacion {
  titulo: string;
  acciones: string[];
  critica: boolean;
}

export default function Recomendaciones({ recomendaciones }: { recomendaciones: Recomendacion[] }) {
  const criticas = recomendaciones.filter(r => r.critica);
  const advertencias = recomendaciones.filter(r => !r.critica);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Acciones Críticas</CardTitle>
            <CardDescription>Requieren atención inmediata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticas.length === 0 && (
              <div className="text-muted-foreground">No hay acciones críticas.</div>
            )}
            {criticas.map((rec, idx) => (
              <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="font-medium text-red-800">{rec.titulo}</div>
                <ul className="text-sm text-red-600 mt-1 list-disc list-inside">
                  {rec.acciones.map((accion, i) => (
                    <li key={i}>{accion}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600">Recomendaciones</CardTitle>
            <CardDescription>Mejoras sugeridas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {advertencias.length === 0 && (
              <div className="text-muted-foreground">No hay recomendaciones activas.</div>
            )}
            {advertencias.map((rec, idx) => (
              <div key={idx} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="font-medium text-yellow-800">{rec.titulo}</div>
                <ul className="text-sm text-yellow-600 mt-1 list-disc list-inside">
                  {rec.acciones.map((accion, i) => (
                    <li key={i}>{accion}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}