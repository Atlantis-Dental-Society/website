"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ClockIcon } from "lucide-react"

interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  use12Hour?: boolean
  className?: string
  id?: string
}

function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
  use12Hour = true,
  className,
  id,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const { hour, minute, period } = React.useMemo(() => {
    if (!value) return { hour: -1, minute: -1, period: "AM" as const }
    const [h, m] = value.split(":").map(Number)
    if (use12Hour) {
      const period = h >= 12 ? ("PM" as const) : ("AM" as const)
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      return { hour: hour12, minute: m, period }
    }
    return { hour: h, minute: m, period: "AM" as const }
  }, [value, use12Hour])

  const hours = use12Hour
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i)

  const minutes = Array.from({ length: 60 }, (_, i) => i)

  function buildTimeString(h: number, m: number, p: string) {
    let hour24 = h
    if (use12Hour) {
      if (p === "AM") {
        hour24 = h === 12 ? 0 : h
      } else {
        hour24 = h === 12 ? 12 : h + 12
      }
    }
    return `${String(hour24).padStart(2, "0")}:${String(m).padStart(2, "0")}`
  }

  function handleHourSelect(h: number) {
    const m = minute === -1 ? 0 : minute
    onChange?.(buildTimeString(h, m, period))
  }

  function handleMinuteSelect(m: number) {
    const h = hour === -1 ? (use12Hour ? 12 : 0) : hour
    onChange?.(buildTimeString(h, m, period))
  }

  function handlePeriodSelect(p: string) {
    const h = hour === -1 ? 12 : hour
    const m = minute === -1 ? 0 : minute
    onChange?.(buildTimeString(h, m, p))
  }

  const displayValue = React.useMemo(() => {
    if (!value || hour === -1) return null
    const hStr = use12Hour
      ? String(hour)
      : String(hour).padStart(2, "0")
    const mStr = String(minute).padStart(2, "0")
    return use12Hour ? `${hStr}:${mStr} ${period}` : `${hStr}:${mStr}`
  }, [value, hour, minute, period, use12Hour])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="time-picker"
          variant="outline"
          id={id}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !displayValue && "text-muted-foreground",
            className
          )}
        >
          <span className="flex items-center gap-2">
            <ClockIcon className="size-4 text-muted-foreground" />
            {displayValue ?? placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
      >
        <div
          data-slot="time-picker-content"
          className="flex divide-x divide-border"
        >
          <TimeColumn
            items={hours}
            selected={hour}
            onSelect={handleHourSelect}
            label="Hour"
          />
          <TimeColumn
            items={minutes}
            selected={minute}
            onSelect={handleMinuteSelect}
            label="Minute"
            pad
          />
          {use12Hour && (
            <div className="flex flex-col">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                &nbsp;
              </div>
              <div className="flex flex-col gap-1 p-2">
                {(["AM", "PM"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm transition-colors",
                      period === p && value
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                    onClick={() => handlePeriodSelect(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function TimeColumn({
  items,
  selected,
  onSelect,
  label,
  pad = false,
}: {
  items: number[]
  selected: number
  onSelect: (value: number) => void
  label: string
  pad?: boolean
}) {
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (selected === -1) return
    const el = listRef.current?.querySelector(
      `[data-value="${selected}"]`
    ) as HTMLElement | null
    el?.scrollIntoView({ block: "center" })
  }, [selected])

  return (
    <div className="flex flex-col">
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
        {label}
      </div>
      <ScrollArea className="h-56">
        <div ref={listRef} className="flex flex-col gap-0.5 p-2">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              data-value={item}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm tabular-nums transition-colors",
                selected === item
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => onSelect(item)}
            >
              {pad ? String(item).padStart(2, "0") : item}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export { TimePicker }
export type { TimePickerProps }
