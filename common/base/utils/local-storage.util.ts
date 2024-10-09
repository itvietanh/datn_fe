export const ACCESS_TOKEN_KEY = 'token';
export const REFRESH_TOKEN_KEY = 'refresh-token';
export const HOTEL_ID_KEY = 'hotel-id';
export const QR_CODE_ID_KEY = 'qr-code-id';
export const CUSTOMER_SCANNER_SELECTED_INDEX_KEY =
  'customer-scanner-selected-index';
export const ROOM_TEMP_KEY = 'ROOM_TEMP';

export class LocalStorageUtil {
  static setItem(key: string, value: any): void {
    let data: any;
    switch (typeof value) {
      case 'string':
        data = value;
        break;
      case 'number':
        data = String(value);
        break;
      default:
        data = JSON.stringify(value);
        break;
    }
    localStorage.setItem(key, data);
  }

  static getItem<T = string>(
    key: string,
    type: 'string' | 'number' | 'json' = 'string'
  ): T {
    const value = localStorage.getItem(key);
    if (!value) {
      return null as any;
    }
    switch (type) {
      case 'string':
        return value as any;
      case 'number':
        return Number(value) as any;
      default:
        return JSON.parse(value);
    }
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }

  static removeItems(keys: string[]) {
    keys.forEach((key) => localStorage.removeItem(key));
  }

  static logOut(): void {
    LocalStorageUtil.removeItems([
      ACCESS_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      HOTEL_ID_KEY,
    ]);
  }

  static getHotelId() {
    return this.getItem<number>(HOTEL_ID_KEY, 'number');
  }

  static setHotelId(value: number) {
    if (value === 0) {
      return localStorage.removeItem(HOTEL_ID_KEY);
    }
    this.setItem(HOTEL_ID_KEY, value);
  }
}
