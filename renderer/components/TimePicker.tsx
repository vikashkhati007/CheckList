"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scrollarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { cn } from "lib/utils"

interface TimePickerProps {
  onTimeSelect: (time: string) => void
  defaultValue?: string
}

export default function TimePickerComponent({ onTimeSelect, defaultValue = "" }: TimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState(defaultValue)
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [isOpen, setIsOpen] = React.useState(false)

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
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between"
        >
          {selectedTime || 'Select time'}
          <Clock className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Time</DialogTitle>
        </DialogHeader>
        
        <div className="w-full space-y-4">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}