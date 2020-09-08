
export class DateFormatter {
    public static formatDateForDisplay(date: Date): string {
        return date.getFullYear() + "-" +
               ((date.getMonth() + 1).toString().length > 1 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1) ) + "-" +
               ((date.getDate()).toString().length > 1 ? (date.getDate()) : "0" + (date.getDate()));
    }
}