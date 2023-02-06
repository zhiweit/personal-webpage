export const DB_NAME = 'personal-website'
export const USERS_COLLECTION = 'users'
export const ABOUT_COLLECTION = 'about'
export const PROJECTS_COLLECTION = 'projects'
export const EXPERIENCES_COLLECTION = 'experiences'
export const CERTIFICATIONS_COLLECTION = 'certifications'

export const USER_TOKEN = 'user-token'

export const PLACEHOLDER_TOAST_MESSAGE: ToastMessage = {
  alertMessage: '',
  alertTitle: '',
  autoHideDurationMs: 3000,
  severity: 'success'
}

export const PLACEHOLDER_ID = "0"
export const PLACEHOLDER_PROJECT: Project = {
  id: PLACEHOLDER_ID,
  name: 'New Project',
  description: 'New Project Description',
  startDate: 'New Project Start Date',
  endDate: 'New Project End Date',
  thumbnailUrl: '',
  url: '',
  feTechnologies: [],
  beTechnologies: [],
  dbTechnologies: [],
  otherTechnologies: [],
}

export const PLACEHOLDER_ABOUT: About = {
  id: PLACEHOLDER_ID,
  name: 'name',
  avatarUrl: '',
  linkedInUrl: '',
  githubUrl: '',
  info: ['info 1', 'info 2', 'info 3'],
  interests: ['interest 1', 'interest 2', 'interest 3'],
}

export const PLACEHOLDER_EXPERIENCE: Experience = {
  id: PLACEHOLDER_ID,
  organisation: 'New Company',
  role: 'New Position',
  startDate: 'New Start Date',
  endDate: 'New End Date',
  description: 'New Description',
}

export const PLACEHOLDER_CERT: Certification = {
  id: PLACEHOLDER_ID,
  name: 'New Certification',
  organisation: 'New Organisation',
  thumbnailUrl: 'New Thumbnail Url',
  courseUrl: 'New Course Url',
  issueDate: 'Issue Date (mm yyyy)',
  credentialUrl: 'New Credential Url',
}

const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY!

export function getJwtSecretKey(): string {
  if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0) {
    throw new Error('The environment variable JWT_SECRET_KEY is not set.')
  }

  return JWT_SECRET_KEY
}

// ERROR messages
export const NO_TOKEN_FOUND = 'No token found'
export const JWT_TOKEN_EXPIRED = 'JWT token has expired'