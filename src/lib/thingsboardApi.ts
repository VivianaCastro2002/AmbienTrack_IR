const TB_BASE_URL = process.env.NEXT_PUBLIC_TB_BASE_URL!;
const TB_USERNAME = process.env.NEXT_PUBLIC_TB_USERNAME!;
const TB_PASSWORD = process.env.NEXT_PUBLIC_TB_PASSWORD!;
const KEYS = "temperature,humidity,lux,noise,eCO2,TVOC";

export interface TelemetriaAmbiental {
  temperature: number;
  humidity: number;
  lux: number;
  noise: number;
  airQuality: number;
}

let authToken: string | null = null;
let refreshToken: string | null = null;
let tokenExpiraEn: number = 0; 


async function loginThingsBoard(): Promise<void> {
  const res = await fetch(`${TB_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      username: TB_USERNAME,
      password: TB_PASSWORD
    })
  });

  if (!res.ok) throw new Error("Login ThingsBoard fallido");

  const data = await res.json();
  authToken = data.token;
  refreshToken = data.refreshToken;
  tokenExpiraEn = Date.now() + 14 * 60 * 1000; 
}

async function refrescarToken(): Promise<void> {
  if (!refreshToken) return loginThingsBoard();

  const res = await fetch(`${TB_BASE_URL}/api/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": `Bearer ${authToken}`
    },
    body: JSON.stringify({
      refreshToken: refreshToken
    })
  });

  if (!res.ok) return loginThingsBoard();

  const data = await res.json();
  authToken = data.token;
  refreshToken = data.refreshToken;
  tokenExpiraEn = Date.now() + 14 * 60 * 1000;
}


async function asegurarTokenValido(): Promise<void> {
  if (!authToken || Date.now() > tokenExpiraEn) {
    if (refreshToken) {
      await refrescarToken();
    } else {
      await loginThingsBoard();
    }
  }
}

export async function obtenerUltimosValores(deviceId: string): Promise<TelemetriaAmbiental> {
  await asegurarTokenValido();

  const res = await fetch(`${TB_BASE_URL}/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=${KEYS}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": `Bearer ${authToken}`
    }
  });

  if (!res.ok) throw new Error("Error al obtener datos de ThingsBoard");

  const data = await res.json();

  const eco2 = parseFloat(data.eCO2?.[0]?.value ?? "0");
  const tvoc = parseFloat(data.TVOC?.[0]?.value ?? "0");
  const airQuality = (eco2 + tvoc) / 2;

  return {
    temperature: parseFloat(data.temperature?.[0]?.value ?? "0"),
    humidity: parseFloat(data.humidity?.[0]?.value ?? "0"),
    lux: parseFloat(data.lux?.[0]?.value ?? "0"),
    noise: parseFloat(data.noise?.[0]?.value ?? "0"),
    airQuality
  };
}
