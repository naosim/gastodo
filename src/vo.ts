class Vo<T> {
  public value: T;
  constructor(value: T) {
      this.value = value;
  }
}
export class StringVo extends Vo<string> {
}

export class NumberVo extends Vo<number> {
}

export class DateVo extends Vo<Date> {
  getDateText() {
    return `${this.value.getFullYear()}/${this.getDateExcludeYearText()}`
  }
  getDateExcludeYearText() {
    return `${DateVo.zerofill(this.value.getMonth() + 1)}/${DateVo.zerofill(this.value.getDate())}`
  }
  getTimeText() {
    return `${DateVo.zerofill(this.value.getHours())}:${DateVo.zerofill(this.value.getMinutes())}`
  }

  static zerofill(v: any) {
    return ('0' + v).slice(-2);
  }
  public static toJpnDay(num: number) {
    return '日月火水木金土'[num];
  }
}