import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import Typography from "@mui/material/Typography"

export function CertificationCard({ cert }: { cert: Certification }) {

  return (
    <Card className='flex flex-row w-5/6 sm:w-4/6 md:w-3/6 lg:w-2/6 xl:w-2/6 h-32 drop-shadow-sm'>
      <CardActionArea className='w-1/3 h-auto'
        href={cert.courseUrl}>
        <img className='object-cover h-full w-full'
          src={cert.thumbnailUrl} alt="Certification URL" />
      </CardActionArea>

      <CardActionArea className="w-2/3"
        href={cert.credentialUrl}
      >
        <CardContent className='w-auto'>
          <Typography variant='subtitle1' className='text-sm '>
            {cert.name}
          </Typography>

          <Typography variant="subtitle2" className='text-xs'>
            {cert.organisation}
          </Typography>

          <Typography variant="caption">
            Issued: {cert.issueDate}
          </Typography>
        </CardContent>
      </CardActionArea>

    </Card>
  )
}
