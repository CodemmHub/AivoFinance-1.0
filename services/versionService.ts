import { AppData } from '../types';
import { copyFile } from './googleDriveService';

export const APP_VERSION = '0.1';

/**
 * Checks the loaded data's version against the current app version.
 * If a mismatch is found, it backs up the old data file and migrates the data object to the new version.
 * @param fileId The Google Drive ID of the data file.
 * @param data The loaded AppData object.
 * @returns The potentially migrated AppData object.
 */
export const handleDataMigration = async (
    fileId: string,
    data: AppData
): Promise<AppData> => {
    const dataVersion = data.version || '0.0'; // Assume 0.0 for data without a version field

    if (dataVersion === APP_VERSION) {
        console.log("Data is up to date. No migration needed.");
        return data;
    }

    console.log(`Data version mismatch. Found: v${dataVersion}, Required: v${APP_VERSION}. Starting migration.`);

    // --- Backup Step ---
    try {
        const backupName = `aivofinance_data_backup_v${dataVersion}_${new Date().toISOString()}.json`;
        await copyFile(fileId, backupName);
        console.log(`Successfully backed up data to ${backupName}`);
    } catch (error) {
        console.error("CRITICAL: Failed to back up data file. Aborting migration.", error);
        // We throw an error here to stop the process, as proceeding without a backup is risky.
        throw new Error("Data backup failed. Please try again.");
    }
    
    // --- Migration Logic ---
    let migratedData = { ...data };
    
    // This is where future migration steps will be added.
    // if (dataVersion < '0.1') {
    //   // Apply transformations for v0.1
    // }
    // if (dataVersion < '0.2') {
    //   // Apply transformations for v0.2
    // }

    // Update the version number in the data object.
    migratedData.version = APP_VERSION;

    return migratedData;
};