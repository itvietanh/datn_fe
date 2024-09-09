export enum ContractStatus {
  OPEN = 0,
  OPEN_LABEL = 'Chờ nhập viện',
  CHECKIN = 1,
  CHECKIN_LABEL = "Đang điều trị",
  CHECKOUT = 2,
  CHECKOUT_LABEL = "Chờ thanh toán",
  PENDING = 3,
  PENDING_LABEL = "Chờ chuyển khoa",
  CLOSED = 4,
  CLOSED_LABEL = "Đã thanh toán",
}
