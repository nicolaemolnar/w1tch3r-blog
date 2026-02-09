---
title: "Instalación de un Entorno de Hacking para Hack The Box"
date: "2026-02-09"
tags: ["HTB", "Kali Linux", "Parrot OS", "Pentesting"]
summary: "Guía práctica para instalar Kali Linux y/o Parrot OS y dejarlos listos para atacar máquinas de Hack The Box desde cero."
draft: false
---
## 1. Introducción

En este post veremos cómo instalar y preparar Kali Linux y/o Parrot OS para trabajar cómodamente con Hack The Box, cubriendo un **perfil mínimo**: funcional, ligero y rápido de montar. En el futuro, publicaré cuáles son las herramientas que forman para mi un **perfil completo**, un entorno profesional para trabajar como pentester.

El contenido busca formar una guía práctica que sirva de referencia para quienes quieran instalar un entorno de laboratorio orientado a HTB, con recomendaciones de recursos, configuraciones y tips para evitar problemas comunes. No se trata de una guía de instalación genérica de Kali o Parrot, sino de un enfoque específico para el uso en Hack The Box.

### 1.1. Comparativa entre ambos sistemas

Kali Linux y Parrot OS son dos distribuciones basadas en Debian orientadas a la seguridad ofensiva y muy utilizadas en plataformas de CTF como Hack The Box. A nivel funcional, ambas permiten realizar exactamente los mismos ataques y resolver las mismas máquinas, por lo que la elección no condiciona el aprendizaje ni el rendimiento en HTB. Sin embargo, sí existen diferencias relevantes en cuanto a filosofía, consumo de recursos y experiencia de uso que conviene conocer antes de decidir.

Kali Linux está concebido como un sistema de **pentesting especializado**, pensado para disponer desde el primer momento de un gran número de herramientas listas para usar. Esta aproximación reduce al mínimo la configuración inicial, pero también implica un sistema más cargado, con más servicios y paquetes instalados por defecto. Es habitual en entornos formativos, certificaciones y documentación técnica, lo que facilita encontrar guías, writeups y soluciones reproducibles.

Parrot OS, por su parte, adopta una aproximación más **ligera y modular**. Aunque su edición Security incluye las herramientas más habituales para hacking y auditoría, el sistema base es más contenido, permitiendo al usuario decidir qué instalar y cuándo. Esto se traduce en un menor consumo de recursos y en un entorno más controlado, especialmente interesante cuando se trabaja en máquinas virtuales con limitaciones de CPU o memoria.

Desde el punto de vista del rendimiento, Parrot OS suele comportarse mejor en equipos modestos o cuando se ejecutan varias máquinas virtuales de forma simultánea. Kali Linux, aunque perfectamente utilizable en estos escenarios, agradece una asignación de recursos algo mayor para trabajar con comodidad, especialmente si se utilizan entornos gráficos completos y herramientas pesadas.

La siguiente tabla resume las diferencias más relevantes para un uso orientado a Hack The Box:
#### Tabla 1.1.1 — Diferencias Kali vs Parrot en HTB

