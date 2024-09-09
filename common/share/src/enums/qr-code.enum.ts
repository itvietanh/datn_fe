export enum QrCodeStatus {
  InActive = 1,
  Active = 2,
  Locked = 3,
}

export const QR_CODE_STATUS = [
  { value: QrCodeStatus.InActive, label: 'Chưa hoạt động' },
  { value: QrCodeStatus.Active, label: 'Hoạt động' },
  { value: QrCodeStatus.Locked, label: 'Khoá' },
];
