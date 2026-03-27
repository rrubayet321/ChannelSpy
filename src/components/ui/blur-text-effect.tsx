"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

interface BlurTextEffectProps {
  children: string
  className?: string
}

export function BlurTextEffect({ children, className = "" }: BlurTextEffectProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const words = children.split(" ")

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const words = container.querySelectorAll("span.word")
    if (reduceMotion || words.length === 0) return

    const animationContext = gsap.context(() => {
      gsap.set(container, {
        opacity: 0,
        clipPath: "inset(0 0 100% 0)",
      })
      gsap.set(words, { opacity: 0, y: 8 })

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })

      timeline.to(container, {
        opacity: 1,
        clipPath: "inset(0 0 0% 0)",
        duration: 0.55,
      })
      timeline.to(
        words,
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          stagger: 0.04,
        },
        "-=0.35",
      )
    }, container)

    return () => {
      animationContext.revert()
    }
  }, [children])

  return (
    <span className={`inline-block ${className}`} ref={containerRef}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="word inline-block">
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  )
}
