export class LocalStorageUtil {
  public static getValue(key: string): string | null {
    return localStorage.getItem(key)
  }

  public static setValue(key: string, value: string): void {
    localStorage.setItem(key, value)
  }

  public static removeValue(key: string): void {
    localStorage.removeItem(key)
  }

  public static clearAll(): void {
    localStorage.clear()
  }
}
