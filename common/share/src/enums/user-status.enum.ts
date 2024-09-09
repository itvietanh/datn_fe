export enum UserStatus {
  InActive = 0,
  Active = 1,
}

export const USER_STATUS_OPTIONS = [
  { value: UserStatus.Active, label: 'Đang làm việc' },
  { value: UserStatus.InActive, label: 'Đã nghỉ việc' },
];
