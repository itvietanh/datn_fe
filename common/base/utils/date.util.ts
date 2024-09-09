
export class DateUtil {

  static inHours(d1: Date, d2: Date) {
    let t2 = d2.getTime();
    let t1 = d1.getTime();

    return Math.floor((t2 - t1) / (3600 * 1000));
  }

  static inDays(d1: Date, d2: Date) {
    let t2 = d2.getTime();
    let t1 = d1.getTime();

    return Math.floor((t2 - t1) / (24 * 3600 * 1000));
  }

  static inWeeks(d1: Date, d2: Date) {
    let t2: number = d2.getTime();
    let t1: number = d1.getTime();

    return (t2 - t1) / (24 * 3600 * 1000 * 7);
  }

  static inMonths(d1: Date, d2: Date) {
    let d1Y = d1.getFullYear();
    let d2Y = d2.getFullYear();
    let d1M = d1.getMonth();
    let d2M = d2.getMonth();

    return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
  }

  static inYears(d1: Date, d2: Date) {
    return d2.getFullYear() - d1.getFullYear();
  }

  static formatDate(longValue: number) {
    let strDate = String(longValue);
    const year = strDate.slice(0, 4);
    const month = strDate.slice(4, 6);
    const day = strDate.slice(6, 8);
    const hours = strDate.slice(8, 10);
    const minutes = strDate.slice(10, 12);
    const seconds = strDate.slice(12, 14);

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}
