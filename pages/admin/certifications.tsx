import Toast from "@/components/Toast"
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material"
import Button from "@mui/material/Button"
import { GetServerSideProps, NextPage } from "next"
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { ToastProps } from "@/components/Toast"
import clientPromise from "@/lib/mongoConnection"
import { DB_NAME, PLACEHOLDER_ID, CERTIFICATIONS_COLLECTION, PLACEHOLDER_CERT, PLACEHOLDER_TOAST_MESSAGE } from "@/lib/constants"
import ExperiencesTimeline from '@/components/ExperiencesTimeline'
import { DeleteResult, ObjectId, UpdateResult } from "mongodb"
import AlertDialog from "@/components/AlertDialog"
import ChipArray from "@/components/ChipArray"
import ImageUploader from "@/components/ImageUploader"
import { CertificationCard } from "@/components/CertificationCard"
import { CertificationsArray } from "@/components/CertificationsArray"
import { CertificationsContainer } from "@/components/CertificationsContainer"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = await clientPromise
  const collection = client.db(DB_NAME).collection<Certification>(CERTIFICATIONS_COLLECTION)

  const results = await collection.find().toArray()

  let initialCerts: Certification[] = []
  if (results.length > 0) {
    initialCerts = results.map(({ _id, ...rest }) => {
      return {
        ...rest,
        id: _id.toString(),
      }
    })
  }

  initialCerts.push(PLACEHOLDER_CERT)

  return {
    props: { initialCerts }, // passed as props to component
  }
}

const EditCertifications: NextPage<{ initialCerts: Certification[] }> = ({ initialCerts }) => {
  const [certs, setCerts] = useState(initialCerts)
  const [selectedId, setSelectedId] = useState(certs.length > 1 ? certs[0].id as string : PLACEHOLDER_ID)
  const currentSelection = certs.find((c) => c.id === selectedId) || PLACEHOLDER_CERT

  const [toastMessage, setToastMessage] = useState<ToastMessage>(PLACEHOLDER_TOAST_MESSAGE)

  const [showDialog, setShowDialog] = useState(false)

  const handleDelete = async (selection: boolean) => {
    const deleteId = currentSelection.id
    if (!selection || deleteId === PLACEHOLDER_ID) return // cannot delete placeholder (meant to add)

    const res = await fetch(`/api/certifications/${deleteId}`, {
      method: 'DELETE'
    })
    const { data }: { data: DeleteResult } = await res.json()

    if (data.deletedCount === 1) { // update state
      const remaining = certs.filter((c) => c.id !== deleteId)
      setCerts(remaining)
      setSelectedId(remaining.length > 1 ? remaining[0].id as string : PLACEHOLDER_ID)
      setToastMessage({ alertMessage: "Deleted", alertTitle: "Delete success", autoHideDurationMs: 3000, severity: "success" })
    }
  }

  const handleUpdate = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentSelection.id === PLACEHOLDER_ID) { // If id == placeholder id , POST to create
      const res = await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSelection)
      })
      if (res.status !== 201) {
        setToastMessage({ alertMessage: "Failed", alertTitle: "Create failed", autoHideDurationMs: 3000, severity: "error" })
        return
      }

      // refresh the state with all certs from db + placeholder
      const response = await fetch('/api/certifications')
      const { data: updatedData }: { data: Certification[] } = await response.json()
      updatedData.push(PLACEHOLDER_CERT)
      setCerts(updatedData)
      setSelectedId(updatedData.length > 1 ? updatedData[0].id as string : PLACEHOLDER_ID)

      setToastMessage({ alertMessage: "Created", alertTitle: "Create success", autoHideDurationMs: 3000, severity: "success" })
      return
    }

    // else if selected ID is not placeholder ID, update 
    const res = await fetch(`/api/certifications/${currentSelection.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentSelection)
    })
    const { data }: { data: UpdateResult } = await res.json()
    // console.log(data)
    if (data.modifiedCount === 1) { // update state
      const updatedData = certs.map(
        (c) => c.id === currentSelection.id ? currentSelection : c) as Certification[]
      setCerts(updatedData)

      setToastMessage({ alertMessage: "Updated", alertTitle: "Update success", autoHideDurationMs: 3000, severity: "success" })
    }

  }

  const updateCerts = (searchId: string, propName: keyof Certification, value: unknown) => {
    const updatedData = certs.map((c) =>
      c.id === searchId ?
        { ...currentSelection, [propName]: value } :
        c)
    setCerts(updatedData)
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
      <CertificationsContainer certs={certs} />

      <hr />

      {/* Form to update */}
      <FormControl className='w-1/3'
        required>
        <InputLabel id="certs-select-label">Select Certification</InputLabel>
        <Select
          labelId="certs-select-label"
          value={currentSelection.id}
          label="Select Certification"
          onChange={(event: SelectChangeEvent) => {
            setSelectedId(event.target.value)
          }}
        >
          {certs.map((c) => {
            return (
              <MenuItem key={c.id}
                value={c.id}>{c.name}</MenuItem>
            )
          })}
        </Select>
      </FormControl>

      {/* Edit Name */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 ">
        <TextField value={currentSelection.name} label="Name"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateCerts(currentSelection.id as string, 'name', event.target.value)
          }} />
        {/* Edit organisation */}
        <TextField value={currentSelection.organisation} label="Organisation"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateCerts(currentSelection.id as string, 'organisation', event.target.value)
          }} />

        {/* Edit Issue Date */}
        <TextField value={currentSelection.issueDate} label="Issue Date (mmm yyyy)"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateCerts(currentSelection.id as string, 'issueDate', event.target.value)
          }}
        />
        {/* Edit course url */}
        <TextField value={currentSelection.courseUrl} label="Course URL"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateCerts(currentSelection.id as string, 'courseUrl', event.target.value)
          }} />
        
        {/* Edit thumbnail image url */}

        <div className='flex flex-row align-middle gap-2'>
          <TextField value={currentSelection.thumbnailUrl} label="Thumbnail URL"
            onInput={(event: ChangeEvent<HTMLInputElement>) => {
              updateCerts(currentSelection.id as string, 'thumbnailUrl', event.target.value)
            }} />
          <span className='my-auto mx-1'>or</span>
          {/* Upload image button */}
          <ImageUploader onUpload={(imageUrl) => {
            updateCerts(currentSelection.id as string, 'thumbnailUrl', imageUrl)
          }} />
        </div>

        {/* Edit credential url */}
        <TextField value={currentSelection.credentialUrl} label="Credential URL"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateCerts(currentSelection.id as string, 'credentialUrl', event.target.value)
          }} />
      </div>

      {/* Save button and delete button */}
      <div className='flex flex-row gap-4'>
        <Button variant="contained" className='bg-blue-500' type='submit' >Save</Button>
        <Button variant="contained" className='bg-red-500' type='button'
          onClick={() => setShowDialog(true)}
        >Delete</Button>
      </div>

      {showDialog ?
        <AlertDialog showDialog={showDialog}
          alertTitle="Confirm Delete Certification"
          alertMessage={`Are you sure you want to delete ${currentSelection.name}?`}
          onConfirm={(selection) => handleDelete(selection)}
          onClose={() => setShowDialog(false)}
        /> :
        null
      }
      
    </Box>


  )
}

export default EditCertifications