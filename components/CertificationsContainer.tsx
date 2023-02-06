import { CertificationsArray } from "./CertificationsArray";

export function CertificationsContainer({ certs }: { certs: Certification[] }) {
  return (
    <div className='w-auto min-h-fit m-10 flex flex-col items-center justify-center '
      id="certifications">
      <h2 className='text-2xl mb-6'>Certifications</h2>
      <CertificationsArray certs={certs} />
    </div>
  )
}