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

export const CreateTaskDocument = graphql(`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
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

export const UsersDocument = graphql(`
  query Users {
    users {
      id
      fullName
      avatar
    }
  }
`)
