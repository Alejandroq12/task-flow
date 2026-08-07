import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '@/lib/graphql-client'
import { UpdateTaskDocument } from '@/features/tasks/queries'
import { dueDateToIso } from '@/features/tasks/task-display'
import { TaskForm } from '@/features/tasks/TaskForm'
import { useNotify } from '@/components/ui/notifications-context'
import type { ApiTask } from '@/features/tasks/types'
import type { UpdateTaskInput } from '@/graphql/generated/graphql'

export function EditTaskModal({ task, onClose }: { task: ApiTask; onClose: () => void }) {
  const queryClient = useQueryClient()
  const notify = useNotify()

  const updateTask = useMutation({
    mutationFn: (input: UpdateTaskInput) => graphqlClient.request(UpdateTaskDocument, { input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
      notify('Task updated.', 'success')
      onClose()
    },
    onError: () => {
      notify('The task could not be updated.', 'error')
    },
  })

  return (
    <TaskForm
      ariaLabel="Edit task"
      submitLabel="Update"
      pendingLabel="Updating…"
      errorMessage="The task could not be updated. Check your connection and try again."
      showStatus
      showPosition
      initialValues={{
        name: task.name,
        estimate: task.pointEstimate,
        assigneeId: task.assignee?.id ?? null,
        tags: [...task.tags],
        dueDate: task.dueDate.slice(0, 10),
        status: task.status,
        position: String(task.position),
      }}
      isPending={updateTask.isPending}
      isError={updateTask.isError}
      onSubmit={(values) => {
        updateTask.mutate({
          id: task.id,
          name: values.name.trim(),
          pointEstimate: values.estimate,
          dueDate: dueDateToIso(values.dueDate),
          status: values.status,
          tags: values.tags,
          assigneeId: values.assigneeId,
          position: Number(values.position),
        })
      }}
      onClose={onClose}
    />
  )
}
