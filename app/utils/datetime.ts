export function toLocalISOString(dateString: string) {
    const date = new Date(dateString)
    const offset = -date.getTimezoneOffset() / 60
    const sign = offset >= 0 ? "+" : "-"
    const pad = (n: number) => String(n).padStart(2, "0")
  
    return (
      `${dateString}:00` + 
      `${sign}${pad(Math.abs(offset))}:00`
    )
  }
  