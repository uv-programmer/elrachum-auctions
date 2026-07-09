'use client'

import { useWorkingHours } from '@/hooks/useWorkingHours'

export default function DynamicHours({ className, style }) {
  const hours = useWorkingHours('scheduled pickup hours')
  return <span className={className} style={style}>{hours}</span>
}
