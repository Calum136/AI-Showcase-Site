import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-copper text-surface-paper",
        secondary:
          "border-transparent bg-brand-charcoal text-surface-paper",
        destructive:
          "border-transparent bg-brand-red text-surface-paper",
        outline:
          "border-surface-line text-brand-brown bg-transparent",
        // Fit check specific badges
        success:
          "border-brand-moss bg-brand-moss/10 text-brand-moss",
        warning:
          "border-brand-copper bg-brand-copper/10 text-brand-copper",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }
