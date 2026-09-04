# ✦ Verdant Noir — SupportFlow

> A modern AI-assisted service request platform connecting customers with the right workers — built in an 8-hour MERN Stack hackathon.

[![Live Demo](https://img.shields.io/badge/Live-Demo-111827?style=for-the-badge&logo=vercel&logoColor=white)](https://verdant-noir.vercel.app/)
[![Repository](https://img.shields.io/badge/GitHub-Repository-111827?style=for-the-badge&logo=github&logoColor=white)](https://github.com/HAFSA-SHAHID-28/final-hackathon)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)

---

## Overview

**Verdant Noir — SupportFlow** is a role-based service request platform designed around a simple workflow:

**Customer → Worker → Service → Completion → Review**

Customers can submit service requests, find suitable workers by category, track their requests, and review completed services.

Workers can manage incoming requests, accept or reject them, update priority and status, and complete assigned services.

Admins get a centralized view of users, workers, services, ratings, and activity.

The platform also includes **AI-powered ticket triage** to suggest a category, priority, and concise summary for incoming requests.

---

## ✦ Built in 8 Hours

This project was developed and submitted during an **8-hour MERN Stack hackathon**.

The goal was not simply to build CRUD screens, but to turn a real-world service workflow into a working full-stack application under a strict time constraint.

That meant prioritizing:

- Clear role-based workflows
- Secure backend logic
- Meaningful CRUD operations
- AI-assisted classification
- Real-time updates
- Persistent conversations
- Reviews & ratings
- A polished user experience

---

## Features

### Customer

* 🔐 Secure authentication
* 🎫 Create service requests
* 🏷️ Select service categories
* 👤 Discover category-matched workers
* ⭐ View worker ratings
* 📊 Track request status
* ✏️ Edit eligible requests
* ❌ Cancel pending requests
* 💬 Persistent request conversations
* 🔔 Real-time request updates
* ⭐ Submit 1–5 star reviews after completion

### Worker

* 🔐 Dedicated worker authentication
* 📥 View assigned requests
* ✅ Accept incoming requests
* ❌ Reject requests with a reason
* ⚡ Update request priority
* 🔄 Manage request status
* 📝 Add completion notes
* 💬 Communicate through persistent messages
* 📈 View completion statistics
* ⭐ Build a worker rating through customer reviews

### Admin

* 👥 View customers and workers
* 🔎 Inspect individual workers
* 🎫 View services handled by workers
* ⭐ Review worker ratings & feedback
* 📊 Monitor platform activity

### AI-Assisted Triage

Support requests can be analyzed using the OpenAI API to generate:

* Suggested category
* Suggested priority
* Short factual summary

AI responses are validated on the backend, with a fallback path when AI processing is unavailable.

---

## Tech Stack

### Frontend

* React 19
* React Router
* Tailwind CSS
* Framer Motion
* Axios
* Socket.IO Client
* React Icons
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Socket.IO
* Nodemailer
* Multer
* Cloudinary
* Stripe

### AI

* OpenAI API
* Server-side AI triage
* Structured JSON output
* Backend validation
* Graceful fallback handling

---

## Architecture

```text
Frontend
   │
   │ REST API + Socket.IO
   ▼
Express.js API
   │
   ├── Authentication
   ├── Customer APIs
   ├── Worker APIs
   ├── Admin APIs
   ├── AI Triage
   └── Real-time Events
   │
   ▼
MongoDB
   │
   ├── Users
   ├── Tickets
   ├── Messages
   └── Reviews
```

---

## Data Models

### User

Handles:

* Customer / Worker / Admin roles
* Authentication
* Worker service categories
* Worker ratings
* Account status

### Ticket

Stores:

* Ticket number
* Customer
* Assigned worker
* Category
* Priority
* Status
* AI triage data
* Rejection / cancellation reason
* Completion notes

### Message

Stores persistent customer-worker communication for each request.

### Review

Stores customer feedback and rating for completed services.

---

## Request Lifecycle

```text
Pending
   │
   ├──────────────► Rejected
   │
   ▼
Accepted
   │
   ▼
In Progress
   │
   ▼
Completed
   │
   ▼
Customer Review
```

Requests that reach a terminal state cannot simply be moved forward again, keeping the workflow consistent.

---

## Security & Validation

The backend enforces role-aware access and request ownership.

Key protections include:

* JWT-based authentication
* Protected routes
* Role-based authorization
* Customer ownership checks
* Worker assignment checks
* Request status validation
* Priority validation
* AI output validation
* Password hashing with bcrypt
* Server-side environment variables
* Terminal-state protection

---

## Real-Time Communication

**Socket.IO** is used to keep important request activity synchronized between users.

The application supports real-time ticket updates and user-specific socket rooms, allowing customer and worker views to react to request changes without relying entirely on manual refreshes.

---

## Live Demo

### 🌐 [Open Verdant Noir](https://verdant-noir.vercel.app/)

### 💻 [View Source on GitHub](https://github.com/HAFSA-SHAHID-28/final-hackathon)

---

## Hackathon Snapshot

|                    |                            |
| ------------------ | -------------------------- |
| **Project**        | Verdant Noir — SupportFlow |
| **Build Time**     | 8 Hours                    |
| **Architecture**   | MERN Stack                 |
| **Authentication** | JWT + Role-Based Access    |
| **Database**       | MongoDB                    |
| **AI**             | OpenAI API                 |
| **Real-Time**      | Socket.IO                  |
| **Deployment**     | Vercel                     |

---

## What I Took Away

Building under an 8-hour constraint changed the way I approached development.

Instead of trying to make everything perfect, I had to identify the **core workflow, make the backend rules reliable, connect the pieces quickly, and keep the experience usable.**

It was a practical exercise in turning requirements into a working product — under pressure, with limited time, and with every architectural decision carrying a cost.

---

## Author

### Hafsa Shahid

**MERN Stack Developer**

Building, learning, and turning ideas into working products.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Hafsa%20Shahid-0A66C2?style=flat-square\&logo=linkedin\&logoColor=white)](https://www.linkedin.com/in/hafsa-shahid-dev/)

---

<p align="center">
  Built with React, Node.js, MongoDB & a very tight deadline.
  <br />
  <strong>8 hours. One idea. One working product.</strong>
</p>
```
