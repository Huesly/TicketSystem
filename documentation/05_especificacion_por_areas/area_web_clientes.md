# Especificación Técnica del Área Web Clientes

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (ConfyTickets)  
**Tecnología Base:** Vue 3 (Vite + Composition API) + Pinia + Tailwind CSS  
**Enfoque:** Progressive Web App (PWA) / Responsive Web App  
**Versión:** 1.0  
**Fecha:** Noviembre 2026  

---

## 1. Propósito y Audiencia

La aplicación web para clientes ofrece una experiencia complementaria accesible desde cualquier navegador web moderno (desktop o móvil). Permite que los clientes consulten sus beneficios, administren su perfil y muestren su QR dinámico sin necesidad de descargar la app desde las tiendas de aplicaciones en su primera visita.

---

## 2. Pila Tecnológica y Arquitectura Frontend

- **Framework:** Vue 3 con `<script setup lang="ts">`.
- **Enrutamiento:** `vue-router` v4 con navegación declarativa y guardias de autenticación (`requiresAuth`).
- **Gestión de Estado:** `pinia` para sesión de usuario, tarjeta activa y catálogo.
- **Cliente HTTP:** `axios` o `fetch` nativo con interceptores para inyección automática de cabeceras `Authorization: Bearer <token>` y captura centralizada de errores 401/403.
- **PWA (Progressive Web App):** Configurado con `vite-plugin-pwa` para permitir la instalación en la pantalla de inicio del teléfono móvil (Android/iOS Safari) y soporte de caché estática vía Service Worker.

---

## 3. Matriz de Vistas y Componentes

| Ruta Web | Nombre de Vista | Componentes Principales | Acceso |
|---|---|---|:---:|
| `/` | Landing / Login | Formulario de inicio de sesión, selector de sede informativa, acceso a registro | Público |
| `/registro` | Registro | Formulario de datos personales, checkboxes obligatorios de Habeas Data | Público |
| `/recuperar` | Recuperación | Formulario de envío de correo de restablecimiento de contraseña | Público |
| `/app/home` | Inicio Cliente | Banner promocional, widget de tarjeta de 8 sellos, botón flotante de QR, vitrina de 5 productos | Protegido |
| `/app/mi-tarjeta` | Mi Tarjeta | Tarjeta grande con los 8 sellos, desglose de cálculo por compra, historial | Protegido |
| `/app/recompensas`| Recompensas | Lista de premios disponibles con modal de QR de canje (60 segundos) | Protegido |
| `/app/vitrina` | Menú Destacado | Ficha visual de los 5 cafés y productos insignia con precio en COP | Protegido |
| `/app/perfil` | Mi Perfil | Actualización de datos, preferencias de comunicación y ejercicio de derechos de privacidad | Protegido |

---

## 4. Diferencias Operativas frente a la App Móvil

1. **Geofencing:** La versión web no realiza monitoreo de ubicación en segundo plano cuando la pestaña del navegador está cerrada (limitación del estándar web). La proximidad física está reservada para la aplicación nativa móvil empaquetada con Capacitor.
2. **Push Notifications:** Soporta Web Push API estándar mediante Service Worker si el usuario lo autoriza explícitamente en navegadores compatibles (Chrome, Edge, Firefox, Safari 16.4+).
3. **Escaneo de Pantalla:** La vista de QR dinámico ajusta el fondo de la pantalla a blanco puro y maximiza el contraste para facilitar la lectura por los escáneres ópticos de caja.
