# FitFat

Aplicación personal de seguimiento de peso construida con Next.js, TypeScript, Firebase y Tailwind CSS.

## Funcionalidades

- Registrar peso con fecha
- Gráfico de evolución (Recharts)
- Resumen: peso actual, inicial, cambio total y promedio semanal
- Vista semanal agrupada (lunes a domingo)
- Listado responsive (tabla en desktop, cards en mobile)
- Persistencia en Firestore

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
