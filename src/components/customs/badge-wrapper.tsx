import { Badge } from "@/components/ui/badge"

export function BadgeWrapper() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        Blue
      </Badge>
    </div>
  )
}
