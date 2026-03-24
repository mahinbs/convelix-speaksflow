
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "btn-premium text-primary-foreground shadow-md hover:shadow-lg focus-elegant",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-2xl",
        outline:
          "rounded-2xl border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "rounded-2xl bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "rounded-2xl text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "h-auto !rounded-none p-0 text-primary underline-offset-4 shadow-none hover:underline",
      },
      size: {
        default: "h-12 rounded-2xl px-8 py-3",
        sm: "h-10 rounded-xl px-6",
        lg: "h-14 rounded-2xl px-10",
        icon: "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
