import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '@/lib/graphql-client'
import { CreateTaskDocument } from '@/features/tasks/queries'
import { dueDateToIso } from '@/features/tasks/task-display'
import { TaskForm } from '@/features/tasks/TaskForm'
import { useNotify } from '@/components/ui/notifications-context'
import type { CreateTaskInput } from '@/graphql/generated/graphql'

function scrollToTask(id: string, attempts = 10) {
  const card = document.querySelector(`[data-task-id="${id}"]`)
  if (card !== null) {
    card.scrollIntoView({ block: 'center' })
    return
  }
  if (attempts > 0) {
    setTimeout(() => {
      scrollToTask(id, attempts - 1)
    }, 100)
  }
}

export function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const notify = useNotify()

  const createTask = useMutation({
    mutationFn: (input: CreateTaskInput) => graphqlClient.request(CreateTaskDocument, { input }),
    onSuccess: (data) => {
      notify('Task created.', 'success')
      onClose()
      void queryClient.invalidateQueries({ queryKey: ['tasks'] }).then(() => {
        scrollToTask(data.createTask.id)
      })
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
