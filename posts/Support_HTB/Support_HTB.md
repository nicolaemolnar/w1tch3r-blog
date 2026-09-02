---
title: "(Writeup) Support - Hack The Box"
date: "2026-05-01"
tags: ["HTB", "Windows"]
summary: "Writeup de resolución de la máquina `Support` de HTB."
draft: true
---

## 1. Resumen

## 2. Enumeración
Como información inicial, recibimos la dirección IP de la máquina. Comenzamos ejecutando algunas pruebas de ping para verificar la conectividad, y luego procedemos a realizar un escaneo de puertos utilizando `nmap` para identificar los servicios que están corriendo en la máquina objetivo.
```bash
┌─[w1tch3r@fn1lfg44rd]─[~/HTB/Machines/In_Progress/Support]
└──╼ $ping 10.129.44.247
PING 10.129.44.247 (10.129.44.247) 56(84) bytes of data.
64 bytes from 10.129.44.247: icmp_seq=1 ttl=127 time=138 ms

┌─[w1tch3r@fn1lfg44rd]─[~/HTB/Machines/In_Progress/Support]
└──╼ $sudo nmap -sS --min-rate=5000 -p- 10.129.44.247 -oG Enum/allPorts.nmap
Starting Nmap 7.94SVN ( https://nmap.org ) at 2026-05-01 18:09 CEST
Nmap scan report for 10.129.44.247
Host is up (0.77s latency).
Not shown: 65516 filtered tcp ports (no-response)
PORT      STATE SERVICE
53/tcp    open  domain
88/tcp    open  kerberos-sec
135/tcp   open  msrpc
139/tcp   open  netbios-ssn
389/tcp   open  ldap
445/tcp   open  microsoft-ds
464/tcp   open  kpasswd5
593/tcp   open  http-rpc-epmap
636/tcp   open  ldapssl
3268/tcp  open  globalcatLDAP
3269/tcp  open  globalcatLDAPssl
5985/tcp  open  wsman
9389/tcp  open  adws
49664/tcp open  unknown
49668/tcp open  unknown
49678/tcp open  unknown
49692/tcp open  unknown
49710/tcp open  unknown
57660/tcp open  unknown
```
A continuación, realizamos un escaneo más detallado de los puertos abiertos para obtener información adicional sobre los servicios que están corriendo en la máquina.
```bash
┌─[✗]─[w1tch3r@fn1lfg44rd]─[~/HTB/Machines/In_Progress/Support]
└──╼ $sudo nmap -sC -sV -p53,88,135,139,389,445,464,593,636,3268,3269,5985,9389,49664,49668,49678,49692,49710,57660 10.129.44.247 -oN Enum/openPorts.nmap
Starting Nmap 7.94SVN ( https://nmap.org ) at 2026-05-01 18:25 CEST
Nmap scan report for 10.129.44.247
Host is up (0.045s latency).

PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-05-01 16:25:32Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: support.htb0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: support.htb0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
9389/tcp  open  mc-nmf        .NET Message Framing
49664/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49678/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49692/tcp open  msrpc         Microsoft Windows RPC
49710/tcp open  msrpc         Microsoft Windows RPC
57660/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: DC; OS: Windows; CPE: cpe:/o:microsoft:windows
```
Con esta información, podemos identificar que la máquina está corriendo varios servicios relacionados con Active Directory, lo que sugiere que podría ser un controlador de dominio. Además, el servicio de DNS también está presente, lo que es común en los controladores de dominio de Windows. Esto nos da una buena base para comenzar a investigar posibles vectores de ataque relacionados con Active Directory y la gestión de usuarios y permisos en el sistema.


## 3. Explotación


## 4. Post-Explotación


## 5. Conclusión


## 6. Referencias
