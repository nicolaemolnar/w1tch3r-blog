export type SkillCategory = "Software" | "Infrastructure" | "Security" | "General" | "Electronic Warfare" | "Soft Skills"; 
export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export type Certificate = {
  name: string;
  issuer?: string;
  year?: number;
  url?: string;
};

export type Skill = {
  id: string;                // slug corto, único (para anchor)
  name: string;              // "React", "TypeScript"...
  category: SkillCategory;
  level: SkillLevel;         // 1..5
  summary: string;           // 1-2 líneas
  competencies: string[];    // bullets: qué sabes hacer
  experience: {
    years?: number;          // opcional
    contexts: string[];      // proyectos, ámbitos, etc.
  };
  certificates?: Certificate[];
  tools?: string[];
  relatedProjectSlugs?: string[]; // enlazar a /projects/:slug
};

export const skills: Skill[] = [
  // Security skills
  {
    id: "web-security",
    name: "Web Security",
    category: "Security",
    level: 2,
    summary: "Pentesting web y análisis de vulnerabilidades sobre páginas web y APIs REST/SOAP. Involucra pruebas de inyección SQL, filtración de datos, ejecución remota de código e instalación de shells inversas. ",
    competencies: [
      "OWASP Top 10: identificación y explotación (XSS, SQLi, IDOR, SSRF, LFI/RFI, webshells)",
      "Análisis de autenticación/sesión: cookies, JWT, CSRF",
      "Revisión de fallos de configuración: endpoints de depuración, rutas ocultas",
      "Reporting: evidencia reproducible, severidad/impacto y mitigaciones accionables",
    ],
    experience: {
      contexts: ["HTB (Apache, IIS, Werkzeug, Wordpress)", "Labs eJPT (IIS, Wordpress)", "Prácticas de hacking ético en UNED"],
    },
    certificates: [{ name: "eLearnSecurity Junior Penetration Tester (eJPT)", issuer: "INE", year: 2024 }],
    tools: ["Burp Suite", "whatweb", "wfuzz", "nmap", "sqlmap", "searchsploit"],
  },  
  {
    id: "network-security",
    name: "Network Security",
    category: "Security",
    level: 3,
    summary: "Pentesting de redes y análisis de vulnerabilidades en infraestructuras de red. Incluye reconocimiento, escaneo, enumeración, explotación y post-explotación en entornos LAN/WAN con múltiples hosts y servicios.",
    competencies: [
      "Reconocimiento de redes: nmap, netdiscover",
      "Escaneo de puertos y servicios: nmap, masscan",
      "Enumeración de servicios: smbclient, enum4linux",
      "Explotación de vulnerabilidades en servicios: Metasploit, exploit-db, searchsploit",      "Post-explotación: pivoting, movimiento lateral, privilege escalation"
    ],
    experience: {
      contexts: ["HTB (Redes simples de host o host+docker)", "Labs eJPT (Redes externas y pivoting a redes internas)"],
    },
    certificates: [{ name: "eLearnSecurity Junior Penetration Tester (eJPT)", issuer: "INE", year: 2024 }],
    tools: ["nmap", "searchsploit", "Metasploit", "Nessus", "Wireshark", "Responder", "Impacket", "netcat", "tcpdump", "Hydra", "John the Ripper", "Mimikatz", "CrackMapExec", "Burp Suite"],
  },  
  {
    id: "osint-reconnaissance",
    name: "OSINT & Reconnaissance",
    category: "Security",
    level: 2,
    summary: "Reconocimiento y análisis de información pública para identificar vulnerabilidades y objetivos potenciales.",
    competencies: [
      "Identificación de información pública en redes sociales, sitios web y bases de datos públicas",
      "Uso de herramientas OSINT para recopilar, manual y automáticamente, información sobre objetivos",
      "Análisis de datos recopilados para identificar patrones y vulnerabilidades",
      "Creación de perfiles detallados sobre objetivos potenciales"
    ],
    experience: {
      contexts: ["Labs eJPT", "Proyectos personales/académicos"],
    },
    certificates: [{ name: "eLearnSecurity Junior Penetration Tester (eJPT)", issuer: "INE", year: 2024 }],
    tools: ["theHarvester", "Maltego", "Recon-ng", "Google Dorks", "Shodan", "Social-Engineer Toolkit (SET)", "Social Media Platforms"],
  },  
  {
    id: "sdlc-development",
    name: "SDLC",
    category: "Security",
    level: 2,
    summary: "Desarrollo seguro a lo largo del ciclo de vida del software (SDLC), integrando prácticas de seguridad en cada fase del desarrollo.",
    competencies: [
      "Integración de prácticas de seguridad en el ciclo de vida del desarrollo de software",
      "Revisión de código para identificar vulnerabilidades de seguridad",
      "Implementación de controles de seguridad en el desarrollo de software",
      "Pruebas de seguridad y validación de aplicaciones"
    ],
    experience: {
      contexts: ["Formación profesional", "Entorno corporativo de desarrollo de software."],
    },
    certificates: [],
    tools: ["SonarQube", "OWASP ZAP", "Snyk", "Checkmarx", "Veracode"],
  },
  {
    id: "social-engineering",
    name: "Social Engineering",
    category: "Security",
    level: 1,
    summary: "Técnicas de ingeniería social para manipular a usuarios y obtener información sensible.",
    competencies: [
      "Identificación de vectores de ataque de ingeniería social",
      "Desarrollo de técnicas de manipulación y persuasión",
      "Simulación de ataques de ingeniería social para evaluar la seguridad organizacional",
      "Concienciación y formación en seguridad para mitigar riesgos de ingeniería social"
    ],
    experience: {
      contexts: ["Formación autodidacta", "Laboratorios simulados."],
    },
    certificates: [],
    tools: ["Social-Engineer Toolkit (SET)", "PhishingKit", "Gophish", "Maltego"],
  },
  {
    id: "metasploit-framework",
    name: "Metasploit Framework",
    category: "Security",
    level: 3,
    summary: "Uso del framework Metasploit para la explotación de vulnerabilidades y pruebas de penetración.",
    competencies: [
      "Configuración y uso del framework Metasploit para pruebas de penetración",
      "Identificación y explotación de vulnerabilidades utilizando módulos de Metasploit",
      "Desarrollo de payloads personalizados para explotación",
      "Post-explotación y mantenimiento del acceso utilizando Metasploit",
      "Obtención y uso de meterpreter shells."
    ],
    experience: {
      contexts: ["Formación autodidacta", "Laboratorios simulados.", "HTB", "Labs eJPT"],
    },
    certificates: [],
    tools: ["Metasploit Framework", "msfconsole", "msfvenom", "Meterpreter"],
  },
  // Infrastructure skills
  {
    id: "linux-administration",
    name: "Linux",
    category: "Infrastructure",
    level: 3,
    summary: "Administración de sistemas Linux, incluyendo instalación, configuración y mantenimiento de servidores y servicios.",
    competencies: [
      "Instalación y configuración de distribuciones Linux (Ubuntu, CentOS, Debian)",
      "Gestión de usuarios, permisos y seguridad en sistemas Linux",
      "Administración de servicios y demonios (Apache, Nginx, SSH, FTP)",
      "Automatización de tareas mediante scripting (Bash, Python)",
      "Monitorización y resolución de problemas en sistemas Linux"
    ],
    experience: {
      contexts: ["Laboratorios de integración industrial con sistemas de guerra electrónica.", "Entornos nativos de simulación y pruebas.", "Proyectos personales."],
    },
    certificates: [],
    tools: ["Ubuntu", "CentOS", "Debian", "Bash", "SSH", "Apache", "Nginx", "Docker", "NAS"],
  },
  {
    id: "windows-administration",
    name: "Windows",
    category: "Infrastructure",
    level: 2,
    summary: "Administración de sistemas Windows, incluyendo instalación, configuración y mantenimiento de servidores y servicios.",
    competencies: [
      "Instalación y configuración de sistemas operativos Windows (Windows 10, Windows Server)",
      "Gestión de usuarios, permisos y seguridad en sistemas Windows",
      "Administración de servicios y roles (IIS, Active Directory, DNS)",
      "Automatización de tareas mediante PowerShell",
      "Monitorización y resolución de problemas en sistemas Windows"
    ],
    experience: {
      contexts: ["Entorno corporativo y trabajo en equipo con proyectos de código cerrado.", "Laboratorios de integración industrial con sistemas de guerra electrónica."],
    },
    certificates: [],
    tools: ["Windows 10", "Windows Server", "PowerShell", "Active Directory", "IIS", "DNS", "Hyper-V", "WSL", "Remote Desktop", "SMB"],
  },
  {
    id: "docker-containerization",
    name: "Docker",
    category: "Infrastructure",
    level: 3,
    summary: "Contenerización y orquestación de aplicaciones utilizando Docker para facilitar el despliegue y la gestión de entornos.",
    competencies: [
      "Creación y gestión de contenedores Docker",
      "Desarrollo de Dockerfiles para construir imágenes personalizadas",
      "Orquestación de múltiples contenedores con Docker Compose",
      "Despliegue y gestión de aplicaciones en entornos contenerizados",
      "Optimización y seguridad de contenedores Docker"
    ],
    experience: {
      contexts: ["Entorno corporativo y trabajo en equipo con proyectos de código cerrado.", "Laboratorios de integración industrial con sistemas de guerra electrónica.", "Proyectos personales."],
    },
    certificates: [],
    tools: ["Docker", "Docker Compose", "Docker Hub"],
  },
  {
    id: "kubernetes-orchestration",
    name: "Kubernetes",
    category: "Infrastructure",
    level: 1,
    summary: "Orquestación de contenedores con Kubernetes para despliegue y gestión de aplicaciones escalables.",
    competencies: [
      "Despliegue y gestión de aplicaciones en clústeres Kubernetes",
      "Configuración de pods, servicios y volúmenes en Kubernetes",
      "Escalado automático y gestión de recursos en Kubernetes",
      "Monitorización y resolución de problemas en clústeres Kubernetes",
      "Implementación de políticas de seguridad en Kubernetes"
    ],
    experience: {
      contexts: ["Prácticas universitarias", "Proyectos personales."],
    },
    certificates: [],
    tools: ["Kubernetes", "kubectl", "Minikube", "Helm"],
  },
  // Software skills
  {
    id: "c-programming",
    name: "Programación en C",
    category: "Software",
    level: 3,
    summary: "Programación en C/CVI para herramientas gráficas de escritorio, utilizadas en entornos de integración industrial.",
    competencies: [
      "Desarrollo de aplicaciones GUI con LabWindows/CVI",
      "Manejo de memoria dinámica y estructuras de datos",
      "Interacción con hardware mediante APIs y controladores",
      "Depuración y optimización de código C",
    ],
    experience: {
      contexts: ["Laboratorios de integración industrial con sistemas de guerra electrónica."],
    },
    certificates: [],
    tools: ["LabWindows/CVI", "GCC", "Makefiles", "GBD"],
  },  
  {
    id: "python-programming",
    name: "Programación en Python",
    category: "Software",
    level: 3,
    summary: "Programación en Python para automatización de tareas repetitivas, tanto en desarrollo de software como en ciberseguridad, y desarrollo de scripts de complejidad variada.",
    competencies: [
      "Herramientas automatizadas para pruebas de seguridad",
      "Herramientas de análisis de red y captura de tráfico en nodos embebidos",
      "Scripts de automatización para despliegue y configuración de entornos",
      "Confección y manipulación de datos de prueba",
      "Creación de APIs REST con Flask",
    ],
    experience: {
      contexts: ["Laboratorios de integración industrial con sistemas de guerra electrónica.", "Entornos simulados para pruebas de penetración.", "Proyectos personales."],
    },
    certificates: [],
    tools: ["Python 3", "Scapy", "Requests", "BeautifulSoup", "Paramiko", "pyshark", "Flask"],
  },
  {
    id: "ada-programming",
    name: "Programación en Ada",
    category: "Software",
    level: 4,
    summary: "Programación en Ada para sistemas embebidos y aplicaciones críticas de tiempo real, enfocadas a la guerra electrónica.",
    competencies: [
      "Desarrollo de software seguro, robusto y fiable",
      "Manejo de concurrencia y tareas en Ada",
      "Control de versiones y configuración de proyectos Ada",
      "Instalación y depuración de software ADA en sistemas embebidos",
      "Integración con hardware específico",
      "Compilación nativa y cruzada para arquitecturas embebidas",
    ],
    experience: {
      contexts: ["Laboratorios de integración industrial con sistemas de guerra electrónica.", "Entornos nativos de simulación y pruebas."],
    },
    certificates: [],
    tools: ["GNAT Ada", "GPS (GNAT Programming Studio)", "Makefiles", "GDB"],
  },
  {
    id: "bash-programming",
    name: "Scripting en Bash",
    category: "Software",
    level: 2,
    summary: "Programación en Bash para automatización de tareas repetitivas y administración de sistemas.",
    competencies: [
      "Automatización de tareas de administración de sistemas",
      "Manipulación de archivos y directorios",
      "Gestión y depuración de procesos y servicios",
      "Creación de scripts para despliegue y configuración de entornos",
      "Análisis y procesamiento de logs del sistema",
    ],
    experience: {
      contexts: ["Laboratorios de integración industrial con sistemas de guerra electrónica.", "Entornos nativos de simulación y pruebas."],
    },
    certificates: [],
    tools: ["Bash", "GNU Core Utilities", "sed", "awk", "grep"],
  },
  {
    id: "ts-programming",
    name: "Programación en TypeScript",
    category: "Software",
    level: 1,
    summary: "Programación en TypeScript y JavaScript para desarrollo web y aplicaciones modernas.",
    competencies: [
      "Desarrollo de interfaces de usuario con React y Angular",
      "Manejo de estado y rutas en aplicaciones modernas",
      "Creación de APIs REST con Express.js",
      "Integración con bases de datos NoSQL como MongoDB",
      "Testing y depuración de aplicaciones web",
    ],
    experience: {
      contexts: ["Proyectos personales"],
    },
    certificates: [],
    tools: ["TypeScript", "JavaScript", "React", "Vite", "Node.js", "Express.js", "MongoDB"],
  },
  {
    id: "sql-querying",
    name: "SQL",
    category: "Software",
    level: 3,
    summary: "Consultas SQL para manipulación y análisis de datos en bases de datos relacionales.",
    competencies: [
      "Consultas básicas y avanzadas en SQL",
      "Manipulación de datos con INSERT, UPDATE y DELETE",
      "Creación y gestión de tablas y esquemas de bases de datos",
      "Optimización de consultas para mejorar el rendimiento",
      "Integración de bases de datos SQL con aplicaciones web",
      "Inyección SQL y técnicas de explotación de inputs no sanitizados",
    ],
    experience: {
      contexts: ["HTB", "Labs eJPT", "Proyectos personales"],
    },
    certificates: [{ name: "eLearnSecurity Junior Penetration Tester (eJPT)", issuer: "INE", year: 2024 }],
    tools: ["MySQL", "PostgreSQL", "SQLite", "phpMyAdmin", "DBeaver", "sqlmap"],
  },
  {
    id: "git-version-control",
    name: "Git",
    category: "Software",
    level: 3,
    summary: "Control de versiones y configuración de proyectos Git.",
    competencies: [
      "Gestión de repositorios Git locales y remotos",
      "Ramas, fusiones y resolución de conflictos",
      "Colaboración en equipo con GitHub/GitLab",
      "Flujos de trabajo Git (Git Flow, Forking Workflow)",
      "Etiquetas, versiones congeladas y versiones de lanzamiento",
      "Integración con GitHub Pages para despliegue de sitios web estáticos",
    ],
    experience: {
      contexts: ["Proyectos personales", "Colaboración en proyectos de código abierto"],
    },
    certificates: [],
    tools: ["Git", "GitHub", "GitLab", "GitHub Pages", "GitHub Actions"],
  },
  {
    id: "svn-version-control",
    name: "TortoiseSVN",
    category: "Software",
    level: 4,
    summary: "Control de versiones y configuración de proyectos TortoiseSVN/Subversion.",
    competencies: [
      "Gestión de repositorios SVN locales y remotos",
      "Ramas, fusiones y resolución de conflictos",
      "Colaboración en equipo con repositorios SVN",
      "Flujos de trabajo SVN",
      "Etiquetas, versiones congeladas y versiones de lanzamiento",
      "Administración de permisos y accesos en repositorios SVN",
    ],
    experience: {
      contexts: ["Entorno corporativo y trabajo en equipo con proyectos de código cerrado.", "Administración de repositorios SVN para proyectos de integración industrial."],
    },
    certificates: [],
    tools: ["TortoiseSVN", "Subversion (SVN)", "VisualSVN Server", "SVN Command Line"]
  },
  // Soft skills
  {
    id: "communication",
    name: "Comunicación",
    category: "Soft Skills",
    level: 4,
    summary: "Habilidades de comunicación efectiva, tanto escrita como verbal, para transmitir ideas y colaborar con equipos.",
    competencies: [
      "Comunicación clara y concisa en presentaciones y reuniones",
      "Escucha activa y empatía en interacciones profesionales",
      "Adaptación del estilo de comunicación según la audiencia",
      "Colaboración efectiva en equipos multidisciplinares",
      "Expresión verbal ante grupos y públicos diversos"
    ],
    experience: {
      contexts: ["Entorno de oficina y trabajo en equipo", "Comunicación con clientes nacionales e internacionales.", "Presentaciones académicas y profesionales."],
    },
    certificates: [],
    tools: ["Microsoft Teams", "Zoom", "Slack", "Google Meet"],
  },
  {
    id: "teamwork",
    name: "Trabajo en equipo",
    category: "Soft Skills",
    level: 4,
    summary: "Habilidades de trabajo en equipo efectivo, colaborando con otros para alcanzar objetivos comunes.",
    competencies: [
      "Colaboración y cooperación con compañeros de equipo",
      "Resolución de conflictos y negociación",
      "Contribución activa en reuniones y discusiones de equipo",
      "Adaptabilidad y flexibilidad en entornos de trabajo dinámicos",
      "Fomento de un ambiente de trabajo positivo y productivo",
      "Proactividad en la identificación y resolución de problemas de equipo",
      "Capacidad para pedir y ofrecer ayuda cuando sea necesario"
    ],
    experience: {
      contexts: ["Entorno de oficina y trabajo en equipo", "Proyectos colaborativos en entornos académicos y profesionales.", "Colaboración con equipos internacionales en intervenciones oficiales."],
    },
    certificates: [],
    tools: ["Microsoft Teams", "JIRA"],
  },
  {
    id: "problem-solving",
    name: "Resolución de problemas",
    category: "Soft Skills",
    level: 4,
    summary: "Habilidades para identificar, analizar y resolver problemas de manera efectiva.",
    competencies: [
      "Identificación y definición clara de problemas",
      "Análisis de causas raíz y evaluación de posibles soluciones",
      "Toma de decisiones informadas y basadas en datos",
      "Implementación de soluciones y seguimiento de resultados",
      "Pensamiento crítico y creativo para abordar desafíos complejos",
      "Capacidad para trabajar bajo presión y manejar situaciones imprevistas"
    ],
    experience: {
      contexts: ["Entorno de oficina y trabajo en equipo", "Proyectos colaborativos en entornos académicos y profesionales.", "Colaboración con equipos internacionales en intervenciones oficiales."],
    },
    certificates: [],
    tools: ["Obsidian", "Microsoft Teams", "Excel", "Python"],
  },
  {
    id: "agile-methodologies",
    name: "Metodologías Ágiles",
    category: "Soft Skills",
    level: 3,
    summary: "Experiencia en metodologías ágiles para la gestión de proyectos y desarrollo de software.",
    competencies: [
      "Implementación de prácticas ágiles como Scrum y Kanban",
      "Participación en ceremonias ágiles: reuniones diarias, planificación de sprints, revisiones y retrospectivas",
      "Colaboración efectiva en equipos multifuncionales",
      "Adaptación a cambios y prioridades en entornos dinámicos",
      "Uso de herramientas ágiles para la gestión de proyectos"
    ],
    experience: {
      contexts: ["Entorno corporativo y trabajo en equipo con proyectos de código cerrado.", "Proyectos colaborativos en entornos académicos y profesionales."],
    },
    certificates: [],
    tools: ["JIRA", "Trello", "Microsoft Teams", "Excel"],
  },
  {
    id: "proactivity",
    name: "Proactividad",
    category: "Soft Skills",
    level: 5,
    summary: "Espíritu proactivo para anticipar necesidades, identificar oportunidades y actuar de manera autónoma en entornos cambiantes.",
    competencies: [
      "Anticipación de problemas y necesidades futuras",
      "Iniciativa para proponer mejoras y soluciones",
      "Capacidad para trabajar de manera autónoma y tomar decisiones informadas",
      "Adaptabilidad y flexibilidad en entornos dinámicos",
      "Fomento de una cultura de mejora continua"
    ],
    experience: {
      contexts: ["Entorno corporativo y trabajo en equipo con proyectos de código cerrado.", "Proyectos colaborativos en entornos académicos y profesionales.", "Proyectos personales."],
    },
    certificates: [],
    tools: [],
  },
];


