# WorkAttendance

Autor: Juan Esteban Vasco Giraldo

## Caracteristicas del proyecto
- Aplicacion full stack separada en Frontend y Backend.
- Backend construido con FastAPI, Pydantic y MongoDB (Motor/PyMongo).
- Frontend construido con React + Vite.
- Arquitectura por capas (application, domain, infrastructure).
- Inyeccion de dependencias para desacoplar casos de uso de implementaciones tecnicas.
- Soporte de multiples areas por usuario usando lista de enums.
- El entorno incluye usuarios ya registrados y marcajes de entrada/salida para pruebas funcionales.
- Manejo de tiempo en UTC como base del sistema para evitar inconsistencias de fecha.
- `uv` usado como gestor de paquetes para el entorno Python del backend.

## Instalacion

### Requisitos previos
- Python 3.10 o superior.
- Node.js 18 o superior.
- npm.
- MongoDB disponible (local o remoto).

### 1) Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd Prueba_Tecnica
```

### 2) Instalar dependencias del backend con uv
Desde la raiz del proyecto:
```bash
uv sync
```

El proyecto usa un entorno virtual local llamado venv para aislar las dependencias de Python. Si prefieres trabajarlo de forma manual, puedes activarlo asi:
```bash
uv sync
.venv\Scripts\activate
```

Ejemplo de uso:
```bash
cd Backend
.venv\Scripts\activate
python server.py
```

### 3) Instalar dependencias del frontend
```bash
cd Frontend
npm install
```

### 4) Ejecutar backend
En otra terminal, desde la raiz del proyecto:
```bash
cd Backend
python server.py
```

### 5) Ejecutar frontend
En otra terminal:
```bash
cd Frontend
npm run dev
```

### 6) URL de acceso
- Frontend: http://localhost:5173
- Backend (API): http://127.0.0.1:8000/api

## Estructura del .env
El backend lee su configuracion desde el archivo [Backend/.env](Backend/.env). Este archivo contiene la configuracion de ejecucion y la conexion a MongoDB, importante colocarlo dentro de la carpeta de Backend

Variables esperadas:
- `app_name`: nombre de la aplicacion.
- `port`: puerto del backend.
- `workers`: cantidad de workers de Uvicorn.
- `reload`: activa recarga automatica en desarrollo.
- `environment`: entorno de ejecucion (`test`, `qa`, `stage`, `prod`, etc.).
- `host`: host donde escucha la API.
- `mongodb_user`: usuario de MongoDB.
- `mongodb_password`: contrasena de MongoDB.
- `mongodb_url`: URL base de MongoDB.
- `mongodb_db`: nombre de la base de datos.

Env con base de datos con usuarios registrados:
```env
app_name=WorkAttendance API
port=8000
workers=1
reload=true
host=127.0.0.1
environment=prod
mongodb_url=mongodb+srv://
mongodb_user=prueba-tecn-1
mongodb_password=8baJM83szaWigHMB
mongodb_db=prueba_tecnica
```

## Descripcion del proyecto
WorkAttendance es una aplicacion full stack para la gestion de asistencia laboral por roles.

Permite:
- Iniciar sesion con numero de empleado y correo.
- Gestionar usuarios desde perfil administrador.
- Consultar equipos asignados desde perfil supervisor.
- Registrar entradas y salidas desde perfil usuario.
- Manejar multiples areas por usuario mediante una lista de enums.

La solucion esta separada en dos aplicaciones principales:
- Frontend: interfaz de usuario en React.
- Backend: API en FastAPI con logica de negocio, persistencia MongoDB e inyeccion de dependencias.

## Datos de verificacion (JSON)
Para validar rapidamente el funcionamiento, se cuenta con usuarios precargados y registros de asistencia de la semana del 6 al 10 de abril de 2024. Adicionalmente, se pueden registrar nuevos usuarios desde la vista de administracion.

Nota: en estos ejemplos los enums se muestran por nombre para facilitar la lectura.

Admin:
```json
{
	"id": "db2f9f14-2701-4111-998b-68b20cc237a6",
	"employee_number": "EMP345",
	"first_name": "Juan Esteban",
	"last_name": "Vasco Giraldo",
	"email": "juan@gmail.com",
	"is_active": true,
	"role": "ADMIN",
	"areas": [
		"Recursos Humanos"
	],
	"supervisor_id": null
}
```

Supervisores:
```json
[
	{
		"id": "7441c8e7-394b-4b0e-90c5-3210fdd8f957",
		"full_name": "Supervisor Uno",
		"first_name": "Supervisor",
		"last_name": "Uno",
		"email": "s1@gmail.com",
		"employee_number": "S001",
		"role": "SUPERVISOR",
		"areas": [
			"Operaciones",
			"Logistica",
			"Recursos Humanos",
			"Finanzas"
		],
		"is_active": true,
		"supervisor_id": null
	},
	{
		"id": "8f97ca9b-5309-4dae-9b6f-0f0732bbfc86",
		"full_name": "Supervisor Dos",
		"first_name": "Supervisor",
		"last_name": "Dos",
		"email": "s2@gmail.com",
		"employee_number": "S002",
		"role": "SUPERVISOR",
		"areas": [
			"Operaciones"
		],
		"is_active": true,
		"supervisor_id": null
	}
]
```

Usuarios:
```json
[
	{
		"id": "8018b4c7-0d1c-4ea2-8fdd-e6a3111be65b",
		"full_name": "User Uno",
		"first_name": "User",
		"last_name": "Uno",
		"email": "u1@gmail.com",
		"employee_number": "U001",
		"role": "USER",
		"areas": [
			"Logistica",
			"Finanzas",
			"TI"
		],
		"is_active": true,
		"supervisor_id": "7441c8e7-394b-4b0e-90c5-3210fdd8f957"
	},
	{
		"id": "06754e32-e7fb-4115-a015-1c51c3b0a170",
		"full_name": "User Dos",
		"first_name": "User",
		"last_name": "Dos",
		"email": "u2@gmail.com",
		"employee_number": "U002",
		"role": "USER",
		"areas": [
			"Operaciones",
			"Recursos Humanos"
		],
		"is_active": true,
		"supervisor_id": "7441c8e7-394b-4b0e-90c5-3210fdd8f957"
	},
	{
		"id": "25923afd-d793-436a-b9be-61ff7e14574c",
		"full_name": "User Tres",
		"first_name": "User",
		"last_name": "Tres",
		"email": "u3@gmail.com",
		"employee_number": "U003",
		"role": "USER",
		"areas": [
			"Operaciones",
			"Logistica"
		],
		"is_active": true,
		"supervisor_id": "8f97ca9b-5309-4dae-9b6f-0f0732bbfc86"
	}
]
```

## Proceso de inferencia y trazabilidad de requerimientos
El proceso de inferencia se realizo en tres pasos:

1. Entender el problema y descomponer requerimientos funcionales y reglas de negocio.
2. Modelar el dominio para representar esas reglas con objetos, enums y contratos.
3. Implementar casos de uso en application y persistencia en infrastructure, manteniendo separacion de responsabilidades.

### Del requerimiento al dominio
La forma en que los requerimientos se reflejan en domain fue:
- Empleado -> entidad User con atributos de identidad, estado y relaciones (supervisor).
- Marcajes -> entidad WorkAttendance con fecha, check_in, check_out, estado y calculo de horas.
- Tipos de movimiento -> enum CheckType (IN/OUT).
- Estado de asistencia -> enum AttendanceStatus (OPEN, COMPLETE, LATE, ABSENT).
- Roles y visibilidad -> enum Role y relacion supervisor_id.
- Departamentos multiples -> enum Area y lista de areas por usuario.
- Operaciones de negocio -> contratos en repositorios (UserRepository) para desacoplar casos de uso de la tecnologia.

### Solucion de puntos solicitados
1. Gestion de empleados
- Implementado: crear, listar y actualizar empleados.
- Datos cubiertos: nombre, numero de empleado, areas/departamentos y estado activo/inactivo.
- Nota: en esta version la eliminacion esta definida en el contrato de repositorio e implementada en infraestructura, pero no esta expuesta por endpoint HTTP.

2. Registro de marcajes
- Implementado con endpoint de check por empleado.
- El sistema guarda fecha, hora y tipo de movimiento (entrada/salida).
- La persistencia se realiza en Mongo en registros de asistencia por dia.

3. Consulta de asistencia diaria
- Implementado en consulta por supervisor y fecha.
- Respuesta por empleado:
	- Entrada + salida: calcula horas trabajadas.
	- Solo entrada: estado de jornada abierta.
	- Sin marcajes: estado ausente.
- Regla adicional de calculo cuando no hay check de salida:
	- Si la fecha del attendance consultado es igual a la fecha del timestamp recibido, las horas se calculan como timestamp - hora de entrada.
	- Si la fecha del attendance es distinta, se calcula usando la hora de salida definida en constants (out_hour) - hora de entrada.

4. Regla de negocio de tolerancia
- Implementada en la logica de check de entrada.
- El sistema trabaja en UTC de forma general y solo convierte a horario local al momento de evaluar puntualidad (retardo/falta), evitando problemas por cambio de fecha.
- Antes o igual a 9:15 AM: estado abierto.
- Despues de 9:15 AM y hasta 10:00 AM: retardo.
- Despues de 10:00 AM: falta (ausente).

5. Departamentos multiples
- Implementado extremo a extremo.
- Domain: lista de Area en User.
- Application: requests/responses con lista de areas.
- Infrastructure: DAO y repositorio almacenan areas como lista en Mongo.
- Frontend: formulario con seleccion multiple y visualizacion en tablas/tarjetas.

6. Visibilidad de supervisores
- Implementado.
- Los supervisores consultan asistencia solo de su equipo mediante el indice por supervisor y el endpoint por supervisor+fecha.

7. Marcajes duplicados
- Implementado con manejo defensivo.
- Si la jornada ya tiene entrada y salida, el sistema no vuelve a registrar y responde sin modificar el estado.
- Si se repite entrada en una jornada abierta, el sistema evita corromper la asistencia y mantiene consistencia del registro diario.

## Arquitectura general
El repositorio esta organizado asi:

- Backend/
- Frontend/

Cada capa tiene responsabilidades claras para mantener bajo acoplamiento y facilitar pruebas y mantenimiento.

## Backend
En el backend se aplica separacion por capas: application, domain e infrastructure.

### 1) application
La carpeta application concentra los casos de uso expuestos por HTTP y la orquestacion de la logica de negocio.

Aqui se encuentran:
- Routers FastAPI.
- Commands (acciones que cambian estado): crear usuario, actualizar usuario, login, check de asistencia.
- Queries (consultas de lectura): por id, por rol, por supervisor y fecha.
- Handlers que coordinan validaciones, reglas y llamados a repositorios.

La capa application no conoce detalles de Motor, colecciones ni consultas Mongo concretas; solo depende de abstracciones.

### 2) domain
La carpeta domain representa el problema del negocio.

Aqui viven:
- Entidades y agregados (por ejemplo User y WorkAttendance).
- Enums de negocio (Role, AttendanceStatus, CheckType, Area).
- Excepciones de dominio.
- Interfaces abstractas de repositorios (contratos), por ejemplo UserRepository.

Estas interfaces definen que se debe poder hacer, mientras que la implementacion concreta ocurre en infrastructure.

### 3) infrastructure
La carpeta infrastructure contiene la logica de ingenieria y de integracion con tecnologia externa.

Aqui se define:
- Persistencia MongoDB.
- Middlewares.
- Servicios tecnicos.
- Inyecciones auxiliares (por ejemplo TIMESTAMP de cabeceras).

#### Inyeccion de dependencias
El backend usa un contenedor propio de dependencias que:
- Registra interfaces y sus implementaciones.
- Resuelve constructores automaticamente por type hints.
- Permite singletons.
- Cambia implementaciones segun ambiente (produccion o test).

Esto permite que los handlers trabajen contra contratos y no contra clases acopladas a infraestructura.

#### Clientes MongoDB (3 clientes)
En infrastructure/persistance/mongodb/clients hay tres piezas clave:

1. MongoClient
- Es la interfaz abstracta (contrato) con operaciones CRUD basicas asincronas.
- Define insert_one, find_one, find_many, update_one y delete_one.

2. MongoClientImpl
- Implementacion real para produccion usando Motor (AsyncIOMotorClient).
- Ejecuta operaciones reales sobre MongoDB.

3. MongoTestClient
- Implementacion en memoria para pruebas.
- Simula colecciones con diccionarios/listas de Python.
- Permite probar logica de repositorios sin depender de una base real.

#### DAO (Data Access Objects)
Los DAO representan la forma exacta en que se guardan y leen documentos en Mongo.

Ejemplos:
- UserDao
- WorkAttendanceDao
- IndexDao
- BaseDao (base comun)

Su objetivo es:
- Estandarizar llaves pk/sk.
- Serializar y deserializar documentos.
- Mantener separado el modelo de persistencia del modelo de dominio.

#### Mappers
Los mappers transforman entre dominio y DAO:
- Domain -> DAO para guardar.
- DAO -> Domain para devolver entidades de negocio.

Con esto se evita mezclar detalles de almacenamiento dentro de las entidades de dominio.

#### Implementacion de repositorios
La implementacion concreta de UserRepository vive en infrastructure/persistance/mongodb/user_repository.py.

Responsabilidades principales:
- Persistir y consultar usuarios.
- Mantener indices tecnicos para busquedas eficientes (por supervisor, email y numero de empleado).
- Gestionar asistencia (alta, consulta y upsert).
- Resolver conversiones documento <-> DAO <-> dominio.
- Mantener compatibilidad con documentos antiguos cuando aplica.

## Frontend
El frontend esta construido en React y separado por responsabilidades para facilitar escalabilidad.

### Estructura funcional
- app/: entradas de pantallas de alto nivel (por ejemplo login).
- components/: UI reutilizable y paginas por rol (admin, supervisor, user, 404).
- actions/: capa de acceso HTTP hacia el backend.
- reducers/utils: composicion de acciones (useActions) para consumir servicios desde las vistas.
- configuration/: constantes, enums, traducciones y host del backend.

### Como se divide el flujo de frontend
1. Capa de configuracion
- Define enums de negocio (roles, tipos de check, estados de asistencia y areas).
- Define opciones de UI y traducciones.

2. Capa de acciones (actions)
- Encapsula llamadas HTTP.
- Usa un cliente comun con fetch.
- Agrega cabecera TIMESTAMP en cada request para sincronizar contexto temporal con backend.

3. Capa de paginas y componentes
- Admin: gestiona usuarios, incluyendo seleccion multiple de areas.
- Supervisor: consulta usuarios asignados por fecha y estado.
- User: consulta su informacion y realiza checks.
- Componentes reutilizables: formularios, tablas, tarjetas, loader, toasts, manejo de errores.

4. Sesion y navegacion por rol
- La app restaura sesion desde sessionStorage.
- Tras login consulta perfil y redirige segun rol.
- Mantiene vista y datos del usuario en sesion para continuidad de uso.

## Resumen tecnico
Esta prueba tecnica aplica una arquitectura por capas con foco en:
- Separacion clara entre negocio e infraestructura.
- Uso de contratos e inyeccion de dependencias.
- Persistencia desacoplada mediante cliente abstracto, DAO y mappers.
- Frontend modular por dominio de UI y por capa de integracion HTTP.
- Soporte de multiples areas por usuario como lista de enums extremo a extremo.

## Mejora continua
Como siguientes pasos de evolucion del proyecto se pueden abordar:
- Implementar sessions de forma mas robusta para la autenticacion y persistencia de estado.
- Mejorar la seguridad, porque actualmente el unico validador operativo para los checks es el id del usuario.
- Cifrar la informacion sensible antes de persistirla.
- Agregar pruebas de integracion con pytest; por eso existe MongoTestClient como cliente de pruebas en memoria.
- Mejorar el diseño del frontend y las experiencias de carga.
- Optimizar la carga de Mongo y el acceso a datos.

## Coleccion de Postman
En el archivo Prueba Tecnica.postman_collection se encuentra la coleccion de Postman para probar los endpoints.
Ahí se puede modificar el header TIMESTAMP en los checks para simular distintas fechas y horarios de marcaje.


