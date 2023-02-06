import Toast from "@/components/Toast"
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import Button from "@mui/material/Button"
import { GetServerSideProps, NextPage } from "next"
import { ChangeEvent, useState } from "react"
import clientPromise from "@/lib/mongoConnection"
import { DB_NAME, PLACEHOLDER_PROJECT, PLACEHOLDER_ID, PROJECTS_COLLECTION, PLACEHOLDER_TOAST_MESSAGE } from "@/lib/constants"
import ProjectsCarousel from "@/components/ProjectsCarousel"
import { DeleteResult, UpdateResult } from "mongodb"
import AlertDialog from "@/components/AlertDialog"
import ChipArray from "@/components/ChipArray"
import ImageUploader from "@/components/ImageUploader"

// get all projects and update
export const getServerSideProps: GetServerSideProps = async (context) => {
  // console.log(context.req.cookies.USER_TOKEN)
  const client = await clientPromise
  const projectsCollection = client.db(DB_NAME).collection<Project>(PROJECTS_COLLECTION)

  const allProjectsDb = await projectsCollection.find().toArray()

  let initialProjects: Project[] = []
  if (allProjectsDb.length > 0) {
    initialProjects = allProjectsDb.map(({ _id, ...rest }) => {
      return {
        ...rest,
        id: _id.toString(),
      }
    })
  }

  // add a dummy project with all placeholder fields for adding a new project
  initialProjects.push(PLACEHOLDER_PROJECT)

  return {
    props: { initialProjects }, // passed as props to component
  }
}

