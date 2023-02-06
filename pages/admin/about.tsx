import About from "@/components/About"
import Toast from "@/components/Toast"
import { Box, OutlinedInput } from "@mui/material"
import Button from "@mui/material/Button"
import { GetServerSideProps, NextPage } from "next"
import { ChangeEvent, useState } from "react"
import clientPromise from "@/lib/mongoConnection"
import { ABOUT_COLLECTION, DB_NAME, PLACEHOLDER_ABOUT, PLACEHOLDER_ID, PLACEHOLDER_TOAST_MESSAGE } from "@/lib/constants"
import { InsertOneResult } from "mongodb"
import ImageUploader from "@/components/ImageUploader"
import TextField from "@mui/material/TextField"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = await clientPromise
  const collection = client.db(DB_NAME).collection<About>(ABOUT_COLLECTION)

  const res = await collection.findOne({})

  let aboutDb: About
  if (res === null) {
    aboutDb = PLACEHOLDER_ABOUT
  } else {
    const { _id, ...rest } = res
    aboutDb = { ...rest, id: _id.toString() }
  }
  return {
    props: { aboutDb }, // passed as props to component
  }
}

interface Props {
  aboutDb: About
}

const EditAbout: NextPage<Props> = ({ aboutDb }) => {
  const [about, setAbout] = useState(aboutDb)
  const [newInfo, setNewInfo] = useState('')
  const [newInterest, setNewInterest] = useState('')

  const [toastMessage, setToastMessage] = useState<ToastMessage>(PLACEHOLDER_TOAST_MESSAGE)

  const updateAbout = (propName: keyof About, value: unknown) => {
    setAbout({ ...about, [propName]: value })
  }

  return (
    <>
      {
        toastMessage.alertMessage !== '' ?
          <Toast {...toastMessage} onClose={(event, reason) => setToastMessage(PLACEHOLDER_TOAST_MESSAGE)} /> :
          null
      }

      {/* Render about component locally to see immediate changes */}
      <About
        avatarUrl={about.avatarUrl}
        githubUrl={about.githubUrl}
        linkedInUrl={about.linkedInUrl}
        name={about.name}
        info={about.info}
        interests={about.interests}
      />

      <hr className="mb-8" />

      <Box
        component="form"
        className='flex flex-col place-items-center gap-6 min-h-screen'
        onSubmit={async (event: ChangeEvent<HTMLFormElement>) => {
          try {
            event.preventDefault()
            // POST if id is not present (first time adding about)
            if (about.id === PLACEHOLDER_ID) {
              const res = await fetch('/api/about', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(about)
              })
              
              const updatedRes = await fetch('/api/about')
              if (updatedRes.status !== 200) {
                setToastMessage({
                  alertMessage: 'Error fetching updated About page',
                  alertTitle: 'Error',
                  autoHideDurationMs: 3000,
                  severity: 'error'
                })
                return
              }
              
              const { data }: { data: About } = await updatedRes.json()
              setAbout(data)

              setToastMessage({
                alertMessage: 'Added a new About document',
                alertTitle: 'Success',
                autoHideDurationMs: 3000,
                severity: 'success'
              })
              return
            }

            // PUT if id is present (updating about)
            const res = await fetch('/api/about', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(about)
            })

            const { data } = await res.json()
            const { modifiedCount, upsertedCount } = data
            if (modifiedCount === 1) {
              // render a toast
              setToastMessage({
                alertMessage: 'Successfully updated About page',
                alertTitle: 'Success',
                autoHideDurationMs: 3000,
                severity: 'success'
              })

            } else {
              setToastMessage({
                alertMessage: 'No changes made',
                alertTitle: 'Warning',
                autoHideDurationMs: 3000,
                severity: 'warning'
              })
            }

          } catch (error) {
            setToastMessage({
              alertMessage: 'Failed to update About page' + error,
              alertTitle: 'Error',
              autoHideDurationMs: 3000,
              severity: 'error'
            })
          }

        }}
      >
        {/* Form to update About component */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 w-1/2 sm:w-2/3'>
          <TextField label="Name" required
            value={about.name}
            onChange={(event) => updateAbout('name', event.target.value)}
          />
          <div className='flex flex-row'>
            <TextField label="Avatar URL" required
              value={about.avatarUrl}
              onChange={(event) => updateAbout('avatarUrl', event.target.value)}
            />
            <span className='my-auto m-4'>or</span>
            <ImageUploader onUpload={(imageUrl) => updateAbout('avatarUrl', imageUrl)} />
          </div>
          <TextField label="LinkedIn URL" required
            value={about.linkedInUrl}
            onChange={(event) => updateAbout('linkedInUrl', event.target.value)}
          />
          <TextField label="Github URL" required
            value={about.githubUrl}
            onChange={(event) => updateAbout('githubUrl', event.target.value)}
          />
        </div>


        {/* Update Info */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 w-1/2 sm:w-2/3'>
          <div className="flex flex-col space-y-4">
            <h3 className='font-bold text-lg'>Information</h3>
            {about.info.map((info, index) => {
              return (
                <div className='flex flex-row gap-4 items-center'
                  key={index}>
                  <OutlinedInput
                    value={info}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const updatedInfo = about.info.map((inf, i) => {
                        if (i === index) {
                          return event.target.value
                        }
                        return inf
                      })
                      updateAbout('info', updatedInfo)
                    }}
                  />
                  <Button variant="contained" className='bg-red-500' type='button'
                    onClick={() => {
                      const updatedInfo = about.info.filter((_, i) => index !== i)
                      updateAbout('info', updatedInfo)
                    }}>Delete</Button>
                </div>
              )
            })}

            {/* Add new info */}
            <div className="flex flex-row gap-4 items-center">
              <OutlinedInput
                placeholder="Add new Info"
                value={newInfo}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setNewInfo(event.target.value)}
              />
              <Button variant="contained" className='bg-blue-500' type='button'
                onClick={() => {
                  updateAbout('info', [...about.info, newInfo])
                  setNewInfo('')
                }}
              >Add</Button>
            </div>
          </div>

          {/* Update interests */}
          <div className='flex flex-col space-y-4'>
            <h3 className='font-bold text-lg'>Interests</h3>
            {about.interests.map((interest, index) => {
              return (
                <div className='flex flex-row gap-4 items-center'
                  key={index}>
                  <OutlinedInput
                    value={interest}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const updatedInterests = about.interests.map((int, i) => {
                        if (i === index) {
                          return event.target.value
                        }
                        return int
                      })
                      updateAbout('interests', updatedInterests)
                    }}
                  />

                  <Button variant="contained" className='bg-red-500' type='button'
                    onClick={() => {
                      const updatedInterests = about.interests.filter((_, i) => index !== i)
                      updateAbout('interests', updatedInterests)
                    }}>Delete</Button>
                </div>
              )
            })}

            {/* Add new interest */}
            <div className="flex flex-row gap-4 items-center">
              <OutlinedInput
                placeholder="Add new Interest"
                value={newInterest}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setNewInterest(event.target.value)}
              />

              <Button variant="contained" className='bg-blue-500' type='button'
                onClick={() => {
                  updateAbout('interests', [...about.interests, newInterest])
                  setNewInterest('')
                }}
              >Add</Button>
            </div>
          </div>

        </div>

        {/* Save button */}
        <Button variant="contained" className='bg-blue-500' type='submit' >Save</Button>
      </Box>
      )
      
    </>
  )
}

export default EditAbout