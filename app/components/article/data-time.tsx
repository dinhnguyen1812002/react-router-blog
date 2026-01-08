

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Input } from "~/components/ui/Input"
import { Label } from "~/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

interface Calendar24Props {
  date?: string
  setDate?: (value: string) => void
}

export function Calendar24({ date, setDate }: Calendar24Props) {  
  const [open, setOpen] = React.useState(false)
  
  // Helper function to parse date string safely
  const parseDate = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr || dateStr.trim() === "") return undefined
    const parsed = new Date(dateStr)
    // Check if date is valid
    if (isNaN(parsed.getTime())) return undefined
    return parsed
  }

  // Helper function to extract time from datetime string
  const extractTime = (dateStr: string | undefined): string => {
    if (!dateStr || dateStr.trim() === "") return "00:00"
    const timePart = dateStr.split('T')[1]
    if (!timePart) return "00:00"
    return timePart.slice(0, 5) || "00:00"
  }
  
  const dateValue = parseDate(date)
  const timeValue = extractTime(date)
  
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(dateValue)
  const [selectedTime, setSelectedTime] = React.useState<string>(timeValue)

  // Update local state when date prop changes
  React.useEffect(() => {
    const parsedDate = parseDate(date)
    const time = extractTime(date)
    
    if (parsedDate) {
      setSelectedDate(parsedDate)
      setSelectedTime(time)
    } else {
      setSelectedDate(undefined)
      setSelectedTime("00:00")
    }
  }, [date])

  const formatDateTime = (date: Date, time: string): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    // Ensure time is in HH:mm format
    const [hours = "00", minutes = "00"] = time.split(':')
    return `${year}-${month}-${day}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`
  }

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    if (newDate && setDate) {
      // Combine date and time into datetime-local format
      const datetimeString = formatDateTime(newDate, selectedTime)
      setDate(datetimeString)
    } else if (!newDate && setDate) {
      setDate("")
    }
    setOpen(false)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value
    setSelectedTime(time)
    if (selectedDate && setDate) {
      // Combine date and time into datetime-local format
      const datetimeString = formatDateTime(selectedDate, time)
      setDate(datetimeString)
    }
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          value={selectedTime}
          onChange={handleTimeChange}
          step="1"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
