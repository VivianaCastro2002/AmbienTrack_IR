export interface ParametroIdeal {
    min: number
    max: number
    unidad: string
}

export interface Sala {
    id: string
    nombre: string
    parametros: Record<string, ParametroIdeal>
    thingsboard_device_id?: string
    thingsboard_access_token?: string
}

const STORAGE_KEY = "ambientrack_salas";

const defaultParametros = (): Record<string, ParametroIdeal> => {
    return {
        temperature: { min: 20, max: 24, unidad: "°C" },
        humidity: { min: 40, max: 60, unidad: "%" },
        lux: { min: 300, max: 500, unidad: "lux" },
        noise: { min: 0, max: 200, unidad: "pdm" },
        airQuality: { min: 0, max: 750, unidad: "AQI" }
    }
}

export const mockDb = {
    getSalas: (): Sala[] => {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    getSalaById: (id: string): Sala | undefined => {
        const salas = mockDb.getSalas();
        return salas.find((s) => s.id === id);
    },

    createSala: (sala: Omit<Sala, "id">): Sala => {
        const salas = mockDb.getSalas();
        const newSala = { ...sala, id: crypto.randomUUID() };
        salas.push(newSala);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(salas));
        return newSala;
    },

    updateSala: (id: string, updates: Partial<Sala>): Sala | undefined => {
        const salas = mockDb.getSalas();
        const index = salas.findIndex((s) => s.id === id);
        if (index === -1) return undefined;

        const updatedSala = { ...salas[index], ...updates };
        salas[index] = updatedSala;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(salas));
        return updatedSala;
    },

    deleteSala: (id: string): void => {
        const salas = mockDb.getSalas();
        const filteredSalas = salas.filter((s) => s.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSalas));
    },

    // Initialize with some dummy data if empty
    init: () => {
        if (typeof window === "undefined") return;
        if (!localStorage.getItem(STORAGE_KEY)) {
            const dummySalas: Sala[] = [
                {
                    id: "1",
                    nombre: "Sala de Reuniones",
                    parametros: defaultParametros(),
                    thingsboard_device_id: "mock-device-1",
                    thingsboard_access_token: "mock-token-1"
                },
                {
                    id: "2",
                    nombre: "Oficina Principal",
                    parametros: defaultParametros(),
                    thingsboard_device_id: "mock-device-2",
                    thingsboard_access_token: "mock-token-2"
                }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dummySalas));
        }
    }
};
