import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiGrid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

const Grid = styled(MuiGrid)(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& [role="separator"]': {
    margin: theme.spacing(0, 2),
  },
}));

export default function VerticalDividerText() {
  const content = (
    <div>
      {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id dignissim justo.
   Nulla ut facilisis ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus.
   Sed malesuada lobortis pretium.`}
    </div>
  );

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css" />

      <Grid container spacing={3} >
        <Grid item xs className='text-center'>
          <p className='font-bold'>Basic
            <Tooltip title=" < 1 year experience" arrow>
              <HelpOutlineRoundedIcon />
            </Tooltip>
          </p>
          <Tooltip title="After Effects" arrow>
            <Avatar src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg" />
          </Tooltip>
        </Grid>
        <Divider orientation="vertical" flexItem />

        <Grid item xs>
          <p className='font-bold'>Intermediate
            <Tooltip title=" < 2 years experience" arrow>
              <HelpOutlineRoundedIcon />
            </Tooltip>
          </p>
          <Tooltip title="Docker" arrow>
            <Avatar src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" />
          </Tooltip>
        </Grid>

        <Divider orientation="vertical" flexItem />
        <Grid item xs>
        <p className='font-bold'>Advanced
            <Tooltip title=" > 2 years experience" arrow>
              <HelpOutlineRoundedIcon />
            </Tooltip>
          </p>
          <Tooltip title="Django" arrow>
            <Avatar  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" />
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
}