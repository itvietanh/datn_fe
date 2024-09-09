export const choPheDuyetDangKyMoi = {
  label: 'Chờ phê duyệt đăng ký mới',
  value: 0,
};
export const pheDuyetDangKyMoi = { label: 'Phê duyệt đăng ký mới', value: 1 };
export const tuChoiPheDuyetDangKyMoi = {
  label: 'Từ chối phê duyệt đăng ký mới',
  value: 2,
};
export const dangKyMoi = { label: 'Đăng ký mới', value: 3 };
export const choPheDuyetCapNhat = { label: 'Chờ phê duyệt cập nhật', value: 4 };
export const pheDuyetCapNhat = { label: 'Đã phê duyệt cập nhật', value: 5 };
export const tuChoiPheDuyetCapNhat = {
  label: 'Từ chối phê duyệt cập nhật',
  value: 6,
};
export const daXoa = { label: 'Đã xóa', value: 7 };
export const capNhat = { label: 'Cập nhật', value: 8 };

export const accomStatuses = [
  choPheDuyetDangKyMoi,
  pheDuyetDangKyMoi,
  tuChoiPheDuyetDangKyMoi,
  dangKyMoi,
  choPheDuyetCapNhat,
  pheDuyetCapNhat,
  tuChoiPheDuyetCapNhat,
  capNhat,
];

export enum AccomStatus {
  OFF = 1,
  OFF_LABEL = "Chưa hoạt động",
  ONLINE = 2,
  ONLINE_LABEL = "Hoạt động",
  MAINTAIN = 3,
  MAINTAIN_LABEL = "Bảo trì"
}

export enum AccomClearStatus {
  CLEAR = 1,
  CLEAR_LABEL = "Trống",
  USING = 2,
  USING_LABEL = "Đang sử dụng",
  DIRTY = 3,
  DIRTY_LABEL = "Chưa dọn"
}

