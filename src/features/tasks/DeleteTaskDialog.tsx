import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '@/lib/graphql-client'
import { DeleteTaskDocument } from '@/features/tasks/queries'
import { useNotify } from '@/components/ui/notifications-context'
import { useDialogFocus } from '@/components/ui/use-dialog-focus'
import type { ApiTask } from '@/features/tasks/types'

export function DeleteTaskDialog({ task, onClose }: { task: ApiTask; onClose: () => void }) {
  const queryClient = useQueryClient()
  const notify = useNotify()

  const deleteTask = useMutation({
    mutationFn: (input: { id: string }) => graphqlClient.request(DeleteTaskDocument, { input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
      notify('Task deleted.', 'success')
      onClose()
    },
    onError: () => {
      notify('The task could not be deleted.', 'error')
    },
  })

  const isPending = deleteTask.isPending

  const dismiss = () => {
    if (!isPending) onClose()
  }

  const { containerRef, trapFocus } = useDialogFocus(dismiss)

  return (
    <div
      ref={containerRef}
      onKeyDown={trapFocus}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={dismiss}
        className="absolute inset-0 bg-neutral-5/75"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Delete task"
        className="relative flex w-90 flex-col gap-6 bg-neutral-3 p-6 shadow-depth-4"
      >
        <p className="w-full text-body-m text-neutral-1">Delete Task?</p>
        {deleteTask.isError && (
          <div
            role="alert"
            className="w-full rounded bg-primary-4/10 px-4 py-2 text-body-m text-primary-4"
          >
            The task could not be deleted. Check your connection and try again.
          </div>
        )}
        <div className="flex items-center justify-end">
          <button
            autoFocus
            type="button"
            onClick={dismiss}
            className="rounded-full px-4 py-2 text-body-s leading-5 font-bold text-neutral-1"
          >
            Go back
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              deleteTask.mutate({ id: task.id })
            }}
            className="rounded-full px-4 py-2 text-body-s leading-5 font-bold text-neutral-1 disabled:text-neutral-2"
          >
            {isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
