import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInDays, differenceInMonths, differenceInYears } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function calculateAge(
    dob: Date,
    format: ("years" | "months" | "days")[] = ["years", "months", "days"]
  ): string {
    const now = new Date();
  
    const totalYears = differenceInYears(now, dob);
    const totalMonths = differenceInMonths(now, dob);
    const totalDays = differenceInDays(now, dob);
  
    let years = 0, months = 0, days = 0;
  
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
  
    return result.join(", ");
  }