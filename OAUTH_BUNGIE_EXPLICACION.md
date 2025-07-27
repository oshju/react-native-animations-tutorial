# Integración OAuth 2.0 con Bungie en React Native (Expo)

Este proyecto implementa un flujo de autenticación OAuth 2.0 con Bungie para acceder a la API de Destiny 2 desde una app React Native (Expo). Aquí se explica el flujo, la estructura y los puntos clave del código.

## 1. ¿Qué es OAuth 2.0?
OAuth 2.0 es un protocolo estándar para autorización segura. Permite a los usuarios autorizar a una app a acceder a recursos protegidos (como tu inventario de Destiny 2) sin compartir su contraseña.


## 2. Código paso a paso para obtener el access token de Bungie

### a. Construir la URL de autorización y abrir el navegador

```js
const clientId = 'TU_CLIENT_ID';
const redirectUri = 'TU_REDIRECT_URI';
const authUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
// Abre el navegador para que el usuario autorice
WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
```

### b. Detectar el código de autorización tras el login

Cuando el usuario autoriza, Bungie redirige a tu `redirectUri` con un parámetro `code`:

```js
// Ejemplo de cómo extraer el code de la URL de redirección
const url = 'tuapp://redirect?code=AUTH_CODE_AQUI';
const code = url.match(/[?&]code=([^&]+)/)[1];
```

### c. Intercambiar el código por el access token

```js
const tokenUrl = 'https://www.bungie.net/Platform/App/OAuth/Token/';
const body = new URLSearchParams({
  grant_type: 'authorization_code',
  code,
  client_id: clientId,
  client_secret: 'TU_CLIENT_SECRET',
});
const res = await fetch(tokenUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: body.toString(),
});
const data = await res.json();
// data.access_token y data.refresh_token
```

### d. Guardar el token en el contexto global

```js
// Ejemplo usando React Context
setAccessToken(data.access_token);
```

---
## 2. Flujo OAuth 2.0 implementado

### a. Inicio del flujo
- El usuario pulsa un botón para "Iniciar sesión con Bungie".
- Se abre el navegador con la URL de autorización de Bungie, incluyendo:
  - `client_id` (de tu app registrada en Bungie)
  - `response_type=code`
  - `redirect_uri` (URL a la que Bungie redirige tras autorizar)

### b. Autorización y obtención del código
- El usuario inicia sesión en Bungie y autoriza la app.
- Bungie redirige a la `redirect_uri` con un parámetro `code` en la URL.

### c. Intercambio del código por un access token
- La app detecta la redirección y extrae el `code`.
- Se hace una petición POST a Bungie (`/Platform/App/OAuth/Token/`) con:
  - `grant_type=authorization_code`
  - `code` (el recibido)
  - `client_id` y `client_secret`
- Bungie responde con un `access_token` y `refresh_token`.

### d. Uso del access token
- El `access_token` se guarda en un contexto global (`BungieTokenContext`).
- Todas las peticiones a la API de Destiny 2 incluyen el header `Authorization: Bearer <access_token>`.
- El token se comparte entre pestañas gracias al Provider en el layout principal.

### e. Renovación del token
- Si el token expira, se puede usar el `refresh_token` para obtener uno nuevo (no implementado aún, pero recomendado).

## 3. Estructura de archivos relevante

- `app/context/BungieTokenContext.tsx`: Contexto React para guardar y compartir el accessToken.
- `app/_layout.tsx`: Envuelve toda la app en el `BungieTokenProvider` para acceso global al token.
- `app/(tabs)/loadouts.tsx`: Ejemplo de uso del token para obtener personajes e inventario de Destiny 2.
- `firebaseConfig.js/ts`, `spotify-config.ts`: Otros ejemplos de integración de APIs.

## 4. Puntos clave del código

- **Contexto React**: Permite que cualquier componente acceda al token sin prop drilling.
- **Hooks personalizados**: `useBungieToken` para acceder fácilmente al token.
- **Seguridad**: El token nunca se expone en la UI, solo se usa en headers.
- **UX**: Indicadores de carga y mensajes de error claros.

## 5. ¿Cómo probar el flujo?
1. Pulsa el botón de login Bungie en la app.
2. Autoriza la app en el navegador.
3. Al volver a la app, deberías ver el token activo y tus personajes de Destiny 2.

---

# Subida a GitHub

1. Inicializa el repositorio (si no está hecho):
   ```sh
   git init
   git add .
   git commit -m "Proyecto Destiny 2 OAuth 2.0 inicial"
   ```
2. Crea un repositorio en GitHub y sigue las instrucciones para subirlo:
   ```sh
   git remote add origin https://github.com/tuusuario/tu-repo.git
   git branch -M main
   git push -u origin main
   ```

¡Listo! Así tendrás tu proyecto y documentación en GitHub.
