export function addSpacesToNumber(number: number | undefined) {
  const numberStr = number ? number.toString() : ''
  let result
  if (numberStr.length > 3) {
    result = numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  } else {
    result = numberStr
  }

  return result
}