const EditProjects: NextPage<{ initialProjects: Project[] }> = ({ initialProjects }) => {
  const [projects, setProjects] = useState(initialProjects)
  const [selectedId, setSelectedId] = useState(projects.length > 1 ? projects[0].id as string : PLACEHOLDER_ID)
  const currentProject = projects.find((project) => project.id === selectedId) || PLACEHOLDER_PROJECT

  const [selectedTech, setSelectedTech] = useState<"feTechnologies" | "beTechnologies" | "dbTechnologies" | "otherTechnologies">("feTechnologies")
  const currentTech = currentProject[selectedTech]

  const [newTechnology, setNewTechnology] = useState('')

  const [showDialog, setShowDialog] = useState(false)

  const [toastMessage, setToastMessage] = useState<ToastMessage>(PLACEHOLDER_TOAST_MESSAGE)

  const handleDelete = async (selection: boolean) => {
    const deleteId = currentProject.id
    if (!selection || deleteId === PLACEHOLDER_ID) return // cannot delete placeholder (meant to add new project)

    const res = await fetch(`/api/projects/${deleteId}`, {
      method: 'DELETE'
    })
    const { data }: { data: DeleteResult } = await res.json()

    if (data.deletedCount === 1) { // update state
      const remainingProjects = projects.filter((project) => project.id !== deleteId)
      setProjects(remainingProjects)
      setSelectedId(remainingProjects.length > 1 ? remainingProjects[0].id as string : PLACEHOLDER_ID)

      setToastMessage({ alertMessage: "Project deleted", alertTitle: "Delete success", autoHideDurationMs: 3000, severity: "success" })
    }
  }

  const handleUpdate = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentProject.id === PLACEHOLDER_ID) { // If id == placeholder id , POST to create new project
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProject)
      })
      if (res.status !== 201) {
        setToastMessage({ alertMessage: "Add project failed", alertTitle: "Create failed", autoHideDurationMs: 3000, severity: "error" })
        return
      }

      // refresh the state with all projects from db + placeholder
      const projectsDbRes = await fetch('/api/projects')
      const { data: projectsDb }: { data: Project[] } = await projectsDbRes.json()
      projectsDb.push(PLACEHOLDER_PROJECT)
      setProjects(projectsDb)
      setSelectedId(projectsDb.length > 1 ? projectsDb[0].id as string : PLACEHOLDER_ID)

      setToastMessage({ alertMessage: "Project created", alertTitle: "Create success", autoHideDurationMs: 3000, severity: "success" })
      return
    }

    // else if selected ID is not placeholder ID, update selected project
    const res = await fetch(`/api/projects/${currentProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentProject)
    })
    const { data }: { data: UpdateResult } = await res.json()
    // console.log(data)
    if (data.modifiedCount === 1) { // update state
      const updatedProjects = projects.map(
        (project) => project.id === currentProject.id ? currentProject : project) as Project[]
      setProjects(updatedProjects)

      setToastMessage({ alertMessage: "Project updated", alertTitle: "Update success", autoHideDurationMs: 3000, severity: "success" })
    }

  }

  const updateProject = (searchId: string, propName: keyof Project, value: unknown) => {
    const updatedProjects = projects.map((project) =>
      project.id === searchId ? { ...currentProject, [propName]: value } :
        project)
    setProjects(updatedProjects)
  }

  return (
    <>
      {toastMessage.alertMessage !== '' ?
        <Toast alertMessage={toastMessage.alertMessage} alertTitle={toastMessage.alertTitle} autoHideDurationMs={toastMessage.autoHideDurationMs} severity={toastMessage.severity}
          onClose={() => setToastMessage(PLACEHOLDER_TOAST_MESSAGE)}
        /> :
        null}

      <hr />

      {/* Render component locally to see immediate changes */}
      <ProjectsCarousel projects={[currentProject]} autoPlay={false} />
      <Box
        component="form"
        className='flex flex-col place-items-center gap-6 min-h-screen mt-8'
        onSubmit={handleUpdate}
      >
        {/* Form to update */}
        <FormControl className='w-1/3'
          required>
          <InputLabel id="projects-select-label">Select Project</InputLabel>
          <Select
            labelId="projects-select-label"
            value={currentProject.id}
            label="Select Project"
            onChange={(event: SelectChangeEvent) => {
              setSelectedId(event.target.value)
            }}
          >
            {projects.map((project) => {
              return (
                <MenuItem key={project.id}
                  value={project.id}>{project.name}</MenuItem>
              )
            })}
          </Select>
        </FormControl>

        {/* Edit Project name and URL */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 w-2/3">

          <div className='grid gap-4'>
            <TextField value={currentProject.name} label="name" onChange={(event: ChangeEvent<HTMLInputElement>) => {
              updateProject(currentProject.id as string, 'name', event.target.value)
            }} />

            <TextField value={currentProject.url} label="URL"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                updateProject(currentProject.id as string, 'url', event.target.value)
              }} />
          </div>

          {/* Edit description */}
          <TextField value={currentProject.description} label="description"
            multiline
            rows={5}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              updateProject(currentProject.id as string, 'description', event.target.value)
            }}
          />

          {/* Edit start date */}
          <TextField value={currentProject.startDate} label="Start Date"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              updateProject(currentProject.id as string, 'startDate', event.target.value)
            }} />

          {/* Edit end date */}
          <TextField value={currentProject.endDate} label="End Date"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              updateProject(currentProject.id as string, 'endDate', event.target.value)
            }} />
        </div>

        {/* Edit Technologies */}
        <div className='grid grid-cols-1 sm:grid-flow-col gap-4'>

          <ChipArray className='bg-white h-fit my-auto rounded-lg w-fit m-1 p-1'
            chipLabels={currentTech}
            onDelete={(updatedChipLabels) => {
              updateProject(currentProject.id as string, selectedTech, updatedChipLabels)
            }}
          />

          <div className='flex flex-col gap-4'>
            <Select
              className=''
              value={selectedTech}
              label="Select Technologies"
              onChange={(event: SelectChangeEvent) => {
                setSelectedTech(event.target.value as 'feTechnologies' | 'beTechnologies' | 'dbTechnologies' | 'otherTechnologies')
              }}
            >
              <MenuItem key={0}
                value="feTechnologies">Front end technologies</MenuItem>
              <MenuItem key={1}
                value="beTechnologies">Back end technologies</MenuItem>
              <MenuItem key={2}
                value="dbTechnologies">Database technologies</MenuItem>
              <MenuItem key={3}
                value="otherTechnologies">Other technologies</MenuItem>

            </Select>

            <TextField
              label='Add Technology'
              value={newTechnology}
              onChange={(event) => setNewTechnology(event.target.value)}
            />
            <Button
              variant='contained'
              className='bg-blue-500'
              type='button'
              onClick={() => {
                updateProject(currentProject.id as string, selectedTech, [...currentProject[selectedTech], newTechnology])
                setNewTechnology('')
              }}
            >Add Technology
            </Button>
          </div>

        </div>

        {/* Edit Image url */}
        <div className='flex flex-row align-middle gap-2'>
          <TextField
            value={currentProject.thumbnailUrl} label="Thumbnail URL"
            onInput={(event: ChangeEvent<HTMLInputElement>) => {
              updateProject(currentProject.id as string, 'thumbnailUrl', event.target.value)
            }} />
          <span className='my-auto'>or</span>
          {/* Upload image button */}
          <ImageUploader onUpload={(imageUrl) => {
            updateProject(currentProject.id as string, 'thumbnailUrl', imageUrl)
          }} />
        </div>

        {/* Save button and cancel button */}
        <div className='flex flex-row gap-4'>
          <Button variant="contained" className='bg-blue-500' type='submit' >Save</Button>
          <Button variant="contained" className='bg-red-500' type='button'
            onClick={() => setShowDialog(true)}
          >Delete</Button>
        </div>

        {showDialog ?
          <AlertDialog showDialog={showDialog}
            alertTitle="Confirm Delete Project"
            alertMessage={`Are you sure you want to delete ${currentProject.name}?`}
            onConfirm={(selection) => handleDelete(selection)}
            onClose={() => setShowDialog(false)}
          /> :
          null
        }
      </Box>

    </>
  )
}

export default EditProjects