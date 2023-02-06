interface AnimatedTextProps {
  text: string[];
}

interface User {
  email: string
  hashedPassword: string
  role: 'USER' | 'ADMIN'
  verified: boolean
  authToken: string
}
interface About {
  id?: string // optional because it is not present when adding the first about
  name: string
  avatarUrl: string
  linkedInUrl: string
  githubUrl: string
  info: string[]
  interests: string[]
}

interface Project {
  id?: string // optional because it is not present when adding a new project
  name: string
  description: string
  url: string
  thumbnailUrl: string
  startDate: string
  endDate: string
  feTechnologies: string[] //red
  beTechnologies: string[] //green
  dbTechnologies: string[] //blue
  otherTechnologies: string[] // orange
}

interface ProjectCarouselProps extends Project {
  autoPlay: boolean
}

interface Experience {
  id?: string
  startDate: string
  endDate: string
  role: string
  organisation: string
  description: string
}

interface Certification {
  id?: string
  name: string
  organisation: string
  thumbnailUrl: string 
  credentialUrl: string
  courseUrl: string
  issueDate: string // mmm yyyy
}

interface LoginResponse {
  message: string
  token?: string
}

interface ToastMessage {
  alertMessage: string
  alertTitle: string
  autoHideDurationMs: number
  severity: 'success' | 'info' | 'warning' | 'error'
}