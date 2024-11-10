"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "lib/utils"

interface DueDatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
}

export default function DueDatePicker({ date, onDateChange }: DueDatePickerProps = { date: undefined, onDateChange: () => {} }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          className="p-4"
        />
      </PopoverContent>
    </Popover>
  )
}