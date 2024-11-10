"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, UI, SelectionState, DayFlag } from "react-day-picker"
import { buttonVariants } from "./button"
import { cn } from "lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        [UI.Months]: "relative",
        [UI.Month]: "space-y-4 ml-0",
        [UI.MonthCaption]: "flex justify-center items-center h-7",
        [UI.CaptionLabel]: "text-sm font-medium",
        [UI.ButtonPrevious]: cn(
          buttonVariants({ variant: "outline" }),
          "absolute left-1 top-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        [UI.ButtonNext]: cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-1 top-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        [UI.MonthGrid]: "w-full border-collapse space-y-1",
        [UI.Weekdays]: "flex",
        [UI.Weekday]: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        [UI.Week]: "flex w-full mt-2",
        [UI.Day]: cn(
          "h-9 w-9 text-center rounded-md text-sm p-0 relative flex items-center justify-center",
          "hover:bg-gray-300 hover:text-accent-foreground",
          "focus:bg-accent focus:text-accent-foreground focus:rounded-md"
        ),
        [UI.DayButton]: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary hover:text-primary-foreground"
        ),
        [SelectionState.range_end]: "day-range-end",
        [SelectionState.selected]: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        [SelectionState.range_middle]: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        [DayFlag.today]: "bg-accent text-accent-foreground",
        [DayFlag.outside]: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        [DayFlag.disabled]: "text-muted-foreground opacity-50",
        [DayFlag.hidden]: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }