import Toast from "@/components/Toast"
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import Button from "@mui/material/Button"
import { GetServerSideProps, NextPage } from "next"
import { ChangeEvent, useState } from "react"
import clientPromise from "@/lib/mongoConnection"
import { DB_NAME, PLACEHOLDER_ID, EXPERIENCES_COLLECTION, PLACEHOLDER_EXPERIENCE, PLACEHOLDER_TOAST_MESSAGE } from "@/lib/constants"
import ExperiencesTimeline from '@/components/ExperiencesTimeline'
import { DeleteResult, UpdateResult } from "mongodb"
import AlertDialog from "@/components/AlertDialog"

// get all exp and update
export const getServerSideProps: GetServerSideProps = async (context) => {
  // console.log(context.req.cookies.USER_TOKEN)
  const client = await clientPromise
  const collection = client.db(DB_NAME).collection<Experience>(EXPERIENCES_COLLECTION)

  const allExpDb = await collection.find().toArray()

  let initialExp: Experience[] = []
  if (allExpDb.length > 0) {
    initialExp = allExpDb.map(({ _id, ...rest }) => {
      return {
        ...rest,
        id: _id.toString(),
      }
    })
  }

  initialExp.push(PLACEHOLDER_EXPERIENCE)

  return {
    props: { initialExp }, // passed as props to component
  }
}

const EditExperiences: NextPage<{ initialExp: Experience[] }> = ({ initialExp }) => {
  const [exp, setExp] = useState(initialExp)
  const [selectedId, setSelectedId] = useState(exp.length > 1 ? exp[0].id as string : PLACEHOLDER_ID)
  const currentExp = exp.find((ex) => ex.id === selectedId) || PLACEHOLDER_EXPERIENCE

  const [showDialog, setShowDialog] = useState(false)

  // Toast
  const [toastMessage, setToastMessage] = useState<ToastMessage>(PLACEHOLDER_TOAST_MESSAGE)

  const handleDelete = async (selection: boolean) => {
    const deleteId = currentExp.id
    if (!selection || deleteId === PLACEHOLDER_ID) return // cannot delete placeholder (meant to add)

    const res = await fetch(`/api/experiences/${deleteId}`, {
      method: 'DELETE'
    })
    const { data }: { data: DeleteResult } = await res.json()

    if (data.deletedCount === 1) { // update state
      const remaining = exp.filter((ex) => ex.id !== deleteId)
      setExp(remaining)
      setSelectedId(remaining.length > 1 ? remaining[0].id as string : PLACEHOLDER_ID)

      setToastMessage({ alertMessage: "Deleted", alertTitle: "Delete success", autoHideDurationMs: 3000, severity: "success" })
    }
  }

  const handleUpdate = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentExp.id === PLACEHOLDER_ID) { // If id == placeholder id , POST to create
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentExp)
      })
      if (res.status !== 201) {
        setToastMessage({ alertMessage: "Failed", alertTitle: "Create failed", autoHideDurationMs: 3000, severity: "error" })
        return
      }

      // refresh the state with all exp from db + placeholder
      const response = await fetch('/api/experiences')
      const { data: updatedExp }: { data: Experience[] } = await response.json()
      updatedExp.push(PLACEHOLDER_EXPERIENCE)
      setExp(updatedExp)
      setSelectedId(updatedExp.length > 1 ? updatedExp[0].id as string : PLACEHOLDER_ID)

      setToastMessage({ alertMessage: "Created", alertTitle: "Create success", autoHideDurationMs: 3000, severity: "success" })
      return
    }

    // else if selected ID is not placeholder ID, update 
    const res = await fetch(`/api/experiences/${currentExp.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentExp)
    })
    const { data }: { data: UpdateResult } = await res.json()
    // console.log(data)
    if (data.modifiedCount === 1) { // update state
      const updatedExp = exp.map(
        (ex) => ex.id === currentExp.id ? currentExp : ex) as Experience[]
      setExp(updatedExp)

      setToastMessage({ alertMessage: "Updated", alertTitle: "Update success", autoHideDurationMs: 3000, severity: "success" })
    }

  }

  const updateExp = (searchId: string, propName: keyof Experience, value: unknown) => {
    const updatedExp = exp.map((ex) =>
      ex.id === currentExp.id ?
        { ...currentExp, [propName]: value } :
        ex)
    setExp(updatedExp)
  }

  return (
    <Box
      component="form"
      className='flex flex-col place-items-center gap-6 min-h-screen'
      onSubmit={handleUpdate}
    >
      {toastMessage.alertMessage !== '' ?
        <Toast {...toastMessage} onClose={(event, reason) => setToastMessage(PLACEHOLDER_TOAST_MESSAGE)} /> :
        null}

      {/* Render component locally to see immediate changes */}
      <ExperiencesTimeline experiences={exp} />

      {/* Form to update */}
      <FormControl className='w-1/3'
        required>
        <InputLabel id="exp-select-label">Select Experience</InputLabel>
        <Select
          labelId="exp-select-label"
          value={currentExp.id}
          label="Select Experience"
          onChange={(event: SelectChangeEvent) => {
            setSelectedId(event.target.value)
          }}
        >
          {exp.map((ex) => {
            return (
              <MenuItem key={ex.id}
                value={ex.id}>{ex.role}</MenuItem>
            )
          })}
        </Select>
      </FormControl>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 w-1/3">
        {/* Edit Start Date */}
        <TextField value={currentExp.startDate} label="Start Date (mmm yyyy)"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateExp(currentExp.id as string, 'startDate', event.target.value)
          }} />

        {/* Edit End Date */}
        <TextField value={currentExp.endDate} label="End Date (mmm yyyy)"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateExp(currentExp.id as string, 'endDate', event.target.value)
          }}
        />

        {/* Edit role */}
        <TextField value={currentExp.role} label="Role"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateExp(currentExp.id as string, 'role', event.target.value)
          }} />

        {/* Edit organisation */}
        <TextField value={currentExp.organisation} label="Organisation"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateExp(currentExp.id as string, 'organisation', event.target.value)
          }} />
      </div>

      {/* Edit Description */}
      <TextField className='w-1/3'
        value={currentExp.description} label="Description"
        multiline
        rows={5}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          updateExp(currentExp.id as string, 'description', event.target.value)
        }} />

      {/* Save button and cancel button */}
      <div className='flex flex-row gap-4'>
        <Button variant="contained" className='bg-blue-500' type='submit' >Save</Button>
        <Button variant="contained" className='bg-red-500' type='button'
          onClick={() => setShowDialog(true)}
        >Delete</Button>
      </div>

      {showDialog ?
        <AlertDialog showDialog={showDialog}
          alertTitle="Confirm Delete Experience"
          alertMessage={`Are you sure you want to delete ${currentExp.role}?`}
          onConfirm={(selection) => handleDelete(selection)}
          onClose={() => setShowDialog(false)}
        /> :
        null
      }
    </Box>


  )
}

export default EditExperiences