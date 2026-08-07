import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '@/lib/graphql-client'
import { CreateTaskDocument } from '@/features/tasks/queries'
import { dueDateToIso } from '@/features/tasks/task-display'
import { TaskForm } from '@/features/tasks/TaskForm'
import { useNotify } from '@/components/ui/notifications-context'
import type { CreateTaskInput } from '@/graphql/generated/graphql'

export function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const notify = useNotify()

  const createTask = useMutation({
    mutationFn: (input: CreateTaskInput) => graphqlClient.request(CreateTaskDocument, { input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
      notify('Task created.', 'success')
      onClose()
    },
    onError: () => {
      notify('The task could not be created.', 'error')
    },
  })

  return (
    <TaskForm
      ariaLabel="Create task"
      submitLabel="Create"
      pendingLabel="Creating…"
      errorMessage="The task could not be created. Check your connection and try again."
      initialValues={{
        name: '',
        estimate: null,
        assigneeId: null,
        tags: [],
        dueDate: '',
        status: 'BACKLOG',
        position: '',
      }}
      isPending={createTask.isPending}
      isError={createTask.isError}
      onSubmit={(values) => {
        createTask.mutate({
          name: values.name.trim(),
          pointEstimate: values.estimate,
          dueDate: dueDateToIso(values.dueDate),
          status: values.status,
          tags: values.tags,
          assigneeId: values.assigneeId,
        })
      }}
      onClose={onClose}
    />
  )
}
