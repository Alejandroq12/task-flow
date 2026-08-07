export function QueryErrorAlert({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-4 rounded-lg bg-primary-4/10 p-4 text-body-m text-primary-4"
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded bg-primary-4 px-4 py-1 font-semibold text-neutral-1"
      >
        Try again
      </button>
    </div>
  )
}
