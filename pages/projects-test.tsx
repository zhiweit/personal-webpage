import ProjectsCarousel from "@/components/ProjectsCarousel"
import { NextPage } from "next"

const projectTest: NextPage = () => {
  const projects: Project[] = [{
    name: 'PassAway',
    description: "A corporate pass booking system developed as part of a school project for staff to book complementary corporate passes to local attractions. User functionalities include: (1) Viewing pass availability, (2) Booking passes, (3) Reporting of lost passes, (4) Email reminders and notification. Admin functionalities include: (1) Pass management (CRUD), (2) User management (CRUD), and (3) exporting of data.",
    startDate: 'Aug 2022',
    endDate: 'Nov 2022',
    thumbnailUrl: '',
    url: 'https://youtube.com',
    feTechnologies: ['Vue.js', 'Typescript', 'Bootstrap', 'CSS'],
    beTechnologies: ['Spring Boot', 'Java'],
    dbTechnologies: ['MySQL'],
    otherTechnologies: ['JWT', 'Docker', 'Thymeleaf'],
  },
  {
    name: 'RecycleSG',
    description: "A web app to identify item using image recognition API, check whether item is recyclable, and to update NEA's recyclable database items progressively. User functionalities include: (1) Search by text, (2) Search by image, (3) Send recycling request to admin (if item is not in database), (4) Login and earn reward points for each image taken at a recycling bin, (5) Book bulky waste collection. Admin functionalities include: (1) Dashboard of text searches, (2) Manage recycling requests, (3) View recyclable database, (4) Manage collection bookings.",
    startDate: 'Aug 2022',
    endDate: 'Nov 2022',
    thumbnailUrl: '',
    url: 'https://www.youtube.com/watch?v=j86KEWDiPjg',
    feTechnologies: ['Vue.js', 'Typescript', 'PrimeVue', 'TailwindCSS'],
    beTechnologies: ['Nuxt.js'],
    dbTechnologies: ['Cloud Firestore', 'Cloud Storage for Firebase'],
    otherTechnologies: ['Google Cloud Vision API', 'Firebase Admin'],
  },
  ]
  return (
    <ProjectsCarousel projects={projects} autoPlay={true} />
  )

}

export default projectTest