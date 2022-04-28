import { useState } from 'react'
import { useForm } from '@mantine/hooks'
import { Modal, Button, Group, TextInput, Textarea, Space } from '@mantine/core'
import { ENDPOINT, TODO } from '../App'
import { KeyedMutator } from 'swr'

function AddTodo({ mutate }: { mutate: KeyedMutator<TODO[]> }) {
  const [open, setOpen] = useState(false)

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
    },
  })

  async function CreateTodo(values: { title: string; description: string }) {
    const updated = await fetch(`${ENDPOINT}/api/todo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }).then((r) => r.json())
    mutate(updated)
    form.reset()
    setOpen(false)
  }

  return (
    <>
      <Modal opened={open} onClose={() => setOpen(false)} title="Create Todo">
        <form onSubmit={form.onSubmit(CreateTodo)}>
          <TextInput
            placeholder="Enter title"
            label="Title"
            required
            {...form.getInputProps('title')}
          />
          <Space h="md" />
          <Textarea
            placeholder="Enter description"
            label="Description"
            required
            {...form.getInputProps('description')}
          />
          <Space h="md" />
          <Group position="right">
            <Button type="submit">Create Todo</Button>
          </Group>
        </form>
      </Modal>
      <Group position="center">
        <Button onClick={() => setOpen(true)}>Add Todo</Button>
      </Group>
    </>
  )
}

export default AddTodo
