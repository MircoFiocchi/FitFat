# FitFat

Aplicación personal de seguimiento de peso construida con Next.js, TypeScript, Firebase y Tailwind CSS.

## Funcionalidades

- Registrar peso con fecha
- Gráfico de evolución (Recharts)
- Resumen: peso actual, inicial, cambio total y promedio semanal
- Vista semanal agrupada (lunes a domingo)
- Listado responsive (tabla en desktop, cards en mobile)
- Persistencia en Firestore
- Recomendaciones con Gemini según peso y motivos diarios

## Requisitos

- Node.js 18+
- Proyecto Firebase con Firestore habilitado

## Configuración

1. Clonar el repositorio e instalar dependencias:

```bash
npm install
```

2. Copiar variables de entorno:

```bash
cp .env.local.example .env.local
```

3. Completar las credenciales de Firebase en `.env.local`.

4. Desplegar reglas de Firestore (opcional para desarrollo local con emulador):

```bash
firebase deploy --only firestore:rules
```

5. Crear índice si Firestore lo solicita al ordenar por `date`.

## Despliegue en Vercel

`.env.local` **no se sube a Git**. En Vercel debes configurar las variables manualmente:

1. Vercel → tu proyecto → **Settings** → **Environment Variables**
2. Agregar cada variable (Production, Preview y Development):

| Variable | Ejemplo |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | tu api key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | toxic-out.firebaseapp.com |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | toxic-out |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | toxic-out.firebasestorage.app |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | 425739103847 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | tu app id |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | tu measurement id |
| `GEMINI_API_KEY` | key de Google AI Studio (**sin** `NEXT_PUBLIC_`) |

3. **Redeploy** después de agregar las variables (Deployments → Redeploy). Las `NEXT_PUBLIC_*` se embeben en el build; sin redeploy no funcionan.

4. En [Firebase Console](https://console.firebase.google.com) → proyecto `toxic-out`:
   - **Firestore Database** → Create database (si no existe)
   - **Firestore** → **Rules** → publicar reglas que permitan lectura/escritura en `weightEntries` (ver `firestore.rules`)
   - **Authentication** → **Settings** → **Authorized domains** → agregar tu dominio Vercel (ej. `fitfat.vercel.app`)

5. Si al cargar datos aparece error de índice en consola, crear el índice desde el enlace que muestra Firebase.

## Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # ESLint
npm test         # Tests (Vitest)
```

## Estructura

```
src/
├── app/              # Rutas Next.js
├── components/       # UI (dashboard, ui)
├── hooks/            # useWeightEntries
├── services/firebase/  # Config y weight.service
├── types/            # Modelos TypeScript
├── utils/            # Cálculos, validación, fechas
└── lib/              # Formateo
```

## Seguridad

Las credenciales de Firebase en el cliente son públicas por diseño. La protección real depende de **Firestore Security Rules**. El MVP actual permite lectura/escritura abierta; incorporar autenticación antes de uso público.
