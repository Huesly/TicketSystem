# Especificación Técnica del Área Mobile (Android & iOS)

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (ConfyTickets)  
**Tecnología Base:** Ionic Framework 7 + Vue 3 (Composition API) + Capacitor 6  
**Lenguaje:** TypeScript  
**Versión:** 1.0  
**Fecha:** Noviembre 2026  

---

## 1. Visión y Principios de la Experiencia Móvil

La aplicación móvil es el punto de contacto primario del cliente con la marca en la cafetería. Su diseño está orientado a la agilidad:
- El cliente debe poder desplegar su código QR dinámico en **máximo 2 toques** desde que abre la app.
- La tarjeta de 8 sellos debe reflejar de inmediato el progreso tras pagar en caja, con retroalimentación háptica y animaciones sutiles.
- Paleta visual cálida inspirada en café de especialidad (tonos crema, moca, café tostado y caramelo).

---

## 2. Pila Tecnológica y Plugins de Capacitor

| Capacidad | Paquete / Plugin | Justificación Técnica |
|---|---|---|
| **Núcleo UI** | `@ionic/vue`, `ionicons` | Componentes adaptativos con look nativo (Material Design en Android, Cupertino en iOS). |
| **Estilos** | `tailwindcss`, `@tailwindcss/forms` | Diseño rápido, responsive y consistente. |
| **Estado Global** | `pinia`, `pinia-plugin-persistedstate` | Gestión de sesión de usuario, tarjeta activa y caché de vitrina. |
| **Almacenamiento Seguro**| `@capacitor/preferences` | Guardado de tokens JWT de sesión cifrados en hardware (Keystore / Keychain). |
| **Notificaciones Push** | `@capacitor/push-notifications` | Registro de tokens de dispositivo en FCM y recepción de push transaccionales. |
| **Háptica / Vibración** | `@capacitor/haptics` | Vibración suave (`ImpactStyle.Light`) al ganar un sello; vibración triunfal (`NotificationType.Success`) al completar 8 sellos. |
| **Cercanía / Geocerca** | `@capacitor-community/geofencing` | Detección de entrada a la geocerca de 150m de cada sede sin rastreo continuo de GPS en servidor. |
| **Estado de Red** | `@capacitor/network` | Detección de desconexión y manejo de interfaz fuera de línea. |

---

## 3. Arquitectura de Pantallas y Navegación

Estructura de navegación inferior (Bottom Tabs):

```text
[ Tabs Navigation ]
├── Tab 1: Inicio (Home)
│   ├── Saludo personalizado y banner activo
│   ├── Tarjeta de sellos compacta (widget de progreso hacia la recompensa)
│   ├── Botón flotante prominente: "Mostrar mi QR"
│   └── Vitrina de 5 productos destacados
├── Tab 2: Mi Tarjeta (Loyalty)
│   ├── Tarjeta digital expandida (8 casillas de sellos visuales)
│   ├── Desglose de sellos ganados y regla de cálculo
│   └── Historial cronológico de movimientos (sellos, fechas y sedes)
├── Tab 3: Recompensas (Rewards)
│   ├── Lista de recompensas disponibles (con botón "Redimir")
│   ├── Pantalla modal con QR dinámico de redención (60s)
│   └── Historial de premios canjeados
├── Tab 4: Vitrina (Menu)
│   ├── Vista detallada de los productos destacados del mes
│   └── Ficha con ingredientes, notas de cata y precio orientativo COP
└── Tab 5: Perfil (Settings & Privacy)
    ├── Datos de cuenta y edición de nombre
    ├── Configuración de notificaciones (Interruptor de Marketing / Cercanía)
    ├── Política de Tratamiento de Datos (Ley 1581) y revocaciones
    └── Cerrar sesión
```

---

## 4. Especificación de Componentes Críticos

### 4.1. Componente Tarjeta de 8 Sellos (`LoyaltyCardWidget.vue`)
- Representa una cuadrícula de 2 filas × 4 columnas (total 8 sellos).
- Cada casilla puede estar en estado:
  - `STAMPED`: Ícono de taza de café llena con brillo cálido.
  - `EMPTY`: Círculo punteado minimalista con fondo beige suave.
  - `REWARD_SLOT`: Casilla número 8 decorada como paquete de regalo o trofeo.
- Al llegar al sello número 8, el widget dispara una animación de confeti ligero y un llamado a la acción: *"¡Felicidades! Tienes una recompensa lista para redimir"*.

### 4.2. Modal de QR Dinámico (`QrPurchaseModal.vue`)
- Realiza una petición `POST /me/qr/purchase`.
- Renderiza el código QR mediante la librería `qrcode.vue`.
- Incorpora una barra de progreso regresiva circular de 60 segundos.
- Por debajo del QR se muestra un código alfanumérico legible de contingencia de 6 caracteres (ej. `CFY-842`) por si el lente de la cámara del cajero tiene suciedad o bajo brillo de pantalla.
- Cuando el contador llega a 0, se superpone un velo semi-transparente con el mensaje *"Código expirado"* y un botón de un toque para *"Actualizar código"*.
- El brillo de la pantalla del dispositivo se incrementa temporalmente al abrir este modal mediante `@capacitor-community/screen-brightness` para facilitar el escaneo.

### 4.3. Motor de Geofencing Local (`geofenceService.ts`)
- Al iniciar sesión con éxito y si el cliente activó el permiso de ubicación, la app descarga las coordenadas de las sedes activas (`GET /stores/geofences`).
- Registra cada sede como una región perimetral de 150 metros en el sistema operativo (Android Geofence API / iOS CoreLocation Region Monitoring).
- Al dispararse el evento de entrada, la app verifica:
  1. ¿El usuario tiene activada la categoría `'proximity'` en sus preferencias?
  2. ¿Han pasado más de 24 horas desde la última alerta de cercanía?
  3. ¿La hora actual está dentro del horario de apertura de la sede?
- Si todo es afirmativo, se muestra una notificación local mediante `@capacitor/local-notifications`.

---

## 5. Manejo Offline y Sincronización

1. **Lectura de Tarjeta sin Conexión:** Si el usuario no tiene conexión de red al abrir la app, Pinia carga el último snapshot guardado en almacenamiento local y muestra un distintivo: *"Mostrando datos guardados"*.
2. **Restricción de Códigos QR:** La generación de códigos QR dinámicos requiere obligatoriamente validación en servidor para garantizar que no se utilicen tokens expirados o falsificados. Si el usuario intenta generar un QR sin conexión, se le informa amablemente: *"Necesitas conexión a internet para generar tu código seguro de compra"*.
