import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';
import { NextPage } from 'next';

interface Experience {
  startDate: string
  endDate: string
  role: string
  organisation: string
  description: string
}

const test2: NextPage = () => {
  const experiences: Experience[] = [{
    startDate: 'Jan 2021',
    endDate: 'Feb 2021',
    role: 'Software Engineer',
    organisation: 'Google',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
    {
      startDate: 'Feb 2021',
      endDate: 'May 2021',
      role: 'Software Developer',
      organisation: 'Facebook',
      description: 'Added some cool features to Facebook messenger. Part of a team of amazing people.'
    },
    {
      startDate: 'Jun 2021',
      endDate: 'Aug 2021',
      role: 'ML Engineer',
      organisation: 'Amazon',
      description: 'Coded the amazing ChatGPT from scratch.'
    }
    ]
  return (
    <>
      <h2 className='font-bold text-2xl'>Experiences</h2>
      <Timeline position="alternate">
        {
          experiences.map((experience, index) => {
            return (
              <TimelineItem key={index}>
                <TimelineOppositeContent>
                  <Typography variant="body2" color="text.secondary">
                    {experience.startDate} - {experience.endDate}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <LaptopMacIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6" component="h1">
                    {experience.role}
                  </Typography>
                  <Typography>{experience.organisation}</Typography>
                  <Typography>{experience.description}</Typography>
                </TimelineContent>
              </TimelineItem>
            )
          })
        }
      </Timeline>
        

    </>
  );
}

export default test2