export class NumberUtil {
  static toCurrency(value: number) {
    const val = this.format(value);
    return (val || 0) + ' đ';
  }

  static format(value: number) {
    if (value != null) {
      const val = new Intl.NumberFormat('vi-VN').format(value);
      if (val.includes(',')) {
        return val
          .replaceAll(',', '|')
          .replaceAll('.', ',')
          .replaceAll('|', ',');
      }
      return val.replaceAll('.', ',');
    }
    return '';
  }
}
