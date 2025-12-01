const KEYS = "temperature,humidity,lux,noise,eCO2,TVOC";

export interface TelemetriaAmbiental {
  temperature: number;
  humidity: number;
  lux: number;
  noise: number;
  airQuality: number;
}

// Helper to generate random number between min and max
function getRandomValue(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(1));
}

export async function obtenerUltimosValores(deviceId: string): Promise<TelemetriaAmbiental> {
  // Simulate network delay
  // await new Promise(resolve => setTimeout(resolve, 500));

  // Return random mock data regardless of deviceId
  return {
    temperature: getRandomValue(18, 28), // 18°C - 28°C
    humidity: getRandomValue(30, 70),    // 30% - 70%
    lux: getRandomValue(200, 800),       // 200 - 800 lux
    noise: getRandomValue(30, 80),       // 30 - 80 dB
    airQuality: getRandomValue(0, 150)   // 0 - 150 AQI
  };
}
