import { Skeleton } from '@/components/ui'

export const LoadingMessageItem = () => {
  return (
    <div className="flex items-start gap-4 rounded px-2 py-3">
      <Skeleton className="aspect-square size-10 cursor-pointer rounded-full object-cover" />
      <div className="flex-1 space-y-1">
        <h3 className="flex items-center gap-2 font-bold">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-32" />
        </h3>
        <div className="space-y-1">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    </div>
  )
}
