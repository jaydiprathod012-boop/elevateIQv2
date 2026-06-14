import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:  "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/30",
        destructive: "bg-red-600 text-white hover:bg-red-500",
        outline:  "border border-purple-500/40 bg-transparent text-purple-300 hover:bg-purple-500/10 hover:border-purple-400",
        secondary:"bg-secondary text-secondary-foreground hover:bg-accent",
        ghost:    "text-muted-foreground hover:bg-accent hover:text-foreground",
        link:     "text-purple-400 underline-offset-4 hover:underline",
        gradient: "gradient-neon text-white shadow-lg shadow-purple-900/40 hover:opacity-90",
        neon:     "bg-transparent border border-cyan-400/60 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]",
        emerald:  "bg-emerald-600/80 text-white hover:bg-emerald-500 border border-emerald-500/40",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm:  "h-8 rounded-md px-3 text-xs",
        lg:  "h-12 rounded-lg px-8 text-base",
        xl:  "h-14 rounded-xl px-10 text-base",
        icon:"h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"
export { Button, buttonVariants }
