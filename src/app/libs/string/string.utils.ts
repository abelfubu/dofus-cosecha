export class StringUtils {
  static normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();
  }
}
