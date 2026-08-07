import { graphql } from '@/graphql/generated'

export const TasksDocument = graphql(`
  query Tasks($input: FilterTaskInput!) {
    tasks(input: $input) {
      id
      name
      dueDate
      pointEstimate
      position
      createdAt
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

export const UpdateTaskDocument = graphql(`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
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

export const DeleteTaskDocument = graphql(`
  mutation DeleteTask($input: DeleteTaskInput!) {
    deleteTask(input: $input) {
      id
    }
  }
`)

export const ProfileDocument = graphql(`
  query Profile {
    profile {
      id
      fullName
      email
      type
      avatar
      createdAt
      updatedAt
    }
  }
`)
