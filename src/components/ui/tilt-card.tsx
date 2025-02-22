"use client"

import type React from "react"
import Tilt from "react-parallax-tilt"
import { Card } from "@/components/ui/card"

const defaultOptions = {
  reverse: false,
  max: 15,
  perspective: 1000,
  scale: 1.02,
  speed: 1000,
  transition: true,
  axis: null,
  reset: true,
  easing: "cubic-bezier(.03,.98,.52,.99)",
}

interface TiltCardProps {
  children: React.ReactNode
  className?: string
}

export function TiltCard({ children, className }: TiltCardProps) {
  return (
    <Tilt {...defaultOptions}>
      <Card className={`transform-gpu bg-dark-2 border-dark-4 
                       hover:shadow-medium-blue transition-all duration-300 ${className}`}>
        {children}
      </Card>
    </Tilt>
  )
}