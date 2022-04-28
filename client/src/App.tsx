import { ActionIcon, Box, Group, List, Stack, Text } from '@mantine/core'
import useSWR from 'swr'
import { CircleCheck, CircleDashed, Trash } from 'tabler-icons-react'
import './App.css'
import AddTodo from './Components/AddTodo'

export const ENDPOINT = 'http://localhost:4000'

export interface TODO {
  id: number
  title: string
  description: string
  done: boolean
}

const fetcher = (url: string) =>
  fetch(`${ENDPOINT}/${url}`).then((r) => r.json())

function App() {
  const { data, mutate } = useSWR<TODO[]>(`api/todos`, fetcher)

  async function markTodoDone(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todo/done/${id}`, {
      method: 'PATCH',
    }).then((r) => r.json())
    mutate(updated)
  }

  async function deleteTodo(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todo/${id}`, {
      method: 'DELETE',
    }).then((r) => r.json())
    mutate(updated)
  }

  return (
    <Box
      sx={(theme) => ({
        padding: '2rem',
        width: '100%',
        maxWidth: '40rem',
        margin: '0 auto',
        textAlign: 'center',
      })}
    >
      <AddTodo mutate={mutate} />
      {data && data.length > 0 ? (
        <List spacing="xs" size="sm" mt="lg" center>
          {data?.map((todo) => {
            return (
              <List.Item
                onClick={() => markTodoDone(todo.id)}
                key={`todo__${todo.id}`}
                icon={todo.done ? <CircleCheck /> : <CircleDashed />}
              >
                <Group>
                  <Stack align="flex-start" spacing={0}>
                    <Text size="md" weight={700}>
                      {todo.title}
                    </Text>
                    <Text size="md"> {todo.description}</Text>
                  </Stack>
                  <ActionIcon onClick={() => deleteTodo(todo.id)}>
                    <Trash />
                  </ActionIcon>
                </Group>
              </List.Item>
            )
          })}
        </List>
      ) : (
        <Text mt="lg">Todo list is empty. Add something</Text>
      )}
    </Box>
  )
}

export default App
