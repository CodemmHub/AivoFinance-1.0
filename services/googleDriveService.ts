import { getAccessToken } from './googleAuthService';
import { AppData } from '../types';

const APP_DATA_FILE_NAME = 'fintrack_data.json';
const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';

// --- Helper Functions ---
const getAuthHeaders = (): Headers => {
    const accessToken = getAccessToken();
    if (!accessToken) {
        throw new Error('User not authenticated');
    }
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);
    headers.append('Content-Type', 'application/json');
    return headers;
};

// --- Core API Functions ---

/**
 * Finds the application's data file in the user's AppData folder.
 * @returns The file ID if found, otherwise null.
 */
const findFile = async (): Promise<string | null> => {
    const headers = getAuthHeaders();
    headers.delete('Content-Type'); // Not needed for this GET request

    const queryParams = new URLSearchParams({
        spaces: 'appDataFolder',
        fields: 'files(id, name)',
        q: `name='${APP_DATA_FILE_NAME}'`,
    });

    try {
        const response = await fetch(`${DRIVE_API_URL}?${queryParams}`, { headers });
        if (!response.ok) {
            throw new Error(`Google Drive API error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.files.length > 0 ? data.files[0].id : null;
    } catch (error) {
        console.error("Error finding file in Google Drive:", error);
        throw error;
    }
};

/**
 * Creates the initial data file in the user's AppData folder.
 * @param content The initial AppData object to store.
 * @returns The ID of the newly created file.
 */
const createFile = async (content: AppData): Promise<string> => {
    const accessToken = getAccessToken();
    if (!accessToken) throw new Error('Not authenticated');

    const metadata = {
        name: APP_DATA_FILE_NAME,
        parents: ['appDataFolder'],
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }));

    const response = await fetch(`${DRIVE_UPLOAD_URL}?uploadType=multipart`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Google Drive API error during file creation: ${response.statusText}`);
    }

    const data = await response.json();
    return data.id;
};

/**
 * Reads the content of the data file from Google Drive.
 * @param fileId The ID of the file to read.
 * @returns The parsed AppData object.
 */
const readFile = async (fileId: string): Promise<AppData> => {
    const headers = getAuthHeaders();
    headers.delete('Content-Type');

    const response = await fetch(`${DRIVE_API_URL}/${fileId}?alt=media`, { headers });
     if (!response.ok) {
        throw new Error(`Google Drive API error reading file: ${response.statusText}`);
    }
    return response.json();
};

/**
 * Updates the content of the data file in Google Drive.
 * @param fileId The ID of the file to update.
 * @param content The new AppData object to save.
 */
const updateFile = async (fileId: string, content: AppData): Promise<void> => {
    const headers = getAuthHeaders();
    
    await fetch(`${DRIVE_UPLOAD_URL}/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(content, null, 2),
    });
};


// --- Public Service Interface ---

let fileIdCache: string | null = null;

export const getAppData = async (initialData: AppData): Promise<AppData> => {
    try {
        const fileId = await findFile();
        if (fileId) {
            fileIdCache = fileId;
            console.log("Found existing data file in Google Drive.");
            return await readFile(fileId);
        } else {
            console.log("No data file found. Creating a new one with sample data.");
            fileIdCache = await createFile(initialData);
            return initialData;
        }
    } catch (error) {
        console.error("Failed to get app data from Google Drive. Using initial data as fallback.", error);
        return initialData;
    }
};

export const saveAppData = async (data: AppData): Promise<void> => {
    if (!fileIdCache) {
        // This case should ideally not happen if getAppData is always called first.
        const fileId = await findFile();
        if (fileId) {
            fileIdCache = fileId;
        } else {
            console.error("Cannot save data: file ID not found.");
            throw new Error("File not initialized in Google Drive.");
        }
    }
    
    try {
        await updateFile(fileIdCache, data);
        console.log("App data successfully saved to Google Drive.");
    } catch (error) {
        console.error("Failed to save app data to Google Drive:", error);
    }
};
