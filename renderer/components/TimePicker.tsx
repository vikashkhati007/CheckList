"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scrollarea"
import { cn } from "lib/utils"

interface TimePickerProps {
  onTimeSelect: (time: string) => void
  defaultValue?: string
}

export default function TimePickerComponent({ onTimeSelect, defaultValue = "" }: TimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState(defaultValue)
  const [customStart, setCustomStart] = React.useState("")
  const [customEnd, setCustomEnd] = React.useState("")
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  // Generate time slots from 01:00 to 24:00
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = String(i + 1).padStart(2, "0")
    return `${hour}:00`
  })

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))
  }

  const handleTimeSelect = (startTime: string) => {
    // Calculate end time (assuming 1-hour duration)
    const [startHour] = startTime.split(":")
    const endHour = String(Number(startHour) + 1).padStart(2, "0")
    const timeRange = `${startTime} - ${endHour}:00`
    setSelectedTime(timeRange)
    onTimeSelect?.(timeRange)
  }

  // const handleCustomTime = () => {
  //   if (customStart && customEnd) {
  //     const timeRange = `${customStart} - ${customEnd}`
  //     setSelectedTime(timeRange)
  //     onTimeSelect?.(timeRange)
  //   }
  // }

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Month selector */}
      <div className="flex items-center justify-between px-1">
        <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">{formatMonth(currentMonth)}</div>
        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Time grid */}
      <ScrollArea className="h-[300px] rounded-md border">
        <div className="grid grid-cols-4 gap-2 p-4">
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant="outline"
              className={cn(
                "h-10",
                selectedTime.includes(time) && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Custom time range
      <div className="space-y-2">
        <div className="text-sm font-medium">Custom Hours</div>
        <div className="flex gap-2">
          <input
            type="time"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <input
            type="time"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button onClick={handleCustomTime} className="shrink-0">
            Set Time
          </Button>
        </div>
      </div> */}
      {/* <div className="flex justify-end">
        <Button onClick={() => onTimeSelect?.(selectedTime)} className="w-full">
          Save Changes
        </Button>
      </div> */}
    </div>
  )
}