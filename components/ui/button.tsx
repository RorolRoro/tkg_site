import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-glow active:scale-95',
        destructive: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-glow active:scale-95',
        outline: 'border border-primary-600 bg-transparent text-primary-600 hover:bg-primary-600 hover:text-white hover:shadow-glow',
        secondary: 'bg-dark-800 text-white hover:bg-dark-700 hover:shadow-glow active:scale-95',
        ghost: 'text-white hover:bg-dark-800 hover:text-primary-400',
        link: 'text-primary-400 underline-offset-4 hover:underline',
        glow: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-glow hover:shadow-glow-lg hover:scale-105 active:scale-95',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

