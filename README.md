# Color Sense: Adaptación Web Semántica para Daltonismo

Color Sense es una aplicación web que adapta recursos visuales como imágenes y gráficos para personas con diferentes tipos de daltonismo, usando conocimiento semántico, ontologías, y adaptaciones visuales en tiempo real.

---

## 🚀 Funcionalidad

- **Adaptación automátizada** de colores en imágenes y gráficos según el tipo de daltonismo seleccionado.
- **Ontología personalizada** para modelos de daltonismo y mappings de colores.
- **Base de datos semántica** de recursos visuales y sus paletas de color (MongoDB).
- **Interfaz sencilla** para la visualización y prueba de adaptaciones.

---

## 🏛️ Arquitectura

```
[Cliente (HTML+JS+CSS)]
    |
    | solicitudes (POST /api/adapt, /api/seed)
    v
[Backend NodeJS/Express]
    |
    |-- Adaptador Semántico (SemanticAgent.js)
    |-- Ontología (DaltonismOntology.js)
    |-- Modelos MongoDB (VisualResource, UserProfile)
    v
[Base de datos MongoDB]
```

- **Frontend** (`/client`):
  - HTML, CSS, JS puro. Interfaz para seleccionar el tipo de daltonismo y aplicar la adaptación a ejemplos visuales.
  - Se comunica con el backend a través de requests `POST` a `/api/adapt`.

- **Backend** (`/server`):
  - Node.js + Express, conecta con MongoDB.
  - Expone endpoints `/api/adapt`, `/api/user/profile` y `/api/seed`.
  - Aplica lógica de adaptación según ontología definida localmente.

- **Base de datos MongoDB**:
  - Almacena recursos visuales y perfiles de usuario para la demostración semántica.

---

## 🛠️ Tecnologías principales

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express, Mongoose
- **Base de datos:** MongoDB
- **Contenedores:** Docker, Docker Compose

---

## 🏁 Inicio rápido

### Opción 1: Con Docker Compose (recomendado)

1. Asegúrate de tener Docker y Docker Compose instalados.
2. Ejecuta en la raíz del proyecto:

```bash
docker-compose up --build
```

3. Accede a: [http://localhost:3000](http://localhost:3000)

- El backend (Express) escuchará en `localhost:3000`.
- MongoDB correrá en `localhost:27017` internamente entre contenedores.

### Opción 2: De forma local (sin Docker)

1. Asegúrate de tener MongoDB ejecutándose en tu máquina en el puerto por defecto (`27017`).
2. Instala las dependencias del backend:

```bash
cd server
npm install
```

3. Inicia el backend:

```bash
npm start
```

4. Abre `client/index.html` en tu navegador para ver la interfaz.
   - Si quieres servir el frontend también desde el backend: accede a `http://localhost:3000`.

---

## 📚 Estructura de carpetas

```
pro_final_web_sematica/
│
├── client/
│   ├── css/
│   ├── js/
│   ├── index.html
│
├── server/
│   ├── app.js
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│       ├── ontology/
│       ├── routes/
│       ├── models/
│       └── services/
│
├── docker-compose.yml
```

---

## 📢 Créditos & Notas

- Proyecto académico para materia de Web Semántica, Politécnico JIC, con el docente Manolo Pájaro Borras

---
