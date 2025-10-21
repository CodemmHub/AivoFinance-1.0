import { AppData } from '../types';

export const APP_DATA_FILE_NAME = 'aivofinance_data.json';

// --- MOCK in-memory storage ---
// This simulates Google's appDataFolder by storing one file's content.
let mockFileStorage: { [id: string]: string } = {}; // { fileId: fileContent (JSON string) }
let mockFileId: string | null = null;

const SIMULATED_LATENCY = 500; // ms

// Helper to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


// --- Core API Functions (Mocked) ---

/**
 * Finds the application's data file in the mock storage.
 * @returns The file ID if found, otherwise null.
 */
export const findFile = async (): Promise<string | null> => {
    await delay(SIMULATED_LATENCY);
    console.log("MOCK_DRIVE: finding file...", { mockFileId });
    return mockFileId;
};

/**
 * Creates the initial data file in the mock storage.
 * @param content The initial AppData object to store.
 * @returns The ID of the newly created file.
 */
export const createFile = async (content: AppData): Promise<string> => {
    await delay(SIMULATED_LATENCY);
    if (mockFileId) {
        console.warn("MOCK_DRIVE: createFile called but file already exists.");
        throw new Error("File already exists");
    }
    const newFileId = `mock_file_id_${Date.now()}`;
    mockFileStorage[newFileId] = JSON.stringify(content, null, 2);
    mockFileId = newFileId;
    console.log("MOCK_DRIVE: created file", { newFileId });
    return newFileId;
};

/**
 * Reads the content of the data file from mock storage.
 * @param fileId The ID of the file to read.
 * @returns The parsed AppData object.
 */
export const readFile = async (fileId: string): Promise<AppData> => {
    await delay(SIMULATED_LATENCY);
    if (!mockFileStorage[fileId]) {
        throw new Error("File not found");
    }
    console.log("MOCK_DRIVE: reading file", { fileId });
    return JSON.parse(mockFileStorage[fileId]);
};

/**
 * Updates the content of the data file in mock storage.
 * @param fileId The ID of the file to update.
 * @param content The new AppData object to save.
 */
export const updateFile = async (fileId: string, content: AppData): Promise<void> => {
    await delay(SIMULATED_LATENCY / 2); // Make saving faster
    if (!mockFileStorage[fileId]) {
        throw new Error("File not found");
    }
    mockFileStorage[fileId] = JSON.stringify(content, null, 2);
    console.log("MOCK_DRIVE: updated file", { fileId });
};


/**
 * Creates a copy of a file in mock storage.
 * @param fileId The ID of the file to copy.
 * @param newName The name for the copied file (not used in this simplified mock).
 */
export const copyFile = async (fileId: string, newName: string): Promise<void> => {
     await delay(SIMULATED_LATENCY);
     if (!mockFileStorage[fileId]) {
        throw new Error("File to copy not found");
    }
    const newId = `mock_backup_id_${Date.now()}`;
    mockFileStorage[newId] = mockFileStorage[fileId]; // Just copy content to a new ID
    console.log(`MOCK_DRIVE: Copied file ${fileId} to ${newId} (as ${newName})`);
};