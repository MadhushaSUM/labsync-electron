import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from 'url';
import { differenceInDays, differenceInMonths, differenceInYears } from "date-fns";
import { getConfigs } from "./database/db.js";

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

    const patientAge = calculateAge(patientDateOfBirth);

    const normalRangeRules: any = normalRanges.find((item) => item.test_field_id == testFieldId)?.rules;

    for (const rule of normalRangeRules) {
        if (rule.ageUpper > patientAge && rule.ageLower <= patientAge && rule.gender.includes(patientGender)) {
            return `${rule.valueLower} - ${rule.valueUpper}`
        }
    }

    return "";
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}