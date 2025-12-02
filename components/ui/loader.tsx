"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

const loaderVariants = cva("relative inline-flex", {
  variants: {
    variant: {
      default: "items-center justify-center",
      dots: "gap-1 items-center",
      pulse: "items-center justify-center",
      spinner: "items-center justify-center",
    },
    size: {
      xs: "h-4 w-4",
      sm: "h-5 w-5",
      md: "h-8 w-8",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    },
    variantColor: {
      primary: "text-[#155DFC]",
      white: "text-white",
      slate: "text-slate-500",
      gray: "text-gray-400",
    }
  },
  defaultVariants: {
    variant: "spinner",
    size: "md",
    variantColor: "primary",
  },
})

interface LoaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof loaderVariants> {
  text?: string
  fullScreen?: boolean
}

export function Loader({ className, variant, size, variantColor, text, fullScreen, ...props }: LoaderProps) {
  const Container = fullScreen ? FullScreenWrapper : React.Fragment
  const wrapperProps = fullScreen ? { text } : {}

  return (
    // @ts-ignore - strict typing with Fragment vs div issue
    <Container {...wrapperProps}>
      <div className={cn("flex items-center", fullScreen ? "flex-col" : "")}>
        <div className={cn(loaderVariants({ variant, size, variantColor }), className)} {...props}>
          {variant === "spinner" && (
            <motion.div
              className="w-full h-full rounded-full border-2 border-current border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}

          {variant === "dots" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-full w-full rounded-full bg-current"
                  initial={{ opacity: 0.5, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.2,
                  }}
                  style={{ width: "33%" }}
                />
              ))}
            </>
          )}
          
          {variant === "pulse" && (
            <>
              <motion.div
                  className="absolute inset-0 rounded-full bg-current opacity-20"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="w-full h-full rounded-full bg-current" />
            </>
          )}
        </div>
        {text && !fullScreen && (
          <span className={cn("ml-3 text-sm font-medium", variantColor === "white" ? "text-white" : "text-slate-600 dark:text-slate-300")}>
            {text}
          </span>
        )}
      </div>
    </Container>
  )
}

const FullScreenWrapper = ({ children, text }: { children: React.ReactNode, text?: string }) => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
    {children}
    {text && (
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-300"
      >
        {text}
      </motion.p>
    )}
  </div>
)
