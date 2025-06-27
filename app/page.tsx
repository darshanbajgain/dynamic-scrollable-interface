"use client"

import { useState, useEffect, useCallback, useRef } from "react"

const MAX_ITEMS = 50
const DELAY_MS = 500

export default function Home() {
  const [items, setItems] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"vertical1" | "horizontal" | "vertical2" | "complete">("vertical1")

  const horizontalSectionRef = useRef<HTMLDivElement>(null)

  // Load the next item with delay
  const loadNextItem = useCallback(() => {
    if (isLoading || items.length >= MAX_ITEMS) return

    setIsLoading(true)

    setTimeout(() => {
      setItems((prevItems) => {
        if (prevItems.length >= MAX_ITEMS) {
          setIsLoading(false)
          setCurrentPhase("complete")
          return prevItems
        }

        const nextItem = prevItems.length + 1

        // Update phase based on item number
        if (nextItem > 30) {
          setCurrentPhase("vertical2")
        } else if (nextItem > 20) {
          setCurrentPhase("horizontal")
        } else {
          setCurrentPhase("vertical1")
        }

        if (nextItem === MAX_ITEMS) {
          setCurrentPhase("complete")
        }

        return [...prevItems, nextItem]
      })
      setIsLoading(false)
    }, DELAY_MS)
  }, [isLoading, items.length])

  // Vertical scroll handler for phases 1 and 3
  useEffect(() => {
    if (currentPhase !== "vertical1" && currentPhase !== "vertical2") return

    const handleVerticalScroll = () => {
      if (isLoading || items.length >= MAX_ITEMS) return

      const scrollTop = window.pageYOffset
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollTop + windowHeight >= documentHeight - 100) {
        loadNextItem()
      }
    }

    let timeoutId: NodeJS.Timeout
    const throttledScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleVerticalScroll, 100)
    }

    window.addEventListener("scroll", throttledScroll)
    return () => {
      window.removeEventListener("scroll", throttledScroll)
      clearTimeout(timeoutId)
    }
  }, [currentPhase, isLoading, items.length, loadNextItem])

  // Horizontal scroll handler for phase 2
  useEffect(() => {
    if (currentPhase !== "horizontal") return

    const horizontalSection = horizontalSectionRef.current
    if (!horizontalSection) return

    const handleHorizontalScroll = () => {
      if (isLoading || items.length >= 30) return

      const { scrollLeft, scrollWidth, clientWidth } = horizontalSection

      // Trigger when scrolled 20% of the way horizontally
      if (scrollLeft + clientWidth >= scrollWidth * 0.2) {
        loadNextItem()
      }
    }

    // Handle wheel events to convert vertical scroll to horizontal
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY || e.deltaX
      horizontalSection.scrollLeft += delta

      // Check if we should load next item
      setTimeout(handleHorizontalScroll, 50)
    }

    // Handle direct horizontal scroll
    const handleScroll = () => {
      handleHorizontalScroll()
    }

    horizontalSection.addEventListener("scroll", handleScroll)
    horizontalSection.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      horizontalSection.removeEventListener("scroll", handleScroll)
      horizontalSection.removeEventListener("wheel", handleWheel)
    }
  }, [currentPhase, isLoading, items.length, loadNextItem])

  // Auto-load item 21 when entering horizontal phase
  useEffect(() => {
    if (items.length === 20) {
      setTimeout(() => {
        loadNextItem()
      }, 100)
    }
  }, [items.length, loadNextItem])

  // Load first item on mount
  useEffect(() => {
    if (items.length === 0) {
      loadNextItem()
    }
  }, [items.length, loadNextItem])

  // Filter items by section
  const verticalItems1 = items.filter((i) => i >= 1 && i <= 20)
  const horizontalItems = items.filter((i) => i >= 21 && i <= 30)
  const verticalItems2 = items.filter((i) => i >= 31 && i <= 50)

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-100">Dynamic Scroll Interface</h1>
          <p className="text-lg text-gray-400 mb-4">
            {currentPhase === "horizontal" ? "🔄 Scroll horizontally to load items →" : "⬇️ Scroll down to load items"}
          </p>
          <div className="text-sm text-gray-500">
            Phase: <span className="capitalize font-semibold text-teal-400">{currentPhase}</span> | Items loaded:{" "}
            <span className="font-semibold text-teal-400">{items.length}</span>/50
          </div>
        </header>

        <div className="space-y-16">
          {/* Section 1: Vertical Items 1-20 */}
          {verticalItems1.length > 0 && (
            <section className="space-y-8">
              <h2 className="text-xl font-semibold text-center text-gray-300 mb-8">Vertical Section (1-20)</h2>
              <div className="flex flex-col items-center gap-8">
                {verticalItems1.map((num) => (
                  <div
                    key={num}
                    className="w-full max-w-md animate-fadeIn rounded-xl border border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 p-8 shadow-lg transform transition-all duration-300 hover:scale-105"
                  >
                    <p className="text-center text-3xl font-bold text-white">{num}</p>
                    <p className="text-center text-sm text-gray-400 mt-2">Vertical Item</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 2: Horizontal Items 21-30 - TRUE HORIZONTAL SCROLLING */}
          {horizontalItems.length > 0 && (
            <section className="min-h-screen flex flex-col justify-center">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-teal-300 mb-4">🔄 Horizontal Section (21-30)</h2>
                <p className="text-lg text-yellow-400 font-semibold">Scroll horizontally to load items →</p>
                <p className="text-sm text-gray-400 mt-2">Use mouse wheel, trackpad, or drag the scrollbar</p>
              </div>

              {/* Horizontal scrolling container */}
              <div
                ref={horizontalSectionRef}
                className="w-full h-96 overflow-x-auto overflow-y-hidden bg-gray-800 rounded-xl p-6 border-2 border-teal-600"
                style={{ scrollbarWidth: "thin" }}
              >
                <div
                  className="flex items-center gap-8 h-full"
                  style={{
                    width: `${Math.max(horizontalItems.length * 350 + 800, window.innerWidth * 2)}px`,
                  }}
                >
                  {horizontalItems.map((num) => (
                    <div
                      key={num}
                      className="flex-shrink-0 animate-fadeIn rounded-xl border-2 border-teal-400 bg-gradient-to-br from-teal-900 to-teal-800 p-8 shadow-lg w-80 h-72 flex flex-col items-center justify-center transform transition-all duration-300 hover:scale-105"
                    >
                      <p className="text-center text-5xl font-bold text-white mb-4">{num}</p>
                      <p className="text-center text-lg text-teal-200">Horizontal Item</p>
                      <p className="text-center text-sm text-teal-300 mt-2">Keep scrolling right →</p>
                    </div>
                  ))}

                  {/* Loading indicator for horizontal section */}
                  {isLoading && currentPhase === "horizontal" && (
                    <div className="flex-shrink-0 w-80 h-72 flex flex-col items-center justify-center rounded-xl border-2 border-teal-500 bg-teal-900/50">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-400 mb-4"></div>
                      <p className="text-lg text-teal-300">Loading...</p>
                      <p className="text-sm text-teal-400 mt-2">{DELAY_MS}ms delay</p>
                    </div>
                  )}

                  {/* Extra space to ensure scrolling */}
                  <div className="flex-shrink-0 w-96 h-full flex items-center justify-center">
                    {horizontalItems.length >= 10 ? (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-300 mb-2">🎉 Section Complete!</p>
                        <p className="text-purple-400">Scroll down to continue</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <p>Keep scrolling right →</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <p className="text-base text-gray-300">
                  🖱️ Mouse wheel scrolls horizontally | 📱 Swipe left/right on mobile
                </p>
              </div>
            </section>
          )}

          {/* Section 3: Vertical Items 31-50 */}
          {verticalItems2.length > 0 && (
            <section className="space-y-8">
              <h2 className="text-xl font-semibold text-center text-gray-300 mb-8">Final Vertical Section (31-50)</h2>
              <div className="flex flex-col items-center gap-8">
                {verticalItems2.map((num) => (
                  <div
                    key={num}
                    className="w-full max-w-md animate-fadeIn rounded-xl border border-purple-600 bg-gradient-to-r from-purple-900 to-purple-800 p-8 shadow-lg transform transition-all duration-300 hover:scale-105"
                  >
                    <p className="text-center text-3xl font-bold text-white">{num}</p>
                    <p className="text-center text-sm text-purple-300 mt-2">Final Vertical Item</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Loading indicator for vertical sections */}
          {isLoading && (currentPhase === "vertical1" || currentPhase === "vertical2") && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mb-4"></div>
              <p className="text-lg text-gray-400">Loading next item...</p>
              <p className="text-sm text-gray-500 mt-2">{DELAY_MS}ms delay per item</p>
            </div>
          )}

          {/* Completion message */}
          {currentPhase === "complete" && (
            <div className="text-center py-6">
              <div className="animate-fadeIn bg-gradient-to-r from-green-900 to-green-800 rounded-xl p-8 border border-green-600">
                <h3 className="text-2xl font-bold text-green-300 mb-2">🎉 Complete!</h3>
                <p className="text-green-400">All 50 items have been loaded successfully</p>
              </div>
            </div>
          )}

          {/* Spacer for vertical sections only */}
          {currentPhase !== "horizontal" && <div className="h-96"></div>}
        </div>
      </main>
    </div>
  )
}