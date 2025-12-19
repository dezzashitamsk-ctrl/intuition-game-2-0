'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        // Check for saved theme in localStorage
        const savedTheme = localStorage.getItem('theme') as Theme | null
        if (savedTheme) {
            setTheme(savedTheme)
            return
        }

        // Check if running in Telegram
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tgTheme = window.Telegram.WebApp.colorScheme
            setTheme(tgTheme === 'light' ? 'light' : 'dark')
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark ? 'dark' : 'light')
        }
    }, [])

    useEffect(() => {
        if (!mounted) return

        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme)

        // Save to localStorage
        localStorage.setItem('theme', theme)

        // Notify Telegram if running in Telegram
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            // Telegram will handle theme changes automatically
            console.log('Theme changed to:', theme)
        }
    }, [theme, mounted])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    // Prevent flash of unstyled content
    if (!mounted) {
        return <>{children}</>
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

// Telegram WebApp types
declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                colorScheme: 'light' | 'dark'
                themeParams: {
                    bg_color?: string
                    text_color?: string
                    hint_color?: string
                    link_color?: string
                    button_color?: string
                    button_text_color?: string
                }
                ready: () => void
                expand: () => void
            }
        }
    }
}
