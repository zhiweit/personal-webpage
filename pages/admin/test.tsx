import AlertDialog from "@/components/AlertDialog";
import { CertificationCard } from "@/components/CertificationCard";
import { CertificationsArray } from "@/components/CertificationsArray";
import Test from "@/components/Test";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import { NextPage } from "next";
import { useState } from "react";

const EditCert: NextPage = () => {
  const certs: Certification[] = [{
    name: "AI200: Applied Machine Learning",
    organisation: "Heicoders Academy (Professionals)",
    issueDate: "Dec 2022",
    courseUrl: "https://heicodersacademy.com/AI200-applied-machine-learning-course",
    thumbnailUrl: "https://media.licdn.com/dms/image/C560BAQHXHKfMosolew/company-logo_100_100/0/1595659734685?e=1683763200&v=beta&t=InkNuM6Ue5df03hrWSEIdga6LfDMf4SB_ubBjffh1DM",
    credentialUrl: "https://cert.heicodersacademy.com/static/media/bCLIfeNRUymwwqok.e6679310d82069af68da.jpg",
  },
  {
    name: "Certified Foundations Associate, Java",
    organisation: "Oracle",
    issueDate: "Nov 2022",
    courseUrl: "https://education.oracle.com/java-foundations/pexam_1Z0-811",
    thumbnailUrl: "https://brm-workforce.oracle.com/pdf/certview/images/JAVA8OJA.png", 
    credentialUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=6B63EDF0679E9ABCACD8CC997725F6D77FE3FC718AA157F405F56AFFF985D2C8",
  },
  {
    name: "Microsoft Office Specialist Excel 2013",
    organisation: "Microsoft",
    issueDate: "Jun 2016",
    courseUrl: "https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE4toXa",
    thumbnailUrl: "https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-fundamentals-badge.svg",
    credentialUrl: '',
  },
  ]
  return (
    <div className='w-auto grid h-screen place-content-center'>
      <CertificationsArray certs={certs} />
    </div>
  )
}

export default EditCert