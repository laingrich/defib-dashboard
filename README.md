# defib-dashboard (defib-dashboard)

# Cornwall Defibrillator Map

A single-page Vue.js application that displays a map of defibrillators across Cornwall managed by Duchy Defibrillators

** IT DOES NOT SHOW ALL DEFIBRILLATORS AND NOT INTENDED FOR EMERGENCY USE **

It also showcases the last 5 defibrillator deployments and provides scrolling status messages.

This project was constructed as a summer project for a Level 4 Software Apprenticeship.

## Features
1. **Interactive Map** - A dynamic map that displays defibrillator locations in Cornwall.
2. **Recent Deployments** - A segment highlighting the last 5 defib deployments in the area.
3. **Status Messages** - A scrolling ticker of important status messages related to defibrillator usage and updates.

## Technologies Used

- **Vue.js**: The progressive JavaScript framework used for building the UI.
- **Quasar**: A high-performance Material Design component suite with builders for Vue.js.
- **Firestore**: The cloud-native NoSQL database from Firebase used to store and retrieve defibrillator data.
- **Firebase Hosting**: Hosting platform used to serve and host the web application.

## Getting Started

### Prerequisites

- Node.js (LTS version)
- Vue CLI
- Firebase CLI

### Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone 
   cd cornwall-defibrillator-map


## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

### Deploy to live
```bash
firebase deploy

