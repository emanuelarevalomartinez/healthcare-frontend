
import { Badge } from "@/components/ui/badge"

export type BadgeType = 'default' | 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'gray'

interface BadgeConfig {
  bg: string
  text: string
  darkBg: string
  darkText: string
}

const badgeColors: Record<BadgeType, BadgeConfig> = {
  default: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    darkBg: 'dark:bg-gray-950',
    darkText: 'dark:text-gray-300'
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    darkBg: 'dark:bg-blue-950',
    darkText: 'dark:text-blue-300'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    darkBg: 'dark:bg-green-950',
    darkText: 'dark:text-green-300'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    darkBg: 'dark:bg-red-950',
    darkText: 'dark:text-red-300'
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    darkBg: 'dark:bg-yellow-950',
    darkText: 'dark:text-yellow-300'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    darkBg: 'dark:bg-purple-950',
    darkText: 'dark:text-purple-300'
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    darkBg: 'dark:bg-orange-950',
    darkText: 'dark:text-orange-300'
  },
  gray: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    darkBg: 'dark:bg-gray-950',
    darkText: 'dark:text-gray-300'
  }
}

interface BadgeWrapperProps {
  type?: BadgeType
  children?: React.ReactNode
  className?: string
}

export function BadgeWrapper({ 
  type = 'default',
  children,
  className = ''
}: BadgeWrapperProps) {
  const colors = badgeColors[type]
  
  return (
    <Badge 
      className={`${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText} ${className}`}
    >
      {children || type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  )
}