export const recomendacionesPorParametro: Record<string, Record<string, string[]>> = {
  temperature: {
    "muy baja": [
      "Cerrar ventanas y puertas para conservar el calor",
      "Usar calefacción o dispositivos térmicos",
      "Aislar zonas con materiales térmicos"
    ],
    "baja": [
      "Aumentar gradualmente la temperatura con calefacción",
      "Reducir ventilación hasta estabilizar la temperatura"
    ],
    "alta": [
      "Ventilar el ambiente naturalmente o con extractores",
      "Evitar uso de equipos que generen calor"
    ],
    "muy alta": [
      "Usar aire acondicionado o ventilación forzada",
      "Reducir la carga térmica del ambiente",
      "Refrescar con humidificadores fríos o cortinas térmicas"
    ]
  },

  humidity: {
    "muy baja": [
      "Usar humidificadores o recipientes con agua abierta",
      "Evitar calefacción excesiva",
      "Colocar plantas que liberen humedad"
    ],
    "baja": [
      "Aumentar la humedad con difusores o ventilación húmeda",
      "Cerrar puertas para conservar humedad"
    ],
    "alta": [
      "Ventilar el espacio",
      "Reducir fuentes de vapor como cocinas o baños sin extractor"
    ],
    "muy alta": [
      "Usar deshumidificadores o aire acondicionado",
      "Revisar filtraciones o condensaciones",
      "Mejorar la ventilación cruzada"
    ]
  },

  lux: {
    "muy baja": [
      "Encender luces adicionales",
      "Abrir cortinas o persianas",
      "Reubicar actividades a zonas más iluminadas"
    ],
    "baja": [
      "Ajustar la iluminación artificial",
      "Revisar obstrucciones físicas",
      "Aprovechar luz natural"
    ],
    "alta": [
      "Reducir intensidad lumínica",
      "Usar cortinas translúcidas o filtros"
    ],
    "muy alta": [
      "Apagar luces innecesarias",
      "Instalar filtros solares o películas polarizadas",
      "Cambiar la fuente de luz por una de menor intensidad"
    ]
  },

  noise: {
    "alto": [
      "Identificar y aislar la fuente de ruido",
      "Usar paneles acústicos o materiales absorbentes",
      "Cambiar el horario de operación de fuentes ruidosas"
    ],
    "muy alto": [
      "Suspender actividades ruidosas si es posible",
      "Implementar aislamiento acústico o barreras",
      "Usar protección auditiva para personas expuestas"
    ]
  },

  airQuality: {
    "baja": [
      "Ventilar el ambiente si el aire exterior es mejor",
      "Reducir fuentes de polvo, humo o gases",
      "Monitorear fuentes contaminantes"
    ],
    "muy baja": [
      "Activar ventilación con filtros o extractores",
      "Suspender uso de químicos o materiales contaminantes",
      "Usar purificadores de aire"
    ]
  },
};