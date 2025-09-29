<h1 align="center">JULIAN'S PORTFOLIO</h1>
<div align="center">
<img width="959" height="465" alt="2" src="https://github.com/user-attachments/assets/1b3c8660-6418-403f-b3ce-56693194ff96" />

  
[![vuejs](https://img.shields.io/badge/Vue-3.x-brightgreen.svg?logo=vue.js&logoColor=white)](https://vuejs.org/) [![vite](https://img.shields.io/badge/Vite-3.x-blue.svg?logo=vite&logoColor=white)](https://vitejs.dev/) [![tailwindcss](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![License](https://img.shields.io/badge/License-None-lightgrey.svg)](#license)
</div>


Welcome to the repository for my **portfolio**. Built in Vue.js and TailwindCSS, it also uses a few more libraries such as i18n for translation, three.js for the background effects and more.
![Live Portfolio](https://juinc.github.io/portfolio)

## 🚀 Features

- **Vue 3 Composition API**: Leverage the latest Vue API for scalable and maintainable code.
- **Vite-powered Build**: Super fast development and optimized production builds.
- **Hot Module Replacement (HMR)**: Lightning-fast local development experience.
- **Minimal & Clean Codebase**: Keep your project lightweight and easily extendable.
- **Modular & Customizable**: Configure Vite and Vue as per your project needs.

## 📦 Technologies Used

| Technology                        | Description                                  | Link                                                             |
|-----------------------------------|----------------------------------------------|------------------------------------------------------------------|
| Vue 3                             | Frontend progressive framework               | [vuejs.org](https://vuejs.org/)                                  |
| Vite                              | Next generation frontend tooling             | [vitejs.dev](https://vitejs.dev/)                                |
| Tailwind CSS                      | Used internally for styling                  | [tailwindcss.com](https://tailwindcss.com/)                      |
| Swiper.js                         | Swiper framework for the sliders.            | [swiperjs.com](https://swiperjs.com/)                            |
| i18n + vue-i18n                   | Used for translating the portfolio           | [i18next.com](https://www.i18next.com/)                          |
| three.js                          | Used for background effects on the portfolio | [threejs.org](https://threejs.org/)                              |
| vite-svg-loader                   | Used for svg image manipulation              | [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader) |
| font-awesome                      | Used for a few icons on the infobox          | [fontawesome.com](https://fontawesome.com/)                      |
| ogl                               | Used for animating the background effects    | [ogl](https://github.com/oframe/ogl)                             |
| gsap                              | Used for animating the background effects    | [gsap.com](https://gsap.com/)                                    |
| And more... (gh-pages & PostCSS)                                                                                                                    |


## 🎯 Getting Started
### Prerequisites
Make sure you have **Node.js** and **npm** installed on your machine.
### Installation
1. Clone the repository:
```
git clone https://github.com/juinc/portfolio.git
cd portfolio
```
2. Install dependencies:
```
npm install
```
### Running the App Locally
Start the development server with hot reload enabled:
```
npm run dev
```
### Building for Production
To create a production build, run:
```
npm run build
```
The optimized files will be output to the `dist` directory, ready to be deployed.
### Deploying
For deployment, if a github repo is connected I wrote a function which will deploy the content in the dist folder after building to a new "gh-pages" branch on the repository. To leverage this just run:
```
npm run deploy
```
## 🛠 Recommended IDE Setup
Any IDE works for this project but I used **WebStorm** so I recommend using it. 
## 📝 License
All rights reserved. See the LICENSE file for more information.
## 🏆Credits
- [svgrepo.com](https://www.svgrepo.com) for a big part of the icons (credited in the .svg files as well)
- [vue-bits.dev](https://vue-bits.dev/) for the Aurora and Particles background effects which I tailored to my needs.

---
© 2025 Portfolio by juinc
