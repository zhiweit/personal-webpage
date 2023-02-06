import { CertificationCard } from "./CertificationCard"

export function CertificationsArray({ certs }: { certs: Certification[] }) {
  // sort the certifications by Issue Date
  const sorted = certs.map((cert) => {
    return {
      ...cert,
      transformedDate: Date.parse(cert.issueDate),
    }
  }).sort((e1, e2) => {
    return e2.transformedDate - e1.transformedDate;
  })

  return (
    <div className='flex flex-row justify-center flex-wrap gap-6 '>
      {sorted.map((cert) => {
        return (
          <CertificationCard key={cert.id}
            cert={cert} />
        )
      })}
    </div>
  )
}