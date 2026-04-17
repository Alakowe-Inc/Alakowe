import { Check } from 'lucide-react'
import type { OrderStatus } from '../data/dashboardMockData'

interface Props {
  statuses: OrderStatus[]
  current: OrderStatus
  labels: Record<OrderStatus, string>
}

function OrderTimeline({ statuses, current, labels }: Props) {
  const currentIdx = statuses.indexOf(current)

  return (
    <div className="flex flex-col">
      {statuses.map((status, idx) => {
        const isDone = idx < currentIdx
        const isActive = idx === currentIdx
        const isLast = idx === statuses.length - 1

        return (
          <div key={status} className="flex items-start gap-4">
            {/* Dot + line column */}
            <div className="flex flex-col items-center shrink-0" style={{ width: 20 }}>
              {/* Dot */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                  isDone
                    ? 'bg-secondary shadow-sm'
                    : isActive
                    ? 'bg-secondary ring-4 ring-secondary/20'
                    : 'bg-white border-2 border-main/12'
                }`}
              >
                {isDone && (
                  <Check size={10} strokeWidth={3} className="text-white" />
                )}
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              {/* Connecting line */}
              {!isLast && (
                <div
                  className={`w-px flex-1 min-h-7 mt-1 mb-1 rounded-full ${
                    isDone ? 'bg-secondary/30' : 'bg-main/8'
                  }`}
                />
              )}
            </div>

            {/* Label */}
            <p
              className={`text-sm pb-6 leading-snug transition-colors ${
                isDone
                  ? 'text-main/35'
                  : isActive
                  ? 'text-main font-semibold'
                  : 'text-main/22'
              } ${isLast ? 'pb-0' : ''}`}
            >
              {labels[status]}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default OrderTimeline
