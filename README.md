# TakuraBid – Digital Freight Marketplace  

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)
![Java](https://img.shields.io/badge/Backend-Java%20(Spring%20Boot)-007396?logo=java&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

---

## Overview

**TakuraBid** is a digital freight marketplace that connects clients with trusted truck drivers in real time.  
The platform promotes transparent bidding, secure payments, and verified driver profiles — helping reduce empty trips and promote fair, efficient logistics in Zimbabwe’s transport sector.

> Developed as part of the **HIT200 Software Engineering Project**

---

## Objectives

- Build a digital logistics platform that connects truck drivers with clients  
- Enable real-time communication between drivers and clients  
- Integrate live GPS tracking for truck monitoring  
- Allow drivers to bid for available loads  
- Recommend the most suitable driver for a specific load  
- Generate reports and analytics on driver performance and platform activity  

---

## Tech Stack

| Layer | Technology | Description |
|:------|:------------|:-------------|
| **Frontend** | [React.js](https://react.dev/) | Responsive and dynamic user interface |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework for fast, consistent design |
| **Backend** | [Java (Spring Boot)](https://spring.io/projects/spring-boot) | RESTful API and business logic layer |
| **Database** | MySQL / PostgreSQL | Manages user, load, and transaction data |
| **Authentication** | JWT + Spring Security | Provides secure login and role-based access |
| **APIs** | Google Maps API | Enables location tracking and mapping features |
| **Deployment** | Docker / Render / Railway *(planned)* | Supports scalable, cloud-based deployment |

---

## System Architecture

[ React.js + Tailwind CSS (Frontend) ]
|
↓
[ Java Spring Boot (Backend API) ]
|
↓
[ Database Layer ]

This architecture supports scalability, modular development, and secure communication between the client interface and backend services.

---

## Key Features

- Real-time bidding system for loads  
- Verified driver profiles and performance tracking  
- Live GPS tracking for active deliveries  
- Secure payment processing and transaction history  
- Data-driven reports and analytics  
- Separate dashboards for clients, drivers, and administrators  

---

## Future Enhancements

- AI-based driver recommendation system  
- Native mobile app (React Native)  
- Integration with local digital payment systems (EcoCash, PayNow)  
- Enhanced driver rating and feedback system  

---

## Team Members

| Name | Role |
|------|------|
| Edith N. Muyambiri | Frontend Development / UI Design |
| Matips B Machangu | Backend Development |
| Nyasha Nyekete | Database & API Integration |
| Princess B Kwaniya | Documentation & Testing |

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/takurabid.git
cd takurabid

2. Run the frontend

cd client
npm install
npm start

3. Run the backend

cd server
./mvnw spring-boot:run

4. Access the application

Open your browser and go to:
http://localhost:3000

⸻

License

This project is licensed under the MIT License — free to use, modify, and distribute with attribution.

⸻

Contact

For inquiries or collaboration:
📧 contact@takurabid.com

⸻

TakuraBid — Empowering Zimbabwe’s transport sector through technology.

---

 