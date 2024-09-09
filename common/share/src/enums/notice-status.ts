export const statusSendNoticeEl = {
  notSend: {
    label: "Chưa gửi",
    value: 0,
    style: { color: "black" },
  },
  waitSend: {
    label: "Đang chờ gửi",
    value: 1,
    style: { color: "blue" },
  },
  sended: {
    label: "Chờ tiếp nhận",
    value: 2,
    style: { color: "orange" },
  },
  received: {
    label: "Đã tiếp nhận",
    value: 3,
    style: { color: "green" },
  },
  returned: {
    label: "Đã trả lại",
    value: 4,
    style: { color: "blue" },
  },
  deleted: {
    label: "Đã xóa",
    value: 5,
    style: { color: "red" },
  },
  fail: {
    label: "Thất bại",
    value: 6,
    style: { color: "red" },
  },
};

export const statusNotice = [
  statusSendNoticeEl.notSend,
  statusSendNoticeEl.waitSend,
  statusSendNoticeEl.sended,
  statusSendNoticeEl.received,
  statusSendNoticeEl.returned,
  statusSendNoticeEl.deleted,
  statusSendNoticeEl.fail,
];
