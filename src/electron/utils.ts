import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from 'url';
import { differenceInDays, differenceInMonths, differenceInYears, formatISO } from "date-fns";
import { getConfigs } from "./database/db.js";
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow } from 'electron';

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: (...args: EventPayloadMapping[Key]['args']) => Promise<EventPayloadMapping[Key]['return']>
) {
    ipcMain.handle(key, async (event, ...args) => {
        // validateEventFrame(event.senderFrame!);
        return handler(...(args as EventPayloadMapping[Key]['args']));
    });
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: (event: Electron.IpcMainEvent, ...args: EventPayloadMapping[Key]['args']) => void
) {
    ipcMain.on(key, (event, ...args) => {
        handler(event, ...(args as EventPayloadMapping[Key]['args']));
    });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
) {
    webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
    if (isDev() && new URL(frame.url).host === 'localhost:5123') {
        return;
    }
    if (frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error("Malicious event");
    }
}

export async function calculateAge(
    dob: Date,
    formatArg?: ("years" | "months" | "days")[]
): Promise<string> {
    const now = new Date();

    const totalYears = differenceInYears(now, dob);
    const totalMonths = differenceInMonths(now, dob);
    const totalDays = differenceInDays(now, dob);

    let years = 0, months = 0, days = 0;

    let format: ("years" | "months" | "days")[];
    if (!formatArg) {
        format = (await getConfigs(2)).configuration.age_format;
    } else {
        format = formatArg;
    }

    if (format.length === 1) {
        if (format.includes("years")) {
            years = totalYears;
        } else if (format.includes("months")) {
            months = totalMonths;
        } else if (format.includes("days")) {
            days = totalDays;
        }
    } else {
        if (format.includes("years")) {
            years = totalYears;
            dob = new Date(dob);
            dob.setFullYear(dob.getFullYear() + years);
        }

        if (format.includes("months")) {
            months = differenceInMonths(now, dob);
            dob = new Date(dob);
            dob.setMonth(dob.getMonth() + months);
        }

        if (format.includes("days")) {
            days = differenceInDays(now, dob);
        }
    }

    const result: string[] = [];
    if (format.includes("years")) result.push(`${years} years`);
    if (format.includes("months")) result.push(`${months} months`);
    if (format.includes("days")) result.push(`${days} days`);

    return result.join(" ");
}

export function calculateAgeArray(dob: Date): number[] {
    const now = new Date();

    const totalYears = differenceInYears(now, dob);

    let years = 0, months = 0, days = 0;

    years = totalYears;
    dob = new Date(dob);
    dob.setFullYear(dob.getFullYear() + years);

    months = differenceInMonths(now, dob);
    dob = new Date(dob);
    dob.setMonth(dob.getMonth() + months);

    days = differenceInDays(now, dob);

    return [years, months, days];
}

export function findTheCorrectNormalRangeRule(
    normalRanges: NormalRange[],
    testFieldId: number,
    patientDateOfBirth: Date,
    patientGender: string,
    unit: string
) {
    if (testFieldId == -1) {
        return ""
    }

    const normalRangeRules: any = normalRanges.find((item) => item.test_field_id == testFieldId)?.rules;

    for (const rule of normalRangeRules) {
        if (isWithinNormalRange(patientDateOfBirth, patientGender, rule)) {
            if (rule.type == "range") {
                return `${rule.valueLower} - ${rule.valueUpper} ${unit}`;
            } else if (rule.type == "≥") {
                return `≥ ${rule.valueLower} ${unit}`;
            } else {
                return `≤ ${rule.valueUpper} ${unit}`;
            }
        }
    }

    return "";
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function isWithinNormalRange(patientDOB: Date, patientGender: string, normalRange: any) {
    const now = new Date();

    const ageYears = differenceInYears(now, patientDOB);
    const ageMonths = differenceInMonths(now, patientDOB) % 12;
    const ageDays = differenceInDays(now, patientDOB) % 30;

    const ageLowerInDays =
        normalRange.ageLower.y * 365 +
        normalRange.ageLower.m * 30 +
        normalRange.ageLower.d;
    const ageUpperInDays =
        normalRange.ageUpper.y * 365 +
        normalRange.ageUpper.m * 30 +
        normalRange.ageUpper.d;

    const patientAgeInDays = ageYears * 365 + ageMonths * 30 + ageDays;

    const isAgeWithinRange =
        patientAgeInDays >= ageLowerInDays && patientAgeInDays <= ageUpperInDays;

    const isGenderValid = normalRange.gender.includes(patientGender);

    return isAgeWithinRange && isGenderValid;
}

export function writeErrorLog(error: any) {
    const outputPath = path.join(app.getPath('desktop'), 'pdf-output', 'crash-reports');
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    const date = new Date();
    const filePath = path.join(outputPath, `${formatISO(date, { representation: "date" })}_${formatISO(new Date(), { representation: "date" })}.txt`);
    const message = `
    Date / Time: ${date.toString()} \n
    \n
    Message: ${error.message}\n
    \n
    Error: ${error}
    `;
    fs.writeFileSync(filePath, message);
}