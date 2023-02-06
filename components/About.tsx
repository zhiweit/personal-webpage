import { Avatar, IconButton } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AnimatedText from "./AnimatedText";

const About = ({ name, avatarUrl, githubUrl, info, interests, linkedInUrl }: About) => {

  return (
    <div className="h-screen p-12 flex justify-evenly items-center gap-4 flex-wrap">
      <Avatar
        srcSet={avatarUrl}
        className='w-72 h-72'
      >ZW</Avatar>

      {/* Name and details container */}
      <div className="flex flex-col my-auto">
        <p className="text-2xl font-normal ">{name} &nbsp;
          <IconButton href={githubUrl} size='small' target='_blank' >
            <GitHubIcon />
          </IconButton><IconButton href={linkedInUrl} size='small' target='_blank' >
            <LinkedInIcon color="primary" />
          </IconButton>
        </p>
        
        <hr className="my-2" />

        {
          info.map((item, index) => {
            return <p className="text-md font-light" key={index}>{item}</p>
          })
        }
        <hr className="my-2" />

        <span className='font-extralight'>
          Interests: &nbsp;&nbsp;
          <AnimatedText WORDS_TO_ANIMATE={interests} />
        </span>
      </div>

    </div>
  );
};

export default About;