| Característica            | [Kali Linux](https://www.kali.org/get-kali)                         | [Parrot OS](https://parrotsec.org/docs/introduction/download-parrot)                          |
|--------------------------|------------------------------------|------------------------------------|
| **Enfoque principal**        | Pentesting especializado           | Seguridad + sistema ligero         |
| **Consumo de recursos**      | Medio / Alto                       | Bajo / Medio                       |
| **Herramientas por defecto** | Muy amplio                         | Amplio pero más contenido          |
| **Configuración inicial**    | Mínima                             | Algo mayor                         |
| **Estabilidad**              | Cambios frecuentes                 | Más conservador                    |
| **Documentación**            | Muy abundante                      | Abundante                          |
| **Uso típico en HTB**        | Estándar de facto                  | Alternativa plenamente válida      |

Desde una perspectiva práctica, la elección entre Kali Linux y Parrot OS no debería basarse en *“cuál es mejor para hackear”*, sino en qué sistema se adapta mejor al entorno de trabajo y al hardware disponible. Para usuarios que comienzan o que quieren replicar fácilmente writeups y laboratorios, Kali Linux suele ser la opción más directa. Para quienes prefieren un sistema más ligero y controlado, Parrot OS puede resultar más cómodo.

En cualquier caso, el sistema operativo es solo una herramienta más. En Hack The Box, el verdadero factor diferencial sigue siendo la metodología, la capacidad de análisis y la constancia en la práctica.

### 1.2. Requisitos previos

Tanto si eliges Kali como Parrot puedes montar un sistema muy minimalista (sin entorno gráfico o conectandote vía SSH), pero en Hack The Box lo normal es trabajar con entorno gráfico, navegador, proxy (Burp Suite), notas, varias terminales y herramientas que consumen recursos. Por eso, más que fijarte en el mínimo absoluto, lo relevante es el **mínimo práctico** para no sufrir.

En **Kali Linux**, la documentación oficial indica que en el extremo más bajo puede funcionar como servidor SSH sin escritorio con **128 MB de RAM (512 MB recomendado) y 2 GB de disco**, pero si instalas el escritorio Xfce y el metapaquete `kali-linux-default` recomiendan **al menos 2 GB de RAM y 20 GB de disco**. 
Además, el propio equipo de Kali sugiere que, por tamaño de instalaciones y margen, **~60 GB** de disco te permiten “cualquier instalación” con espacio extra.

En **Parrot OS**, su documentación de virtualización indica que puede arrancar con **512 MB de RAM y 2 cores**, pero que para Parrot Security/Home se recomienda **al menos 2 GB de RAM y 2 cores** para una experiencia adecuada. Para el almacenamiento, su guía de instalación especifica mínimos distintos según edición: **Home: 20 GB**, **Security: 40 GB**. Y, en su página de descarga de Parrot Security, directamente recomiendan **mínimo 4 GB de RAM** para ir fluido en multitarea (que encaja bastante con un flujo real de HTB).

#### Tabla 1.2.1 — Requisitos oficiales (mínimos y recomendados)

| Sistema | Mínimo absoluto (oficial) | Recomendación oficial para escritorio/uso cómodo |
|---|---|---|
| **Kali Linux** | 128 MB RAM (512 MB recomendado) + 2 GB disco (sin desktop, modo SSH) | 2 GB RAM + 20 GB disco (Xfce + `kali-linux-default`) |
| **Parrot OS** | 512 MB RAM + 2 cores (arranca) | 2 GB RAM + 2 cores (recomendado) / 4 GB RAM recomendado para Parrot Security multitarea |

#### Tabla 1.2.2 — Disco recomendado según edición/instalación

| Sistema/edición | Mínimo oficial de disco | Nota práctica |
|---|---:|---|
| **Kali (Xfce + `kali-linux-default`)** | 20 GB | Si vas a guardar wordlists, proyectos y varios targets, 40–60 GB evita quedarte corto; Kali sugiere ~60 GB para “cualquier instalación”. |
| **Parrot Home** | 20 GB | Suficiente si instalas pocas herramientas extra |
| **Parrot Security** | 40 GB | Más realista para HTB si vas a añadir tooling/wordlists |

En resumen: si tu objetivo es HTB con VM y entorno gráfico, **2 GB RAM / 2 cores es el suelo**, pero lo razonable para trabajar sin fricción suele ser **8 GB RAM y 40–60 GB de disco**, especialmente si vas a tirar de varias terminales, escáneres en paralelo y almacenar recursos localmente (wordlists, repositorios, salidas de herramientas).

### 1.3. Virtualización y software necesario (hipervisor)

Para Hack The Box, la opción más recomendable (especialmente si estás empezando) es trabajar sobre **máquinas virtuales**. Esto te proporciona aislamiento, snapshots para volver atrás cuando rompes algo y la posibilidad de tener varios entornos (Kali/Parrot/Windows) sin ensuciar tu sistema principal. Lo único “imprescindible” es un **hipervisor** (VirtualBox o VMware) y tener la **virtualización por hardware** activada en BIOS/UEFI (Intel VT-x / AMD-V).

En Windows es importante tener en cuenta los conflictos típicos: si tienes activado **Hyper-V / WSL2 / Virtual Machine Platform**, VirtualBox puede ir peor o directamente no arrancar ciertas VMs según la configuración que apliques. VMware suele ser más tolerante, pero también puede verse afectado. Por ejemplo, si notas que la VM va lenta o no te deja habilitar 64-bit, el primer sospechoso es siempre la virtualización desactivada o un conflicto de “stack” de virtualización.

A nivel de software, necesitas:
- Un hipervisor ([VirtualBox](https://www.virtualbox.org/wiki/Downloads) o [VMware Workstation / Player](https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion)).
- La imagen del sistema (ISO o VM preconstruida).
- Opcional pero muy recomendable: **Guest Additions / VMware Tools** para tener resolución dinámica, portapapeles bidireccional y carpetas compartidas, que facilitan mucho la interacción con la MV.

#### 1.3.1. Comparativa rápida de hipervisores

| Aspecto | VirtualBox | VMware Workstation / Player |
|---|---|---|
| **Coste** | Gratis | Player suele ser gratis para uso personal; Workstation es más completo |
| **Rendimiento (típico)** | Correcto, pero sensible a conflictos con Hyper-V | Suele ir más fino en Windows con cargas altas |
| **Integración (copiar/pegar, carpetas)** | Buena con Guest Additions | Muy buena con VMware Tools |
| **Snapshots** | Sí | Sólo en Workstation |
| **Red (NAT/Bridge/Host-only)** | Completo | Completo |

Como recomendación práctica, para un entorno de laboratorio orientado a HTB, VirtualBox suele ser suficiente y es la opción más común en tutoriales y writeups. VMware puede ofrecer una experiencia más fluida en algunos casos, especialmente si vas a trabajar con varias VMs simultáneamente o si tu host es Windows, pero el coste y la configuración pueden ser un factor a considerar.

#### 1.3.2. Ajustes recomendados para HTB (VM)

Sin entrar aún en instalación, estos ajustes te evitan el 80% de los problemas que me he podido encontrar al crear máquinas de hacking:

- **CPU**: 2 cores (mínimo práctico). Si tu host lo permite, 4 cores mejora multitarea (navegador+terminales+fuerza bruta).
- **RAM**: 4 GB como base cómoda; 8 GB es lo que yo recomiendo para no sufrir en multitarea real (navegador + Burp + varias terminales).
- **Disco**: dinámico, 40–60 GB si vas a guardar wordlists, repositorios, salidas y notas.
- **Gráficos**: habilita la aceleración 3D si el hipervisor lo permite (no es obligatorio, pero mejora fluidez del escritorio y la comodidad al trabajar).
- **Portapapeles**: bidireccional (muy útil para copiar payloads/comandos/flags).
- **Carpetas compartidas**: opcionalmente, un directorio `~/HTB` compartido con el host para notas y ficheros es muy útil para organizar tu trabajo y acceder a él sin necesidad de arrancar la MV.

#### 1.3.3. Ajustes básicos de red

Para HTB casi siempre te valen dos configuraciones de red:
- **NAT**: la VM tiene **internet**, para poder actualizarla, y tú te conectas a HTB por VPN desde dentro de la VM. Es la opción más **simple**.
- **Bridge**: la VM aparece como otro equipo en tu **red local**. Útil en labs domésticos, pero no suele aportar nada extra para HTB y puede dar más fricción en algunas redes.

> Mi recomendación práctica: empieza con **NAT**, y si en algún punto necesitas algo más (labs locales, pivots entre VMs), ya cambias a Bridge/Host-Only (*Buena suerte*).

---

## 2. Preparación del entorno

### 2.1. Elección del hipervisor

Antes de instalar Kali Linux o Parrot OS, necesitas elegir un **hipervisor**: el software que se encargará de ejecutar la máquina virtual donde correrá tu sistema de hacking. Las dos opciones más usadas y más prácticas para HTB son **VirtualBox** y **VMware**.

Para HTB, ambas permiten ejecutar las VMs con **NAT/bridge**, tomar **snapshots** y **asignar recursos** de CPU/RAM de forma sencilla. Sin embargo, existen diferencias que pueden influir en tu experiencia:

| Hipervisor | Costo | Integración con host | Rendimiento típico | Snapshots | Comentario |
|------------|--------|----------------------|----------------------|-----------|------------|
| **VirtualBox** | Gratis | Buena (Guest Additions) | Adecuado | Sí | Muy popular para entornos de aprendizaje y tutoriales |
| **VMware Workstation / Player** | Player gratis/Workstation de pago | Muy buena (VMware Tools) | Suele ir más fluido en Windows | Sí (Workstation destaca) | Suele gestionar mejor cargas intensivas y múltiples VMs |

- **VirtualBox** es gratuito y suficiente para la mayoría de escenarios de HTB: fácil de usar, buena compatibilidad y snapshots integrados.  
- **VMware** tiene una integración más pulida, especialmente en Windows, y en Workstation su manejo de snapshots y rendimiento suele sentirse más sólido si vas a trabajar con varias VMs simultáneamente.

Sea cual sea tu elección, asegúrate de **habilitar virtualización por hardware** (Intel VT-x o AMD-V) en BIOS/UEFI antes de arrancar VMs; sin esto muchas distribuciones no permitirán usar modo 64 bits ni arrancar adecuadamente.

### 2.2. Descarga de imágenes oficiales

#### 2.2.1. Imágenes de Kali Linux

La página oficial de Kali Linux ofrece diferentes opciones de [descarga](https://www.kali.org/get-kali/):  
- **ISO de instalación (“Installer”)** para instalar desde cero en una VM o en hardware real.  
- **Live ISO** que permite ejecutar el sistema sin tener que instalar nada, útil también para USB bootables o pruebas rápidas. Ten en cuenta que lo que instales en modo Live no se guarda tras reiniciar, a menos que configures un sistema de persistencia.  
- **Imágenes pre-construidas para VirtualBox/VMware** que hace tiempo venían ya listas para importar y ejecutar directamente en tu hipervisor sin pasar por el proceso de instalación tradicional. Sin embargo, recientemente han dejado de estar disponibles.

> Nota: siempre descarga Kali desde la web oficial y verifica la suma de comprobación (SHA256) para asegurar la integridad de la imagen. 

#### 2.2.2. Imágenes de Parrot OS

En la web oficial de Parrot OS también puedes elegir entre varias [ediciones](https://parrotsec.org/docs/introduction/download-parrot) según el caso de uso:  
- **Live**: ejecuta el sistema directamente desde USB o ISO sin instalarlo.  
- **Virtual**: versiones optimizadas para correr dentro de máquinas virtuales (VirtualBox, VMware, UTM).  
- **Ediciones especializadas**: orientadas a seguridad (Security), uso diario (Home), IoT u otros entornos. 

La edición **Virtual** es la recomendada si quieres empezar rápido con Parrot en HTB, ya que está optimizada para el funcionamiento en entornos virtualizados sin necesidad de perder tiempo con configuraciones adicionales tras la importación de la VM.

> Nota: al igual que con Kali, descarga siempre desde la web oficial y verifica la suma de comprobación (SHA256) para garantizar la integridad de la imagen.

---

## 3. Instalación del sistema operativo

### 3.1. Instalación de Kali Linux

En este apartado se describe la instalación de Kali Linux en una **máquina virtual**, partiendo de cero y asumiendo un uso orientado a Hack The Box. El proceso es prácticamente idéntico en VirtualBox y VMware, a diferencia de nombres de menús u otras opciones concretas.

#### 3.1.1. Creación de la máquina virtual

Una vez instalado el hipervisor, el primer paso es crear una nueva máquina virtual y asignarle recursos adecuados. Estos son los parámetros recomendados para Kali Linux en HTB:

- **Tipo de sistema**: Linux
- **Versión**: Debian (64-bit)
- **CPU**: 2 cores (4 si el equipo anfitrión lo permite)
- **RAM**: 4 GB como base cómoda
- **Disco**: 40–60 GB, formato dinámico
- **Red**: NAT (suficiente para HTB)
- **Gráficos**: activar aceleración 3D si está disponible

Si utilizas una **imagen pre-construida**, este paso se reduce a importar la VM y revisar que los recursos asignados sean correctos antes del primer arranque.

#### 3.1.2. Instalación paso a paso

Usando una **imagen Installer ISO**, es suficiente con seguir los siguientes pasos:

1. Arranca la VM con la ISO de Kali Linux.
2. Selecciona **Graphical Install**.
3. Configura idioma, región y teclado.
4. Configura la red (DHCP suele ser suficiente).
5. Define usuario y contraseña (no trabajar como root permanente).
6. Particionado:
   - Opción recomendada: *Guided – use entire disk*
   - Esquema: *All files in one partition*
7. Selecciona el entorno de escritorio:
   - **Xfce** es la opción más ligera y práctica para VM.
8. Instala el cargador de arranque (GRUB) en el disco principal.
9. Finaliza la instalación y reinicia la VM.

Tras el primer arranque, ya tendrás un Kali Linux funcional con entorno gráfico.

#### 3.1.3. Configuración inicial del sistema

Antes de empezar a trabajar con Hack The Box, conviene realizar una configuración básica del sistema para evitar problemas posteriores.

**Actualización completa del sistema**:
```bash
sudo apt update && sudo apt full-upgrade -y
```
Instalación de herramientas base adicionales (si no están presentes):
```bash
sudo apt install -y curl wget git net-tools
```

**Guest Additions / VMware Tools:**

Instala las herramientas de integración del hipervisor para mejorar la experiencia de uso, concretamente:

- Resolución dinámica: la VM ajusta su resolución automáticamente al tamaño de la ventana.

- Mejor rendimiento gráfico: mejora la fluidez del escritorio y la experiencia general.

- Portapapeles bidireccional: permite copiar y pegar entre el host y la VM, muy útil para transferir comandos, payloads o flags sin necesidad de usar archivos intermedios.

- Carpetas compartidas: facilita el intercambio de archivos entre el host y la VM, ideal para organizar notas, wordlists o resultados de herramientas sin necesidad de arrancar la MV.

**Comprobaciones iniciales:**

- Acceso a internet desde la VM

- Resolución DNS correcta

- Espacio en disco suficiente

- Usuario con permisos sudo

En este punto, Kali Linux ya está correctamente instalado y listo para pasar a la **configuración específica para Hack The Box** (VPN, herramientas y perfiles de uso), que se abordará en los siguientes apartados.


### 3.2. Instalación de Parrot OS

En este apartado se describe la instalación de **Parrot OS** en una máquina virtual orientada a Hack The Box. Igual que con Kali, el proceso es muy similar en VirtualBox y VMware. Lo importante es elegir bien la edición y dejar el sistema con una base sólida antes de instalar herramientas más específicas.

#### 3.2.1. Creación de la máquina virtual

Parrot OS suele funcionar especialmente bien en VM por su enfoque más ligero, pero aun así conviene asignar recursos suficientes para el trabajo diario con HTB. Por ello, hemos recopilado los siguientes parámetros recomendados:

- **Tipo de sistema**: Linux  
- **Versión**: Debian (64-bit)
- **CPU**: 2 cores (4 si puedes)
- **RAM**: 4 GB (2 GB puede arrancar, pero irás un poquillo justo)
- **Disco**:
  - Parrot **Home**: 30–40 GB recomendado
  - Parrot **Security**: 40–60 GB recomendado
- **Red**: NAT
- **Gráficos**: activar aceleración 3D si está disponible

Si usas la **imagen “Virtual”** oficial (preparada para VirtualBox/VMware), el paso de creación se simplifica: sólo necesitas importar la VM, revisar la  CPU/RAM/disco y arrancar el sistema. Si usas ISO Installer/Live, puedes creas la VM como cualquier Debian 64-bit y montar la ISO directamente.

#### 3.2.2. Instalación paso a paso

##### Opción A — Instalación desde ISO (Installer / Live)
1. Arranca la VM con la ISO de Parrot OS.
2. Selecciona **Install** (o “Install Parrot” desde el entorno Live).
3. Configura idioma, región y teclado.
4. Configura la red (DHCP y hostname).
5. Crea usuario y contraseña.
6. Particionado:
   - Recomendado: *Guided – use entire disk*
   - Esquema: *All files in one partition*
7. Selección de escritorio:
   - Elige un entorno ligero si tu equipo va justo (MATE o Xfce).
8. Instala el cargador de arranque (GRUB) en el disco principal.
9. Finaliza la instalación y reinicia.

##### Opción B — Imagen “Virtual” (pre-construida)
1. Importa el archivo de VM (VirtualBox/VMware).
2. Ajusta recursos (RAM/CPU/disco) si no te valen los recomendados por defecto.
3. Arranca y realiza la configuración inicial.
4. Cambia credenciales por defecto de la máquina.

En ambos casos, tras el primer arranque tendrás Parrot listo para actualizar y personalizar.

#### 3.2.3. Configuración inicial del sistema

Una vez dentro, la prioridad es actualizar y dejar listo el sistema para el trabajo diario.

**Actualización completa del sistema**:
```bash
sudo parrot-upgrade
```
**Paquetes base útiles**:
```bash
sudo apt install -y curl wget git net-tools
```

**Integración con el hipervisor:**

Instala las herramientas de integración del hipervisor para mejorar la experiencia de uso, concretamente:

- Resolución dinámica: la VM ajusta su resolución automáticamente al tamaño de la ventana.

- Mejor rendimiento gráfico: mejora la fluidez del escritorio y la experiencia general.

- Portapapeles bidireccional: permite copiar y pegar entre el host y la VM, muy útil para transferir comandos, payloads o flags sin necesidad de usar archivos intermedios.

- Carpetas compartidas: facilita el intercambio de archivos entre el host y la VM, ideal para organizar notas, wordlists o resultados de herramientas sin necesidad de arrancar la MV.

**Comprobaciones iniciales**

- Acceso a internet desde la VM

- DNS resuelve correctamente

- Usuario con permisos sudo funciona

- Espacio en disco suficiente para herramientas/wordlists

> Con esto, Parrot OS queda listo para su uso en tareas de ciberseguridad ofensiva.

---

## 4. Perfil mínimo

### 4.1. Objetivo

El objetivo del perfil mínimo es muy simple: que puedas empezar en Hack The Box **hoy**, con un entorno limpio y funcional, sin instalar demasiadas herramientas de nicho que no necesitas en el día a día.

Este perfil cubre lo necesario para la mayoría de máquinas fáciles/medias:
- Enumerar servicios y versiones.
- Encontrar contenido web y rutas comunes.
- Ataques sencillos de fuerza bruta y cracking de contraseñas.
- Extraer información y automatizar tareas básicas con scripts.

Además, al mantener el sistema ligero:
- Reducimos puntos de fallo (menos dependencias rotas).
- Aprendemos a fondo un conjunto pequeño de herramientas.
- Instalamos las herramientas a medida que las necesitamos, lo que mejora la retención y el aprendizaje incremental.

Si más adelante necesitas un set de herramientas más avanzado (ActiveDirectory, reversing, post-explotación compleja, etc.), en el futuro publicaré una guía que cubra un perfil completo, con todas las herramientas necesarias para el pentesting avanzado.

### 4.2. Herramientas esenciales

La idea es cubrir tres bloques: **enumeración**, **explotación básica** y **utilidades comunes**. Todo lo que aparece aquí es estándar, estable y con buen soporte en Kali/Parrot.

#### 4.2.1. Enumeración

##### nmap (imprescindible)  
Escaneo de puertos, detección de servicios y scripts NSE. Base de cualquier workflow.

:u[Instalación]:
```bash
sudo apt install -y nmap
```

:u[Uso básico]:
```bash
## Descubrimiento rápido
nmap -Pn -sS -T4 <IP>

## Escaneo completo de puertos + detección de servicios
nmap -Pn -p- -T4 <IP>
nmap -Pn -sC -sV -p <PUERTOS> <IP>
```

##### gobuster (descubrimiento web)
Escaneo de directorios y archivos en aplicaciones web. Muy útil para encontrar rutas ocultas.

:u[Instalación]:
```bash
sudo apt install -y gobuster
```

:u[Uso básico]:
```bash
gobuster dir -u http://<IP>/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

##### wfuzz (fuzzing web)
Fuzzer de aplicaciones web para descubrir parámetros, rutas, subdominios, etc. Personalmente, lo utilizo como mi alternativa preferida a gobuster, que es más conocido.

:u[Instalación]:
```bash
sudo apt install -y wfuzz
```

:u[Uso básico]:
```bash
wfuzz -c -z file,/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt --hc 404 http://<IP>/FUZZ
```

##### whatweb (detección de tecnologías web)
Identificación de tecnologías, frameworks y CMS en aplicaciones web desde la terminal. Complementa a nmap y gobuster.

:u[Instalación]:
```bash
sudo apt install -y whatweb
```

:u[Uso básico]:
```bash
whatweb http[s]://<IP>/
```

> Alternativa gráfica: Wappalyzer es una extensión de navegador que detecta tecnologías web en tiempo real. Muy útil para complementar la información obtenida con nmap/whatweb.

##### enum4linux (enumeración de SMB)
Herramienta de enumeración de servicios SMB para obtener información de usuarios, grupos, shares y políticas en máquinas Windows.

:u[Instalación]:
```bash
sudo apt install -y enum4linux
```

:u[Uso básico]:
```bash
enum4linux -A <IP>
```

#### 4.2.2. Explotación básica
En la fase de explotación básica, el objetivo es tener a mano herramientas que permitan aprovechar vulnerabilidades comunes sin necesidad de configuraciones complejas o entornos específicos. Concretamente, vamos a instalar herramientas comunes que complementen a los exploits específicos que un pentester encontrará en repositorios y bases de datos de exploits.

##### hydra (fuerza bruta de servicios)
Herramienta de fuerza bruta para servicios como SSH, FTP, RDP, SMB, etc. Esencial para ataques de credenciales.

:u[Instalación]:
```bash
sudo apt install -y hydra
```

:u[Uso básico]:
```bash
hydra -L users.txt -P passwords.txt ssh://<IP>
```

##### john (cracking de contraseñas)
Herramienta de cracking de contraseñas para hashes obtenidos en la fase de enumeración (contraseñas de Windows, Linux, etc.). Muy útil para aprovechar información filtrada o hashes obtenidos.

:u[Instalación]:
```bash
sudo apt install -y john
```

:u[Uso básico]:
```bash
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt

## Fuerza bruta sobre hashes no estándar (ejemplo con zip)
zip2john secret.zip > zip_hashes.txt
john --wordlist=/usr/share/wordlists/rockyou.txt zip_hashes.txt
```

##### hashcat (cracking de contraseñas con GPU)
Herramienta de cracking de contraseñas que aprovecha la potencia de la GPU para acelerar el proceso. Es especialmente útil para hashes complejos o cuando se dispone de hardware compatible.

:u[Instalación]:
```bash
sudo apt install -y hashcat
```

:u[Uso básico]:
```bash
hashcat -m 0 -a 0 -o cracked.txt hashes.txt /usr/share/wordlists/rockyou.txt
```

> Para realmente aprovechar la potencia de la GPU, es necesario configurar correctamente los drivers y asegurarse de que hashcat reconoce el hardware. En algunos casos, puede ser necesario instalar versiones específicas de drivers o utilizar contenedores Docker optimizados para cracking. Si estás interesado, échale un vistazo a esta [guía de configuración](https://icandothese.com/docs/tech/pentesting/topics/wireless/hashcat_gpu/) para más detalles sobre configuración avanzada.

##### netcat 
Herramienta de red versátil para conexiones TCP/UDP, transferencia de archivos, creación de reverse shells, etc. Esencial para la fase de explotación y post-explotación.

:u[Instalación]:
```bash
sudo apt install -y netcat
```

:u[Uso básico]:
```bash
## Escuchar en un puerto
nc -lvp 4444

## Conectar a un servicio
nc <IP> 80
```

##### sqlmap (explotación de SQLi)
Herramienta de automatización para la detección y explotación de vulnerabilidades de inyección SQL en aplicaciones web. Muy útil para atacar máquinas con servicios web vulnerables.

:u[Instalación]:
```bash
sudo apt install -y sqlmap
```

:u[Uso básico]:
```bash
sqlmap -u "http://<IP>/vulnerable.php?id=1" --batch --dbs
```

##### Metasploit Framework (explotación general)
Framework de explotación que incluye una amplia colección de exploits, payloads y módulos para diferentes plataformas y servicios. Es especialmente útil para ataques rápidos y para aprender sobre explotación en general.

:u[Instalación]:
```bash
sudo apt install -y metasploit-framework
```

:u[Uso básico]:
```bash
msfconsole
```
> Dentro de msfconsole, puedes buscar exploits, configurar payloads y lanzar ataques de forma interactiva. Es una herramienta muy potente, pero también puede ser un poco abrumadora al principio. Da para otra guía completa, así que recomiendo tenerla instalada y abordarla con calma una vez te sientas cómodo con las herramientas más básicas.

#### 4.2.3. Utilidades comunes
Además de las herramientas específicas de enumeración y explotación, es importante tener a mano algunas utilidades comunes que facilitan el trabajo diario en ciberseguridad ofensiva (sobre todo en HTB):

##### curl/wget (descarga de recursos)
Herramientas de línea de comandos para descargar archivos, interactuar con APIs y realizar peticiones HTTP. Son esenciales para obtener recursos, descargar exploits o interactuar con servicios web.

:u[Instalación]:
```bash
sudo apt install -y curl wget
```

:u[Uso básico]:
```bash
## Descargar un archivo
wget http://example.com/file.txt

## Realizar una petición HTTP
curl -I http://<IP>/

## Interactuar con una API
curl -X POST -d "username=admin&password=pass" http://<IP>/login
```

##### python3 + pip (entorno de scripting)
Python es el lenguaje de scripting que más utilizo en ciberseguridad ofensiva, tanto para escribir exploits personalizados como para automatizar tareas. Tener un entorno de Python configurado es fundamental.

:u[Instalación]:
```bash
sudo apt install -y python3 python3-pip
```

:u[Uso básico]:
```bash
## Verificar instalación
python3 --version

## Instalar una librería (ejemplo: requests)
pip3 install requests
```

> Como ejemplo típico de uso, suelo usar mucho el modulo http.server de Python para montar un servidor web rápido y servir payloads o archivos desde mi máquina local hacia la máquina objetivo: `python3 -m http.server 8080`.

##### jq (procesamiento de JSON)
Herramienta de línea de comandos para procesar y manipular datos en formato JSON. Es especialmente útil para trabajar con APIs, analizar respuestas de servicios web o procesar salidas de herramientas que generan JSON, que normalmente serían difíciles de interpretar en una terminal.

:u[Instalación]:
```bash
sudo apt install -y jq
```

:u[Uso básico]:
```bash
## Procesar una respuesta JSON
curl -s http://<IP>/api/data | jq '.results[] | {id: .id, name: .name}'
```

##### build-essential (compiladores y herramientas de desarrollo)
Paquete que incluye compiladores y herramientas necesarias para compilar código fuente. Es útil para compilar exploits personalizados, herramientas de terceros o incluso para tareas de post-explotación que requieran compilar código en la máquina objetivo.

:u[Instalación]:
```bash
sudo apt install -y build-essential
```


#### 4.2.4. Instalación AllInOne 
Si prefieres una instalación rápida y no quieres pararte a elegir entre las opciones que he propuesto, aquí tienes un comando que instala un conjunto de herramientas muy completo para HTB, cubriendo tanto el perfil mínimo como algunas herramientas del perfil completo. Ten en cuenta que esto instalará muchas herramientas que quizás no uses al principio, pero te dejará un entorno listo para casi cualquier máquina de HTB.

```bash
sudo apt update && sudo apt install -y nmap gobuster wfuzz whatweb enum4linux hydra john hashcat netcat sqlmap metasploit-framework curl wget python3 python3-pip jq build-essential
```


### 4.3. Configuración para Hack The Box

La forma más simple (y la más recomendada) de usar Hack The Box desde una VM es:

1) La VM tiene internet mediante **NAT** (VirtualBox).  
2) Te conectas a HTB **desde dentro de la VM** usando la VPN.  
3) Verificas que puedes llegar a la red 10.10.X.X.

A continuación se describe el flujo completo en VirtualBox.

#### 4.3.1. Preparar la red en VirtualBox (NAT)

En VirtualBox, abre la configuración de tu máquina virtual:

**Settings → Network → Adapter 1**
- ✅ Enable Network Adapter
- Attached to: **NAT**
- Advanced → Adapter Type: (deja el que venga por defecto si no sabes cuál)
- ✅ Cable connected

Arranca la VM y comprueba que tienes salida a internet:

```bash
ping -c 3 1.1.1.1
ping -c 3 google.com
```
Si no tienes internet, revisa la configuración de red y asegúrate de que la virtualización por hardware está activada en BIOS/UEFI. Si ambas responden, ahora comprobamos que la resolución DNS funciona correctamente:

```bash
getent hosts hackthebox.com
```

#### 4.3.2. Conectarse a HTB desde la VM
Para poder conectarte a HTB desde la VM, necesitas descargar el archivo de configuración de la VPN desde tu cuenta de HTB y luego usar OpenVPN para establecer la conexión. Para ello, sigue los siguientes pasos:

1. Entra en tu perfil y ve a la sección de VPN / Access (según el diseño actual).
2. Elige el servidor/región que prefieras (normalmente el más cercano a tu ubicación, en nuestro caso EUWest).
3. Descarga el archivo de configuración (normalmente un `.ovpn`). Puedes elegir tcp o udp indiferentemente, aunque yo suelo utilizar udp para servicios de streaming o que requieran baja latencia, y tcp para conexiones más estables en redes con restricciones.
4. Copia el archivo `.ovpn` a tu máquina virtual mediante carpetas compartidas, un pendrive compartido o simplemente descargandolo desde la VM.
5. Si no tienes `openvpn` instalado, puedes conseguirlo con `sudo apt install -y openvpn`. Si no estás seguro de si lo tienes, prueba a ejecutar `openvpn --version` para verificarlo.
6. Conéctate a la VPN usando el siguiente comando (reemplaza `your_vpn_config.ovpn` por el nombre de tu archivo):
```bash
sudo openvpn ~/htb/misc/your_vpn_config.ovpn
```
#### 4.3.3. Verificar la conexión a HTB
Si todo va bien, deberías ver mensajes indicando que la conexión se ha establecido correctamente. Es importante que no cierres la terminal donde estás ejecutando OpenVPN, ya que si lo haces, se desconectará la VPN.

Para verificar que estás conectado a la red de HTB, puedes comprobar que existe una interfaz de red nueva (normalmente `tun0`) y que tu MV tiene una IP en el rango de HTB (10.10.X.X):
```bash
ip addr show tun0
```


Como consejo, cada vez que arranques una máquina de HTB, asegúrate de que la VPN está activa y que puedes llegar a la red de HTB (haciendo ping al objetivo) antes de empezar a enumerar o atacar. Esto te ahorrará muchos dolores de cabeza por problemas de conectividad.

---

## 5. Organización del trabajo
Una vez que tienes tu entorno listo y conectado a HTB, es fundamental mantener una buena organización de tu trabajo para ser eficiente y no perder información valiosa. En este apartado se ofrecen recomendaciones sobre cómo estructurar tus directorios, gestionar notas y evidencias, y mantener snapshots de tu máquina virtual para poder volver atrás si algo sale mal.

### 5.1. Estructura de directorios recomendada
Tener una estructura de directorios clara y consistente te ayudará a mantener tu trabajo organizado y a encontrar rápidamente la información que necesitas. Aquí tienes una estructura de ejemplo que puedes adaptar a tus necesidades:

```
HTB/
├── Machines/
│   ├── Done/
│   ├── InProgress/
│   └── ToDo/
|       └── Example/
|           ├── Enum/
|           ├── Exploits/
|           └── Results/
├── Notes/
├── Wordlists/
├── Scripts/
├── Tools/
├── Misc/
└── Reports/
```
- **Machines**: Aquí puedes organizar las máquinas de HTB según su estado (ToDo, InProgress, Done). Dentro de cada máquina, puedes tener subdirectorios para enumeración, exploits y resultados.
- **Notes**: Un lugar para tus notas rápidas, aprendizajes, comandos útiles, etc.
- **Wordlists**: Para almacenar tus wordlists personalizadas o descargadas (además de las instaladas por defecto en `/usr/share/wordlists/`).
- **Scripts**: Para tus scripts personalizados de automatización o explotación.
- **Tools**: Para herramientas adicionales que no estén instaladas globalmente en tu sistema. Por ejemplo, exploits descargados de GitHub que quieras mantener organizados e independientes de la máquina en la que los descubriste.
- **Misc**: Para cualquier otro recurso que no encaje en las categorías anteriores (ficheros ovpn, capturas de tráfico, herramientas encontradas, etc.).
- **Reports**: Para guardar informes finales o writeups de máquinas que hayas completado, lo cual es especialmente útil si quieres compartir tu trabajo o simplemente tener un registro de lo que has aprendido.

Si utilizas esta estructura, te recomiendo crear un script o alias para navegar rápidamente a estas carpetas desde la terminal, lo que te ahorrará tiempo y mantendrá tu flujo de trabajo fluido. Por ejemplo:
```bash
cat <<'EOF' >> ~/.bashrc
alias htb='pushd ~/HTB'; 
alias htb-machines='pushd ~/HTB/Machines'; 
alias htb-notes='pushd ~/HTB/Notes'; 
alias htb-wordlists='pushd ~/HTB/Wordlists'; 
alias htb-scripts='pushd ~/HTB/Scripts'; 
alias htb-tools='pushd ~/HTB/Tools'; 
alias htb-reports='pushd ~/HTB/Reports'; 
case ":$PATH:" in *":$HOME/HTB/Scripts:"*) ;; *) PATH="$HOME/HTB/Scripts:$PATH" ;; esac; 
case ":$PATH:" in *":$HOME/HTB/Tools:"*) ;; *) PATH="$HOME/HTB/Tools:$PATH" ;; esac; 
export PATH
EOF
source ~/.bashrc
```
> Si usas pushd para moverte entre directorios, puedes volver al directorio anterior con `popd`, lo que facilita la navegación entre diferentes partes de tu estructura de trabajo sin perder el contexto.

### 5.2. Gestión de notas y evidencias
Mantener un buen sistema de notas es clave para no perder información valiosa durante el proceso de hacking. Aquí tienes algunas recomendaciones para gestionar tus notas de manera efectiva:
- **Herramienta de notas**: Puedes usar cualquier herramienta que te resulte cómoda, desde un simple editor de texto (como Vim, Nano o Notepad++) hasta aplicaciones más avanzadas como Obsidian, Joplin o OneNote. Lo importante es que te permita organizar tus notas de forma clara y rápida.
- **Estructura de notas**: Para cada máquina, puedes seguir una estructura similar a la siguiente:
  - **Información general**: IP, nombre de la máquina, fecha de inicio, etc.
  - **Enumeración**: resultados de nmap, gobuster, whatweb, etc.
  - **Explotación**: comandos utilizados, payloads probados, resultados obtenidos.
  - **Post-explotación**: información obtenida tras comprometer la máquina, pasos realizados para escalar privilegios, etc.
  - **Conclusiones**: aprendizajes clave, técnicas utilizadas, etc.
- **Evidencias**: Guarda capturas de pantalla, logs, outputs de comandos importantes, etc. Esto te ayudará a crear un registro visual de tu progreso y a tener pruebas de lo que has hecho, especialmente útil para generar un hábitat de documentación y para compartir tu trabajo con otros.

### 5.3. Snapshots y backups de la VM
Una de las ventajas de trabajar con máquinas virtuales es la posibilidad de tomar snapshots, que te permiten guardar el estado actual de tu máquina y volver a él si algo sale mal. Aquí tienes algunas recomendaciones para gestionar tus snapshots de manera efectiva:
- **Toma snapshots regularmente**: Antes de llevar a cabo grandes cambios en tu máquina (como instalar nuevas herramientas, realizar exploits complejos, etc.), toma un snapshot. Esto te permitirá volver a un estado anterior si algo sale mal o si quieres probar diferentes enfoques sin perder tu progreso.
- **Nombra tus snapshots de forma clara**: Usa nombres descriptivos para tus snapshots, como "Antes de instalar Burp Suite" o "Después de comprometer la máquina". Esto te ayudará a identificar rápidamente el estado de cada snapshot.
- **Gestiona el espacio de tus snapshots**: Ten en cuenta que los snapshots pueden ocupar mucho espacio en disco, especialmente si haces muchos cambios entre ellos. Asegúrate de eliminar los snapshots que ya no necesites para liberar espacio.

---

## 6. Seguridad básica del entorno
Aunque este entorno está destinado a ser un espacio de aprendizaje y un laboratorio personal para practicar hacking ético, es importante mantener ciertas buenas prácticas de seguridad para proteger tu máquina virtual y, en última instancia, tu host. Aquí te dejo algunas recomendaciones para mantener tu entorno seguro mientras trabajas con HTB.

### 6.1. Buenas prácticas mínimas
- **Mantén tu sistema actualizado**: Asegúrate de mantener tu Kali Linux o Parrot OS actualizado con los últimos parches de seguridad. Esto no solo protege tu entorno, sino que también te asegura que las herramientas que estás utilizando estén en su versión más reciente y segura.
- **Usa contraseñas fuertes**: Si decides crear usuarios adicionales en tu máquina virtual o si estás trabajando con servicios que requieren autenticación, asegúrate de usar contraseñas fuertes y únicas para cada cuenta. **NUNCA USES TUS CONTRASEÑAS PERSONALES** en tu entorno de hacking, el portapapeles compartido existe y es muy útil para poder pasar información entre tu host y la VM sin necesidad de llenar la VM de información personal.
- **Configura el firewall**: Aunque tu máquina virtual está aislada, es una buena práctica configurar un firewall para limitar el tráfico entrante y saliente. Esto puede ayudarte a prevenir conexiones no autorizadas y a proteger tu entorno de posibles ataques.
- **Deshabilita servicios innecesarios**: Revisa los servicios que se están ejecutando en tu máquina virtual y deshabilita aquellos que no necesitas para tus prácticas de HTB. Esto reduce la superficie de ataque y mejora la seguridad de tu entorno.
- **Usa snapshots de forma inteligente**: Como ya hemos mencionado, los snapshots son una herramienta muy útil para proteger tu progreso, pero también pueden ser un riesgo si no los gestionas adecuadamente. Asegúrate de eliminar los snapshots que ya no necesites y de no compartir tus snapshots con otras personas, ya que podrían contener información sensible o configuraciones específicas de tu entorno.

### 6.2. Errores comunes a evitar
- **No verificar la integridad de las imágenes**: Siempre descarga las imágenes de Kali Linux o Parrot OS desde sus sitios oficiales y verifica la suma de comprobación (SHA256) para asegurarte de que no han sido alteradas.
- **Compartir información personal**: Evita compartir información personal o sensible dentro de tu máquina virtual, especialmente si estás utilizando carpetas compartidas o portapapeles bidireccional. Esto puede ser un riesgo de seguridad si accidentalmente compartes información que no deseas. Lo normal es que nunca ocurra nada, pero si infectas tu MV, prefieres que el malware se limpie eliminando la MV, y no tener que enfrentarte a él en tu host.
- **No usar VPN para HTB**: Asegúrate de conectarte a HTB a través de su VPN oficial. No intentes acceder a la red de HTB sin la VPN, ya que esto no solo es una violación de sus términos de servicio, sino que también puede exponer tu entorno a riesgos innecesarios.
- **No mantener el entorno limpio**: Evita instalar herramientas o software innecesario en tu máquina virtual. Mantener un entorno limpio y organizado no solo mejora la seguridad, sino que también facilita el aprendizaje y la gestión de tus prácticas de HTB.

---

## 7. Conclusiones

A efectos de Hack The Box, **Kali y Parrot te sirven para lo mismo**: la diferencia no está en “qué puedes hackear”, sino en **cómo de cómodo te resulta el entorno** y cuánta fricción sientes mientras practicas.

**Kali Linux** es la opción más **directa** si quieres minimizar decisiones: viene muy “cargado”, con muchas **herramientas listas**, y además es el estándar de facto en muchos writeups y guías. Eso hace que sea más fácil **replicar pasos**, buscar errores y **seguir tutoriales** sin que te falte nada “por defecto”. El coste es que, en máquinas virtuales con recursos justos, puede sentirse **más pesado**.

**Parrot OS** encaja mejor si priorizas **ligereza y control**: su experiencia en VM suele ser más fluida, y la edición “Virtual” está pensada para ponerse en marcha rápido. A cambio, es más probable que termines **instalando herramientas a medida** que las vayas necesitando (lo cual no es malo: suele reforzar el aprendizaje). En resumen: Parrot tiende a ser **más cómodo con hardware limitado**.

Si tuviera que dar una recomendación práctica: **empieza por Kali** si estás muy apoyado en guías, y quieres copiar/pegar lo que hacen otros sin perder tiempo en instalar o personalizar tu entorno. Por otro lado, **empieza por Parrot** si tus recursos son limitados o si prefieres un sistema menos cargado y más personalizable desde el minuto uno.

### 7.1. Tips rápidos
En esta guía hemos cubierto la instalación y configuración básica, pero aquí tienes algunos consejos rápidos para evitar problemas comunes:
- **NAT + VPN dentro de la VM** es el camino con menos problemas para HTB.
- Asigna recursos realistas, no los mínimos de la máquina: **2-4 cores / 8-12 GB RAM / 40–60 GB disco** te evita la mayoría de frustraciones.
- Instala primero un **perfil mínimo** y ve ampliando “por necesidad”, no por acumulación.
- Activa el **portapapeles bidireccional** y, si quieres, una **carpeta compartida** para notas y outputs.
- Haz un **snapshot** justo después de: instalación + updates + herramientas base. Esto te permite volver a un estado limpio si algo se rompe o si quieres probar diferentes enfoques sin perder tu progreso.

### 7.2. Recursos visuales

Si te atascas en algún paso, estos dos vídeos me han servido como referencia en más de una ocasión para instalar ambos sistemas operativos, y pueden ser un buen punto de partida para resolver dudas concretas sobre la instalación:

- **Kali Linux (VMWare, 2023/2024)**: [“Instalación del entorno - HackTheBox”](https://youtu.be/y5GksT4WtcY?si=LpdEnTGGSlGy-qI1)
- **Parrot OS (VirtualBox, 2024/2025)**: [“Cómo Descargar e Instalar Parrot Security en Virtualbox Paso a Paso
”](https://www.youtube.com/watch?v=nBkYK5roeMo)

---

## Referencias
- [Descarga de Parrot OS](https://parrotsec.org/docs/introduction/download-parrot)
- [Descarga de Kali Linux](https://www.kali.org/get-kali/)
- [Guía oficial de instalación de Kali Linux](https://www.kali.org/docs/installation/hard-disk-install)
- [Tamaños recomendados de disco para Kali Linux](https://www.kali.org/docs/installation/installation-sizes/)
- [Guía oficial de instalación de Kali Linux sobre VirtualBox](https://www.kali.org/docs/virtualization/install-virtualbox-guest-vm)
- [Guía oficial de instalación de Kali Linux sobre VMWare](https://www.kali.org/docs/virtualization/install-vmware-guest-vm)
- [Guía oficial de instalación de Parrot OS sobre VirtualBox](https://parrotsec.org/docs/virtualization/install-parrot-on-virtualbox/)
- [Particionado manual en Parrot OS](https://parrotsec.org/docs/installation/manual-installation/)

