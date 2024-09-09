export enum Gender {
  Unknown = 4,
  Male = 5,
  Female = 6,
  Other = 7,
}

export const GENDERS = [
  { value: Gender.Unknown, label: 'Chưa có thông tin' },
  { value: Gender.Male, label: 'Nam' },
  { value: Gender.Female, label: 'Nữ' },
  { value: Gender.Other, label: 'Khác' },
];
