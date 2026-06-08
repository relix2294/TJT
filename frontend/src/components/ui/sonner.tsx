"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-[var(--profit)]" />,
        info: <InfoIcon className="size-4 text-primary" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4 text-[var(--loss)]" />,
        loading: <Loader2Icon className="size-4 animate-spin text-primary" />,
      }}
      style={
        {
          "--normal-bg": "color-mix(in oklab, var(--popover) 88%, transparent)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "calc(var(--radius) * 1.2)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast !backdrop-blur-xl !border-white/[0.07] !shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]",
          title: "!font-heading !font-semibold",
          description: "!text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
