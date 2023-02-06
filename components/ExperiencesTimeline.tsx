import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';

export default function CustomizedTimeline({ experiences }: { experiences: Experience[] }) {
  // sort the experiences by start date, then end date
  const sortedExp = experiences.map((exp) => {
    return {
      ...exp,
      transformedStartDate: Date.parse(exp.startDate),
      transformedEndDate: Date.parse(exp.endDate),
    }
  }).sort((e1, e2) => {
    if (e1.transformedStartDate === e2.transformedStartDate) {
      return e2.transformedEndDate - e1.transformedEndDate;
    }
    return e2.transformedStartDate - e1.transformedStartDate;
  })

  return (
    <div className='w-auto min-h-fit flex flex-col space-y-2 items-center justify-center py-8 bg-slate-200'
      id="experiences">
      <h2 className='text-2xl mb-2'>Work Experience and Education</h2>
      <Timeline position="alternate" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
        {
          sortedExp.map((ex, index) => {
            return (
              <TimelineItem key={index}>
                <TimelineOppositeContent>
                  <Typography variant="body2" color="text.secondary">
                    {ex.startDate} - {ex.endDate}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    {/* <LaptopMacIcon /> */}
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="body1" >
                    {ex.role}
                  </Typography>
                  <Typography variant='body2' className='font-bold' >{ex.organisation}</Typography>
                  <Typography variant='caption' >{ex.description}</Typography>
                </TimelineContent>
              </TimelineItem>
            )
          })
        }
      </Timeline>
    </div>
  );
}