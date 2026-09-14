# Scaffolding backend (Express + Sequelize)

## Estructura

```
src/
├── index.js                          # Entrypoint: instancia Server y escucha
├── server.js                         # Clase Server: middlewares base, rutas, prepare()
├── config/config.js                  # Lectura de .env
├── db/
│   ├── connection.js                 # Instancia de Sequelize
│   └── createDatabase.js             # Crea la DB si no existe
├── models/
│   ├── index.js                      # Autocarga de modelos + asociaciones
│   └── user.model.js                 # Modelo de ejemplo
├── routes/
│   ├── index.routes.js               # Router raiz montado en /api
│   └── user.routes.js                # Rutas de user
├── controllers/
│   ├── user.controller.js            # Logica: me()
│   └── user.controller.test.js       # Test co-locado (node:test)
├── decorators/user.decorator.js      # Shape de la respuesta (DTO)
├── seeders/iniData.js                # Usuario demo
└── utils/hashPassword.js             # Helper bcrypt
```

## Ciclo de vida del request

```
Request → Express → Route → Controller → Decorator → Response
```

Cuando se agregue autenticacion, se intercala antes del Route:

```
Request → Express → authMiddleware.verifyToken → role.middleware → Route → ...
```

## Arranque

### 1. Enciende MySQL

Necesitas MySQL corriendo en tu computadora. Puedes usar **Laragon** o **XAMPP**:

- **Laragon**: abre Laragon y presiona **Iniciar todo**.
- **XAMPP**: abre el Panel de Control y presiona **Start** en **MySQL**.

Los dos usan el puerto `3306`, el usuario `root` y vienen sin contrasena.

> No tienes que crear la base de datos a mano. El proyecto la crea solo la
> primera vez que arranca.

### 2. Instala las dependencias

```bash
npm install
```

### 3. Crea tu archivo `.env`

```bash
cp .env.example .env
```

Si usas Laragon o XAMPP no tienes que cambiar nada. Si tu MySQL tiene
contrasena o usa otro puerto, cambia `DB_PASSWORD` o `DB_PORT`.

### 4. Arranca el proyecto

```bash
npm run dev
```

Si todo sale bien vas a ver algo asi:

```
Database connected
models synchronized
User seeded: user@admin.com
Seeders loaded
Server running on port 3000
```

Cada vez que arranca, el proyecto:

1. Crea la base de datos (`DB_NAME`) si todavia no existe.
2. Crea o actualiza las tablas a partir de los modelos (`sequelize.sync({ alter: true })`).
3. Carga el usuario demo (seeders).

### Problemas comunes

**`ECONNREFUSED 127.0.0.1:3306`**
MySQL no esta encendido. Abre Laragon o XAMPP y enciende MySQL.

**`Access denied for user 'root'`**
La contrasena no coincide. Revisa `DB_PASSWORD` en tu `.env` (con Laragon o
XAMPP va vacia).

**Uso WSL y MySQL esta en Windows**
Dentro de WSL, `127.0.0.1` no llega a Windows. Lo mas facil es correr el
proyecto desde una terminal de Windows (PowerShell o la terminal de VS Code).

## Convenciones

- **IDs**: ULID (paquete `ulid`), string de 26 chars, no autoincremental.
- **Tablas**: snake_case plural (`users`), timestamps `created_at` / `updated_at`,
  borrado logico con `paranoid: true` y `deleted_at`.
- **Decorators**: funciones puras que transforman la instancia de Sequelize en la
  respuesta del API. El controller nunca devuelve el modelo crudo — asi el
  `password` jamas se filtra.
- **Tests**: co-locados como `*.controller.test.js`, con `node:test` + `assert/strict`.
  Los modelos se mockean sobreescribiendo `require.cache`.

## Endpoint de ejemplo

```
GET /api/user/me
```

```json
{
  "data": {
    "id": "01JYQZ8K3M4N5P6Q7R8S9T0V1W",
    "firstname": "User",
    "lastname": "Admin",
    "email": "user@admin.com"
  }
}
```

Sin middleware de auth no hay `req.user`, por lo que el controller resuelve al
primer usuario de la tabla (el del seeder). El TODO en
`src/controllers/user.controller.js` marca la linea exacta a cambiar por
`User.findByPk(req.user.id)` cuando se sume `verifyToken`.

## Usuario del seeder

| Campo | Valor |
|---|---|
| id | `01JYQZ8K3M4N5P6Q7R8S9T0V1W` |
| firstname | User |
| lastname | Admin |
| email | user@admin.com |
| password | `Admin123!` (se guarda hasheada con bcrypt) |

## Agregar una entidad nueva

1. `src/models/<entidad>.model.js` — el `index.js` la autocarga.
2. `src/decorators/<entidad>.decorator.js`
3. `src/controllers/<entidad>.controller.js`
4. `src/routes/<entidad>.routes.js` + registrarla en `index.routes.js`
5. `src/controllers/<entidad>.controller.test.js`
