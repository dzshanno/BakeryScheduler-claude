// src/components/ui/card.jsx
import React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(function Card(props, ref) {
  const { className, ...restProps } = props
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...restProps}
    />
  )
})

const CardHeader = React.forwardRef(function CardHeader(props, ref) {
  const { className, ...restProps } = props
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...restProps}
    />
  )
})

const CardTitle = React.forwardRef(function CardTitle(props, ref) {
  const { className, ...restProps } = props
  return (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...restProps}
    />
  )
})

const CardDescription = React.forwardRef(function CardDescription(props, ref) {
  const { className, ...restProps } = props
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...restProps}
    />
  )
})

const CardContent = React.forwardRef(function CardContent(props, ref) {
  const { className, ...restProps } = props
  return (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...restProps} />
  )
})

const CardFooter = React.forwardRef(function CardFooter(props, ref) {
  const { className, ...restProps } = props
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...restProps}
    />
  )
})

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardTitle.displayName = "CardTitle"
CardDescription.displayName = "CardDescription"
CardContent.displayName = "CardContent"
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
}
