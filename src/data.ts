/* ------------------------------------------------------------------ */
/*  Single source of truth — every fact below comes from the resume.  */
/* ------------------------------------------------------------------ */

export const PROFILE = {
  name: "Udhaya Kumara Devan S",
  firstName: "Udhaya",
  location: "Chennai, Tamil Nadu, India",
  phone: "+91 7695931468",
  phoneHref: "tel:+917695931468",
  email: "udhayakumaradevan@gmail.com",
  coords: "13.08° N / 80.27° E",
  positioning: "Technical Support • MCA • Problem Solver",
};

export const NAV_ITEMS = [
  { label: "Introduction", target: "top" },
  { label: "Selected Work", target: "work" },
  { label: "Experience", target: "experience" },
  { label: "About", target: "about" },
  { label: "Contact", target: "contact" },
] as const;

/* Section registry — drives the nav indicator */
export const SECTIONS = [
  { id: "top", index: "01", label: "Introduction" },
  { id: "identity", index: "01", label: "Identity" },
  { id: "capabilities", index: "02", label: "Capabilities" },
  { id: "skills", index: "03", label: "Skills" },
  { id: "work", index: "04", label: "Selected Work" },
  { id: "experience", index: "05", label: "Experience" },
  { id: "education", index: "06", label: "Education" },
  { id: "certifications", index: "07", label: "Certifications" },
  { id: "about", index: "08", label: "About" },
  { id: "contact", index: "09", label: "Contact" },
] as const;

/* ---------------- capabilities ("what I do") ---------------- */
export const CAPABILITIES = [
  {
    word: "Troubleshoot",
    detail: "Trace the fault to its root — methodically diagnosing application, software and system issues.",
  },
  {
    word: "Configure",
    detail: "Install and configure software, tools and environments so systems run the way they should.",
  },
  {
    word: "Support",
    detail: "Desktop and end-user support — patient, clear and complete, in person or over remote access.",
  },
  {
    word: "Test",
    detail: "Verify features and fixes for reliable performance and usability before they reach users.",
  },
  {
    word: "Resolve",
    detail: "Close the loop — fix the issue, confirm the outcome, and leave the system better documented.",
  },
  {
    word: "Learn",
    detail: "Every ticket teaches something. Continuous learning across Windows, Linux and the cloud.",
  },
];

/* ---------------- skill groups ---------------- */
export const SKILL_GROUPS = [
  {
    name: "Technical Support",
    code: "TS",
    skills: [
      "Technical Troubleshooting",
      "Software Installation & Configuration",
      "Hardware Support",
      "Desktop & End-User Support",
      "Windows & Linux Administration",
      "Remote Support",
    ],
  },
  {
    name: "Operating Systems",
    code: "OS",
    skills: ["Windows", "Linux"],
  },
  {
    name: "Tools",
    code: "TL",
    skills: [
      "Remote Desktop",
      "TeamViewer",
      "AnyDesk",
      "Visual Studio Code",
      "MS Excel",
      "MS Word",
      "MS PowerPoint",
    ],
  },
  {
    name: "Soft Skills",
    code: "SS",
    skills: ["Problem Solving", "Communication", "Teamwork", "Adaptability", "Time Management"],
  },
];

/* ---------------- pinned disciplines scene ---------------- */
export const DISCIPLINES = [
  {
    index: "01",
    title: "Support",
    line: "First — understand what broke, and for whom.",
    items: ["Technical Troubleshooting", "Desktop & End-User Support", "Remote Support"],
  },
  {
    index: "02",
    title: "Systems",
    line: "Then — know the environment it broke in.",
    items: ["Windows", "Linux", "Software Configuration", "Hardware Support"],
  },
  {
    index: "03",
    title: "Tools",
    line: "Reach the problem from anywhere.",
    items: ["Remote Desktop", "TeamViewer", "AnyDesk", "Visual Studio Code"],
  },
  {
    index: "04",
    title: "People",
    line: "Explain it clearly. Resolve it together.",
    items: ["Communication", "Teamwork", "Adaptability", "Time Management"],
  },
];

/* ---------------- selected work ---------------- */
export const PROJECT = {
  name: "Bommi Enterprises",
  type: "E-Commerce Website",
  stack: ["HTML", "CSS", "JavaScript", "Node.js", "MongoDB"],
  domain: "bommi.enterprises",
  responsibilities: [
    "Configured the application environment and supported deployment during development.",
    "Performed troubleshooting and resolved application issues.",
    "Tested application features for reliable performance and usability.",
    "Managed user authentication and verified secure user access.",
    "Identified and fixed bugs during maintenance.",
    "Collaborated with team members for smooth system operation and timely issue resolution.",
  ],
  flow: ["User", "Authentication", "Application", "Database"],
};

/* ---------------- technical experience ---------------- */
export const EXPERIENCE_NOTE =
  "No invented roles — the practice below is drawn from the Bommi Enterprises project and hands-on study.";

export const EXPERIENCE = [
  {
    label: "Troubleshooting",
    detail: "Diagnosed and resolved application issues throughout the Bommi Enterprises build.",
  },
  {
    label: "Application Support",
    detail: "Supported the e-commerce application through development and day-to-day operation.",
  },
  {
    label: "Testing",
    detail: "Tested application features for reliable performance and usability.",
  },
  {
    label: "Deployment Assistance",
    detail: "Configured the application environment and assisted deployment during development.",
  },
  {
    label: "User Authentication",
    detail: "Managed user authentication and verified secure user access.",
  },
  {
    label: "Bug Resolution",
    detail: "Identified and fixed bugs during maintenance cycles.",
  },
  {
    label: "Team Collaboration",
    detail: "Worked with team members for smooth operation and timely issue resolution.",
  },
];

/* ---------------- education ---------------- */
export const EDUCATION = [
  {
    years: "2024—26",
    degree: "Master of Computer Applications",
    school: "S.A. Engineering College, Poonamallee",
    score: "CGPA 6.98",
    note: "Advanced computing, systems and software practice.",
  },
  {
    years: "2020—23",
    degree: "Bachelor of Computer Applications",
    school: "Joseph Arts & Science College, Thirunavalur",
    score: "CGPA 7.68",
    note: "Foundations of programming, databases and networks.",
  },
];

/* ---------------- certifications ---------------- */
export const CERTIFICATIONS = [
  {
    title: "Certification Program in Service Desk Operation",
    issuer: "EduBridge Learning Pvt. Ltd.",
    tag: "Service Desk",
  },
  {
    title: "Cloud Computing and Distributed Systems",
    issuer: "NPTEL — IIT Madras",
    tag: "Cloud",
  },
  {
    title: "Cyber Security and Privacy",
    issuer: "NPTEL — IIT Madras",
    tag: "Security",
  },
  {
    title: "Google Cloud Generative AI Virtual Internship",
    issuer: "SmartBridge",
    tag: "Internship",
  },
  {
    title: "Web Development Internship",
    issuer: "Infotact Solutions",
    tag: "Internship",
  },
  {
    title: "Digital 101",
    issuer: "NASSCOM",
    tag: "Foundations",
  },
];

// LANGUAGES removed per hero redesign — not rendered
