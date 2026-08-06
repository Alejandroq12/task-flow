import { graphql } from '@/graphql/generated'

export const TasksDocument = graphql(`
  query Tasks($input: FilterTaskInput!) {
    tasks(input: $input) {
      id
      name
      dueDate
      pointEstimate
      position
      status
      tags
      assignee {
        id
        fullName
        avatar
      }
    }
  }
`)
