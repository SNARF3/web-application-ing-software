# 🧭 Sistema de Gestión de Visitas UCB – “UCB Explorer”
## 👥 Equipo y Proyecto
### Equipo: Back4End
| Rol              | Nombre(s)                                         | Responsabilidades |
|------------------|--------------------------------------------------|-------------------|
| **Scrum Master** | [Marvin Mollo Ramirez]                        | Facilitar el proceso Scrum, eliminar obstáculos y garantizar el cumplimiento de los objetivos del sprint. |
| **Product Owner** | [Leonardo Delgado Medrano]                       | Representar las necesidades del cliente, priorizar el Product Backlog y asegurar que el producto entregue valor. |
| **Desarrolladores** | [Leonardo Delgado Medrano], [Alan Flores Campos]              | Desarrollar las funcionalidades, integrar componentes y asegurar el correcto funcionamiento del sistema. |
| **QA** | [Marvin Mollo Ramirez],                           | Validar los incrementos del producto, realizar pruebas funcionales y de aceptación. |
| **Arquitecto de software** | [Christian Coronel Condori],                           | Realizar como sera la división y el funcionamiento de todo el sistema. |
---
## 🧾 Proyecto
El proyecto **UCB Explorer Manager** tiene como objetivo **gestionar y optimizar el registro de visitas de colegios a la Universidad Católica Boliviana**, permitiendo llevar un control eficiente de actividades, asignación de guías, incidencias y reportes.  
Además, incluye una **aplicación móvil** para estudiantes visitantes que podrán responder **encuestas de satisfacción** al finalizar la visita.
---
## 🤝 Normas del Equipo
- **Comunicación:**  
  Utilizamos **Discord** para comunicación diaria del equipo y **WhatsApp** para coordinación rápida y seguimiento de tareas.
- **Reuniones:**  
  Se realizan reuniones de **Sprint Planning**, **Daily Scrum**, **Sprint Review** y **Sprint Retrospective**.
- **Resolución de Conflictos:**  
 Los conflictos se abordan de manera constructiva, priorizando la comunicación abierta y la colaboración entre miembros.
- **Entrega de Trabajo:**  
  Cada miembro entrega su trabajo dentro de los plazos acordados y conforme a la **definición de “Hecho”**, asegurando calidad y funcionalidad.
—


## 🧰 Herramientas de Desarrollo y Gestor de Base de Datos
| Tipo | Herramientas |
|------|---------------|
| **Entorno de Desarrollo** | Visual Studio Code |
| **Pruebas y APIs** | Postman |
| **Gestión de Dependencias** | Node Package Manager (npm/yarn) |
| **Control de Versiones** | GitHub |
| **Gestor de Base de Datos** | PostgreSQL (principal), Firebase (para datos de encuestas y métricas) |
| **Contenedores / Localhost** | Docker o Laragon |
---
## 🏗️ Arquitectura del Sistema
El sistema sigue una **arquitectura basada en microservicios y contenedores**, donde cada componente cumple una función específica y se comunica mediante **API REST (HTTPS/JSON)**.
Está estructurado bajo el modelo **Cliente–Servidor**, con separación clara entre **frontends (web y móvil)**, **backend**, **procesamiento asíncrono** y **almacenamiento de datos**.
La seguridad se gestiona mediante un **Servicio de Autenticación propio**, con roles y permisos definidos.
### Componentes principales
- **Web App (React + Vite):** interfaz para administradores y colaboradores.  
- **Mobile App (Flutter):** interfaz para estudiantes y encuestas de satisfacción.  
- **API Backend (Node.js + Express):** gestión de lógica de negocio, seguridad y endpoints REST.  
- **Worker / Job Processor (Node.js):** procesamiento asíncrono de reportes y métricas.  
- **Base de Datos (PostgreSQL / Firebase):** almacenamiento y sincronización de datos.  
---
## 🗄️ Base de Datos
- **PostgreSQL:**  
  Almacena la información principal del sistema (visitas, colegios, usuarios, guías, reportes e incidencias).
- **Firebase:**  
  Permite obtener datos registrados dentro de la aplicación móvil **UCB-Explorer**, principalmente encuestas de satisfacción y métricas analíticas en tiempo real.
---
## 🌐 Creación de Repositorio
Repositorio oficial del proyecto:  
🔗 [https://github.com/SNARF3/web-application-ing-software](https://github.com/SNARF3/web-application-ing-software)
---
## 📆 Gestión del Proyecto
- **Metodología:** Scrum  
- **Seguimiento:** Jira (gestión de tareas e historias de usuario por sprint)  
- **Control de versiones:** GitHub Projects  
- **Sprints:** 3 sprints planificados hasta el 30 de octubre  
---
© 2025 - Universidad Católica Boliviana “San Pablo”  
Proyecto académico de Ingeniería de Software.
