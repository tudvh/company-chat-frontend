export class NumberUtil {
  public static currency(number: number | string): string {
    try {
      const parsedNumber = Number(number)
      if (isNaN(parsedNumber)) {
        throw new Error('Invalid number')
      }
      return parsedNumber.toLocaleString('vi-VI')
    } catch (error) {
      console.error('Error formatting currency:', error)
      return 'Invalid number'
    }
  }
}
