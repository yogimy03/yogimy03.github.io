/* ============================================================
   data.js - the only file you need to touch to change content.

   LINKS: every "links" object below has named slots, e.g.
     links: { code: "", demo: "", paper: "" }
   Leave a slot as "" and its button simply does not render.
   Fill it with a URL and the button appears. Nothing else needed.
   ============================================================ */

const DATA = {

  site: {
    name: "Yogi Makadiya",
    handle: "yogimy03",
    // email is split so it is not a single scrapeable string in the markup
    emailUser: "yogimakadiya3",
    emailDomain: "gmail.com",
    linkedin: "https://linkedin.com/in/yogibm",
    github: "https://github.com/yogimy03",
    location: "Redmond, WA",
    resumeLinks: {
      // optional: link to hosted resume PDFs, one per lens.
      // Empty = the resume artifact stays hidden. Fill one or both.
      build: "assets/Yogi Makadiya_Resume_Software.pdf",
      break: "assets/Yogi Makadiya_Resume_Security.pdf"
    }
  },

  /* Each role has two bullet sets. The visitor's lens picks which one
     renders: "build" reads like a software resume, "break" like a
     security resume. Same job, two true stories. */
  experience: [
    {
      company: "CuraJoy",
      role: "Software Engineer - DevSecOps",
      period: "Sep 2025 - Present",
      where: "Remote, USA",
      bullets: {
        build: [
          "Own end-to-end delivery of 10+ production features across a React frontend, REST APIs, and the databases behind them, from requirement to production deploy.",
          "Moved the platform's cloud infrastructure onto AWS and wired in application monitoring and alerting, keeping releases on cadence and the platform stable as the user base grew.",
          "Automated CI/CD with Docker and GitHub Actions, removing manual release steps so the team ships faster with fewer rollbacks."
        ],
        break: [
          "Hardened platform security by finding and fixing critical vulnerabilities, then adding role-based access control, encryption, and alerting that held up as the product scaled.",
          "Built SAST, dependency, and secret-scanning gates into the CI/CD pipeline, cutting post-release security defects by 40% without slowing releases down.",
          "Run incident response on production alerts: triage, root cause, fix, and a short writeup so the same thing does not page twice."
        ]
      }
    },
    {
      company: "Double Slash Internet Pvt Ltd",
      role: "Software Engineer Intern - DevSecOps",
      period: "Jan 2023 - Jun 2023",
      where: "India",
      bullets: {
        build: [
          "Integrated test automation into CI/CD pipelines for four back-end services, improving deployment speed by 30% and cutting post-release defects by 40%.",
          "Built Python and Flask dashboards for real-time monitoring of assets and system metrics across the fleet."
        ],
        break: [
          "Wired security into the CI/CD pipelines for four back-end services: dependency audits, secret scanning, and test gates that catch problems before release instead of after.",
          "Put role-based access control and data protection practices on the monitoring dashboards, keeping sensitive operational data on a need-to-know basis."
        ]
      }
    },
    {
      company: "State Cyber Crime Cell, CID Crime and Railways",
      role: "Cyber Security Intern",
      period: "Jun 2022 - Aug 2022",
      where: "Gujarat, India",
      bullets: {
        build: [
          "Helped design and build a central case database that made evidence searchable and linkable across investigations, with access controls baked into the schema.",
          "Built analysis workflows that turned raw device data into attack timelines investigators could actually read."
        ],
        break: [
          "Supported 23+ active investigations across incident response, digital forensics, and security event analysis, rebuilding attack timelines that fed into legal documentation.",
          "Designed the access control and confidentiality boundaries for the central case database, so evidence stayed searchable without being exposed."
        ]
      }
    },
    {
      company: "Seatizen, startup incubated at PDPU IIC",
      role: "Cloud Developer Intern",
      period: "Feb 2021 - Jan 2022",
      where: "Gandhinagar, India",
      bullets: {
        build: [
          "Implemented and tuned object detection for resource-constrained embedded systems, improving inference accuracy by 15% through model optimization.",
          "Deployed the pipelines to Google Cloud with Firestore for low-latency processing and led hardware selection across multiple edge GPU platforms."
        ],
        break: [
          "Secured the edge-to-cloud deployment with IAM roles, locked-down Firestore rules, and least-privilege service accounts protecting image data.",
          "Built the object-detection pipeline those controls protect, from edge GPU devices through Google Cloud."
        ]
      }
    }
  ],

  /* tags drive the filter chips. Valid: software, security, ai, cloud, data, research */
  projects: [
    {
      id: "proofgate",
      tile: "pg",
      title: "ProofGate",
      tags: ["ai", "security", "cloud", "software"],
      why: "Everyone is bolting AI onto security scanners. Nobody trusts it to block a merge, because it will confidently cite a line of code that was never there.",
      desc: "A CI/CD security gate that treats every finding, from a scanner or an AI, as a claim to prove before it is allowed to block a build. It pairs an AI reviewer for the bugs scanners miss, IDOR, missing auth, business logic, with SAST, dependency, container, IaC, and live cloud posture scans, all in one report. The hard part was trust: a mechanical check that every AI-cited line actually exists in the diff so it cannot hallucinate past the gate, a panel of skeptic checks that drops anything it cannot defend, and a ledger that records every keep and drop so the false-positive cut is a measured number instead of a promise. That is what lets it block a merge instead of leaving advisory comments nobody acts on.",
      build: "One gate across six layers of scans, wired into GitHub Actions, GitLab, and Jenkins.",
      secure: "Proves each finding line by line, so an AI can gate a merge without hallucinating.",
      stack: ["Python", "FastAPI", "Claude API", "GitHub Actions", "Docker", "Semgrep", "Trivy", "Prowler"],
      links: { code: "https://github.com/yogimy03/proofGate", demo: "", writeup: "" }
    },
    {
      id: "detection-lab",
      tile: "de",
      title: "Detection Engineering Lab",
      tags: ["security", "cloud"],
      why: "Every SIEM ships with hundreds of rules and a coverage map that is all green. Almost nobody checks whether the rules actually fire, and a lot of them never do.",
      desc: "A detection lab that proves coverage instead of claiming it. It replays real attacker techniques across Windows, Linux, cloud, and network, runs Sigma rules over them, and only counts a technique as covered when its rule fires on the attack and stays quiet on normal activity. The interesting part is what it catches: a rule too broad to trust because it also alerts on a routine admin command, and rules that silently never fire, one because the command hides inside a shell wrapper and one because renaming a tool from procdump.exe walks right past it. It runs as detections-as-code, so a change that quietly breaks a proven rule fails the build like a broken test. The offline demo needs no install; the full lab ships the same events into a real Splunk on any OS.",
      build: "Pure-Python engine, zero install, plus a real Splunk lab in Docker for any OS.",
      secure: "Proven vs claimed ATT&CK coverage, and a CI gate that catches broken detections.",
      stack: ["Sigma", "MITRE ATT&CK", "Splunk", "Atomic Red Team", "Zeek", "Python"],
      links: { code: "https://github.com/yogimy03/detection-engineering-lab", demo: "", writeup: "" }
    },
    {
      id: "iot-forensics",
      tile: "fx",
      title: "IoT Forensics System Based on Blockchain",
      tags: ["security", "research"],
      why: "Evidence from IoT devices is easy to collect and even easier to dispute. Chain of custody should be provable, not promised.",
      desc: "A forensics system that anchors evidence collected from IoT devices to a blockchain, so any tampering after collection is detectable and the custody trail can be verified by a third party who trusts no one involved. Built around the realities of digital investigations, where the question is rarely what the data says and usually whether anyone believes it. Published at IEEE INDIACom 2023.",
      build: "Evidence ingestion, hashing, and an audit trail anyone can replay.",
      secure: "Tamper-evident custody for evidence that has to survive a courtroom.",
      stack: ["Blockchain", "IoT", "Digital Forensics"],
      links: { paper: "https://ieeexplore.ieee.org/document/10112358", code: "" }
    },
    {
      id: "residentease",
      tile: "re",
      title: "ResidentEase Apartment Management",
      tags: ["software"],
      why: "Property management software holds IDs, payment records, and building access data. Most of it is built like nobody will ever attack it.",
      desc: "A web application for apartment complexes covering rent, maintenance requests, event updates, and guest access. Threat modeled before the first line of code and code reviewed for security before every merge: JWT auth, encrypted data at rest, and strict role separation between residents, staff, and management. Built to prove that small software can still take its users' data seriously.",
      build: "Full stack: React frontend, Node APIs, PostgreSQL underneath.",
      secure: "Threat model first, then JWT auth, encryption, role separation.",
      stack: ["React", "Node.js", "PostgreSQL", "JWT"],
      links: { code: "", demo: "" }
    },
    {
      id: "healthcare",
      tile: "hc",
      title: "Healthcare Cloud Security Hardening",
      tags: ["security", "cloud", "research"],
      why: "Hospitals cannot patch like startups. Securing healthcare systems means working around uptime constraints, not pretending they do not exist.",
      desc: "Security hardening of a cloud-based healthcare platform: found and fixed vulnerabilities across the web, application, and database tiers, then tightened identity management, encryption, and network segmentation around patient data and telemedicine traffic. The research that came out of this work on securing the Internet of Healthcare Things was published by Springer at ICTCS 2022.",
      build: "Practical fixes sequenced around systems that cannot go down.",
      secure: "IAM, encryption, and segmentation across all three tiers.",
      stack: ["Cloud Security", "IAM", "Network Security"],
      links: { paper: "", writeup: "" }
    },
    {
      id: "audit",
      tile: "au",
      title: "Security Audit + Compliance Review",
      tags: ["security"],
      why: "Compliance frameworks are checklists. A real audit asks whether the control would actually stop anything.",
      desc: "A full independent audit of a web platform across technical, administrative, and physical controls: least privilege, encryption, firewall and IDS rules, password and recovery policies, disaster recovery. Every gap mapped to PCI DSS, GDPR, and SOC 2 requirements, with a remediation plan ordered by risk rather than by what was easiest to fix first.",
      build: "A remediation roadmap engineering could actually execute.",
      secure: "Controls tested against intent, not just against the checklist.",
      stack: ["PCI DSS", "GDPR", "SOC 2", "NIST"],
      links: { writeup: "" }
    },
    {
      id: "delinquency",
      tile: "ml",
      title: "Juvenile Delinquency Risk Classification",
      tags: ["data", "research"],
      why: "Prevention budgets get spread evenly because nobody knows where the risk concentrates. The data to do better already existed.",
      desc: "Classification models over demographic and socioeconomic datasets across India to identify high-risk regions, reaching 96% accuracy. Most of the real work was cleaning messy public data and validating honestly instead of chasing a leaderboard number. Findings were condensed into visual reports written for policy stakeholders, not for other data scientists.",
      build: "Scikit-learn pipeline from raw public data to reproducible results.",
      secure: "Risk concentration mapping to target preventive resources.",
      stack: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
      links: { code: "https://github.com/yogimy03/juvenile-crime-analytics-india", writeup: "" }
    },
    {
      id: "scheduler",
      tile: "os",
      title: "OS Process Scheduler Visualizer",
      tags: ["software"],
      why: "Scheduling algorithms are easy to memorize and hard to feel. Watching preemption happen beats reading about it.",
      desc: "An interactive GUI that animates process scheduling algorithms, FCFS, SJF, round robin, and priority, with the real algorithm logic running behind the visuals rather than canned animations. Load a process mix, watch the ready queue evolve and context switches fire. Built as the tool I wished existed when I was learning operating systems.",
      build: "Frontend animation driven by a correct scheduling engine.",
      secure: "Deterministic, inspectable behavior: the visual never lies about state.",
      stack: ["GUI", "Algorithms", "Operating Systems"],
      links: { code: "https://github.com/yogimy03/os-scheduler-studio", demo: "" }
    }
  ],

  earlierWork: [
    {
      title: "FASTag Database Management System",
      line: "Relational schema and workflows for tolling: violation ticketing, parking payment, airport check-in lanes, automated toll deduction."
    },
    {
      title: "Smart Meal Management Interface",
      line: "PHP and SQL app for university dining: menu nutrition, leftover food tracking, fee verification, and student feedback."
    }
  ],

  /* orderBuild / orderBreak control group ordering per lens (lower = first) */
  skills: [
    {
      group: "Security",
      orderBuild: 3, orderBreak: 1,
      items: ["Threat Modeling", "Penetration Testing", "Vulnerability Assessment", "OWASP", "MITRE ATT&CK", "SIEM", "Digital Forensics", "Incident Response"]
    },
    {
      group: "AI + Agents",
      orderBuild: 2, orderBreak: 3,
      items: ["LLM APIs", "AI Agents + Tool Use", "RAG", "Prompt Engineering", "Eval Design"]
    },
    {
      group: "Cloud + DevOps",
      orderBuild: 1, orderBreak: 4,
      items: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "GitHub Actions", "Jenkins", "Ansible", "CI/CD", "Git"]
    },
    {
      group: "Languages",
      orderBuild: 0, orderBreak: 5,
      items: ["Python", "C / C++", "Java", "C#", "TypeScript", "JavaScript", "SQL", "Bash", "PowerShell"]
    },
    {
      group: "Frameworks",
      orderBuild: 4, orderBreak: 6,
      items: ["React", "Node.js", "FastAPI", "Flask", "Django", "ASP.NET"]
    },
    {
      group: "Tools + Compliance",
      orderBuild: 5, orderBreak: 2,
      items: ["Burp Suite", "Nmap", "Wireshark", "Splunk", "Prowler", "Trivy", "Maltego", "Google Chronicle", "NIST", "PCI DSS", "GDPR", "SOC 2"]
    }
  ],

  publications: [
    {
      venueTag: "IEEE",
      title: "IoT Forensics System based on Blockchain",
      authors: "Yogi M., Rutvi V. and Kaushal S.",
      cite: "2023 10th International Conference on Computing for Sustainable Global Development (INDIACom), IEEE, New Delhi, India, 2023, pp. 490-495.",
      abstract: "A smartly equipped life is a life that offers a range of automated services using Internet of Things (IoT) gadgets such as smart sensors, smart cameras, and smart lighting. Gadgets may be operated virtually using receivers such as phones and home speakers like Amazon Echo or Google Home. Such gadgets are becoming more usual in our life, appearing in civilian and sensitive applications like military and national security. Considering the increasingly prevalent usage of such IoT gadgets provides the most useful evidence of one's life. IoT forensics is one of the most helpful processes in many contexts, including legal investigations and internal private corporation inquiries. IoT forensics is the process of collecting, evaluating, and reporting of digital evidence. Such evidence must be protected from tampering and destruction. To mitigate these threats to the traditional IoT forensics system, this paper proposes a framework for a blockchain-based IoT forensics system and the implementation of evidence preservation using blockchain to improve the authenticity, integrity, and non-repudiation properties of the collected evidence.",
      links: { paper: "", doi: "https://ieeexplore.ieee.org/document/10112358" }
    },
    {
      venueTag: "Springer",
      title: "Exploring Cyber Security Issues in the Internet of Healthcare Things (IoHT) with Potential Improvements",
      authors: "Yogi M., Maitri S., Vyom S., Kaushal S. and Mukti P.",
      cite: "Information and Communication Technology for Competitive Strategies (ICTCS 2022), Springer, Singapore, vol 615.",
      abstract: "The introduction of IoT in the healthcare sector has benefited the healthcare sector in several ways, such as minimal doctor visits, on-time medication, regular checkups at home, and health alerts. The paper dwells on the development of a technical field, the Internet of Healthcare Things (IoHT), which is growing exponentially. Traditional network security systems have a well-defined set of features. Traditional security techniques, however, cannot be directly employed to protect IoT devices and networks from cyber-attacks due to the resource restrictions of IoT devices and the distinctive behavior of IoT protocols. It primarily focuses on various IoT devices currently employed in the healthcare field. The paper reviews current implementations of IoHT security protocols and suggests alternative methodologies to enhance the security of various IoHT devices. A detailed exploration of the cyber security issues and potential improvements in security measures of several IoHT devices like iTBra, infusion pumps, pacemakers, smart inhalers, and blood pressure monitors are discussed.",
      links: { paper: "", doi: "https://doi.org/10.1007/978-981-19-9304-6_52" }
    }
  ],

  education: [
    {
      school: "University of Maryland",
      degree: "M.Eng, Cybersecurity",
      gpa: "3.93 / 4.00",
      period: "Aug 2023 - May 2025",
      where: "College Park, MD",
      note: "2024 ISC2 Graduate Scholarship recipient. Phi Kappa Phi Honor Society inductee.",
      coursework: [
        "Hacking of C Programs and Unix Binaries", "Networks and Protocols", "Cloud Security",
        "Secure Operating Systems", "Security Tools for Information Security", "Information Assurance",
        "Secure Coding for Software Engineering", "Digital Forensics and Incident Response", "Penetration Testing"
      ]
    },
    {
      school: "Pandit Deendayal Energy University",
      degree: "B.Tech, Computer Engineering",
      gpa: "9.72 / 10.00",
      period: "Aug 2019 - May 2023",
      where: "Gandhinagar, India",
      note: "",
      coursework: [
        "Data Structures and Algorithms", "Operating Systems", "Database Management Systems",
        "Computer Networks", "Object Oriented Programming with Java", "System Software and Compiler Design",
        "Software Engineering", "Machine Learning", "AI and Data Mining", "Information Security",
        "Cyber Security", "Digital Forensics", "Cloud Computing", "Blockchain Technology",
        "Mobile Computing", "Probability and Statistics", "Discrete Mathematical Structures",
        "Digital Electronics and Computer Organization", "Microprocessor Programming and Interfacing"
      ]
    }
  ],

  credentials: [
    {
      title: "CompTIA Security+ (SY0-701)",
      line: "Vendor-neutral baseline for security operations: threat analysis, secure architecture, risk management, and incident response. The DoD 8140-approved credential most defensive roles screen for.",
      // Paste the Credly badge public URL into "badge" and the CompTIA verification URL into "verify".
      // Empty strings render no button, so both stay hidden until you fill them in.
      links: { badge: "https://www.credly.com/badges/4e8280dc-dfa7-4c46-97a8-d186fa1069e8/public_url", verify: "https://cp.certmetrics.com/CompTIA/en/public/verify/credential/d4aa5ac277b4484986344e894bcb3b5c" }
    },
    {
      title: "Google Cybersecurity Professional Certificate",
      line: "Hands-on coursework across network protection, risk management, SIEM tooling, and incident handling.",
      links: { badge: "https://www.credly.com/badges/62c1c297-4186-49e0-8b3a-22e069ddc585/public_url", certificate: "https://coursera.org/share/ecb058a1a2baf30ccf37aad937982b3a" }
    },
    {
      title: "ISC2 Graduate Scholarship, 2024",
      line: "Awarded by ISC2 for academic excellence in cybersecurity studies. Covered tuition and educational materials.",
      links: { letter: "https://drive.google.com/file/d/1co3fIq18kqqUG_i2CHaG3jRbNx5RF3CY/view?usp=sharing", certificate: "https://drive.google.com/file/d/1cMprJc2orjuFh5NrHJ27nD1mJ7oc-ZCq/view" }
    },
    {
      title: "Phi Kappa Phi Honor Society, Inducted 2024",
      line: "Invitation-only induction during the M.Eng at Maryland. The oldest all-discipline honor society in the US, limited to the top 10% of graduate students.",
      links: { letter: "https://drive.google.com/file/d/1OiRdjNJ3yJEIYYU6tVHHm0e21DwEqXl-/view?usp=sharing" }
    }
  ],

  leadership: [
    {
      title: "Partnerships and Sponsorship Manager, TEDxPDEU",
      line: "Ran partnerships with a team of 20+. Pitched and closed sponsors, then kept them happy enough to come back the next year. Turns out securing budgets and securing systems both come down to understanding what the other side is afraid of losing."
    },
    {
      title: "Treasurer, Computer Society of India, PDEU",
      line: "Owned the chapter budget for a full year of events: planning, allocation, and the unglamorous work of saying no. The society ended the year solvent, which is the only metric a treasurer is allowed to brag about."
    },
    {
      title: "Associate Committee Member, MMCITRE International Conference",
      line: "Helped run the 2nd international MMCITRE conference: speaker liaison, schedules, and keeping sessions flowing on a day when nothing wants to flow on schedule."
    }
  ]
};
