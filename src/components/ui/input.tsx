import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  wrapperClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, wrapperClassName, ...props }, ref) => {
    if (icon) {
      return (
        <div className={cn(
          "relative flex items-center w-full rounded-xl bg-dark-3 shadow-soft-blue/10",
          wrapperClassName
        )}>
          <div className="absolute left-4 text-light-3">
            {icon}
          </div>
          <input
            type={type}
            className={cn(
              "flex h-14 w-full rounded-xl border-none bg-transparent px-12 py-4",
              "text-base text-light-1",
              "placeholder:text-light-4",
              "focus:outline-none focus:ring-2 focus:ring-primary-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-xl border-none bg-dark-3 px-4 py-4",
          "text-base text-light-1 shadow-soft-blue/10",
          "placeholder:text-light-4",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }