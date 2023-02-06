import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Carousel from 'react-material-ui-carousel'
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip'

interface Props {
  projects: Project[]
  autoPlay: boolean
}

export default function ProjectsCarousel({ projects, autoPlay }: Props) {

  return (
    <div className='w-auto min-h-fit flex flex-col space-y-2 items-center justify-center py-8 bg-slate-300'
      id="projects">
      <p className='text-2xl mb-2 font-medium'>School Projects</p>
      <Carousel className='w-4/6 h-fit' autoPlay={autoPlay} >
        {projects.map(({ id, name, description, startDate, endDate, thumbnailUrl, url, feTechnologies, beTechnologies, dbTechnologies, otherTechnologies }) => {
          return (
            <ProjectCard key={id ?? 0}
              name={name} description={description}
              startDate={startDate} endDate={endDate}
              thumbnailUrl={thumbnailUrl}
              url={url}
              feTechnologies={feTechnologies}
              beTechnologies={beTechnologies}
              dbTechnologies={dbTechnologies}
              otherTechnologies={otherTechnologies}
            />
          )
        })}
      </Carousel>
    </div>
  )
}

export function ProjectCard({ name, description, startDate, endDate, thumbnailUrl, url, feTechnologies, beTechnologies, dbTechnologies, otherTechnologies }: Project) {

  return (
    <Card className='flex flex-row h-auto'>
      <CardContent className='w-100 sm:w-3/5'>
        <Typography variant="h5">
          {name}
        </Typography>

        <Typography variant="caption">
          {startDate} - {endDate}
        </Typography>

        <Typography variant="subtitle2">
          {description}
        </Typography>

        <Typography variant="caption">
          URL: <Link href={url} target='_blank' rel='noopener'>{url}</Link>
        </Typography>
        <hr className='my-2' />
        <div >
          {feTechnologies?.map((t, index) => {
            return (
              <Chip key={index}
                label={t} color='error' size='small' className='m-1' />
            )
          })}
          {beTechnologies?.map((t, index) => {
            return (
              <Chip key={index}
                label={t} color='success' size='small' className='m-1' />
            )
          })}
          {dbTechnologies?.map((t, index) => {
            return (
              <Chip key={index}
                label={t} color='info' size='small' className='m-1' />
            )
          })}
          {otherTechnologies?.map((t, index) => {
            return (
              <Chip key={index}
                label={t} color='warning' size='small' className='m-1' />
            )
          })}
        </div>
      </CardContent>

      <CardActionArea className='w-0 sm:w-2/5 '
        href={url !== undefined ? url : ''}>
        <img className='object-fill h-full w-full'
          src={thumbnailUrl} alt="Project thumbnail URL" />
      </CardActionArea>
    </Card>
  )
}

