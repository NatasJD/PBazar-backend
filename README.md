# PBazar Backend

Sistema backend del proyecto PBazar desarrollado con Node.js y Express. Proporciona servicios de API REST para la gestión de datos mediante integración con base de datos MySQL.

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- XAMPP con MySQL activo
- Base de datos MySQL configurada

## Instalación

Ejecutar el siguiente comando para instalar las dependencias del proyecto:

```bash
npm install
```

## Configuración

El servidor está configurado para conectarse a una base de datos MySQL mediante XAMPP. Por defecto utiliza las siguientes credenciales:

- Host: localhost
- Usuario: root
- Contraseña: (vacía por defecto en XAMPP)
- Base de datos: pbazar_db

Asegúrese de crear la base de datos `pbazar_db` en phpMyAdmin antes de iniciar el servidor.

## Ejecución

Para iniciar el servidor en modo desarrollo con recarga automática:

```bash
npm run dev
```

Para iniciar el servidor en modo producción:

```bash
npm start
```

El servidor estará disponible en http://localhost:3000

## Estructura del Proyecto

- index.js: Punto de entrada principal del servidor
- package.json: Configuración de dependencias y scripts

## Dependencias Principales

- Express: Framework web para Node.js
- MySQL2: Cliente MySQL para Node.js

## Desarrollo

Este proyecto utiliza nodemon para el desarrollo, permitiendo la recarga automática del servidor cuando se realizan cambios en el código fuente.
