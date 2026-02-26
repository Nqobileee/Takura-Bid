# TakuraBid Final Documentation — Incorrect Details vs Actual System

**Document:** TakuraBid Final Documentation .docx (HIT200, 26 February 2026)
**Compared against:** Deployed system at https://takura-bid-six.vercel.app/

---

## Abstract

- **Wrong:** "web and mobile platform"
- **Actual:** Web only. No mobile app (no React Native, no Flutter, no PWA).

- **Wrong:** "KYC-based verification"
- **Actual:** No KYC or document verification implemented.

- **Wrong:** "secure escrow payments"
- **Actual:** No payment gateway of any kind. No EcoCash, no PayPal, no escrow.

- **Wrong:** "instant matching powered by AI driven recommendations"
- **Actual:** ML (GradientBoosting via Python FastAPI) only estimates a **price**. It does not match drivers. Driver selection is manual — client reviews submitted bids.

- **Wrong:** "verified drivers" as a concept
- **Actual:** No driver verification system. Profiles are self-reported.

---

## Chapter 1 — Section 1.3 Objectives

- **Wrong (Obj 6):** "secure digital payment ecosystem with escrow"
- **Actual:** No payment system. No escrow. No financial transactions on the platform.

---

## Chapter 1 — Section 1.6 Proposed Tools


- **Wrong:** "AES-256 encryption implemented for data protection at rest and in transit"
- **Actual:** No application-level AES-256 encryption. TLS is Vercel's default only.

- **Wrong:** "Secure WebSockets used for encrypted real-time updates (tracking and bidding)"
- **Actual:** No WebSockets. Messages use HTTP polling. No real-time bidding channel.

- **Wrong:** "Tokenized payment gateways are integrated"
- **Actual:** No payment gateway.


---

## Chapter 1 — Section 1.8 Project Plan (Gantt Chart)

- **Wrong:** "Backend (Node.js) architecture" listed as a separate component
- **Actual:** No separate backend. All API logic is Next.js Route Handlers inside the same app.

- **Wrong:** "Configuration of MySQL database for managing user profiles and bids"
- **Actual:** Database is **Supabase PostgreSQL**. MySQL is not used.

- **Wrong:** "Full integration of payment systems (PayPal/EcoCash)"
- **Actual:** No payment integration. Entirely unimplemented.

---

## Chapter 3 — Section 3.2 System Description

- **Wrong:** "OpenAI's GPT-4o API to recommend a base price"
- **Actual:** No OpenAI API. Pricing uses a custom scikit-learn GradientBoosting model via FastAPI.

- **Wrong:** "LangChain pipelines to suggest the best driver for the job"
- **Actual:** LangChain is not used anywhere in the system.

- **Wrong:** "Administrators will use Power BI for monitoring platform trends"
- **Actual:** No admin role, no Power BI integration.

---

## Chapter 3 — Section 3.6 Functional Requirements

- **Wrong (FR-03):** "Agency Profile type for fleet owners managing multiple vehicles"
- **Actual:** No agency profile. Roles are CLIENT and DRIVER only.

- **Wrong (FR-14):** "real-time notifications via WebSockets for bid/job updates"
- **Actual:** No WebSockets. `notifications` table exists but no bell UI and no real-time delivery.

- **Wrong (FR-15):** "Secure Payment Gateway with tokenization"
- **Actual:** Not implemented.

- **Wrong (FR-16):** "Escrow — funds secured upon booking"
- **Actual:** Not implemented.

- **Wrong (FR-17):** "Instant Payouts via EcoCash or PayPal"
- **Actual:** Not implemented.

---

## Chapter 3 — Section 3.7 Non-Functional Requirements

- **Wrong:** "mobile app must support Android and iOS"
- **Actual:** No mobile app.

- **Wrong:** "multilingual support (English + local languages)"
- **Actual:** English only. No i18n implemented.

---

## Chapter 4 — Section 4.2.1 Architectural / Hardware Design

- **Wrong:** "Progressive Web App (PWA) with offline access"
- **Actual:** Standard Next.js web app. No `manifest.json`, no service worker, no offline mode.

- **Wrong:** "Drivers use a mobile-optimized PWA with integrated GPS"
- **Actual:** No GPS, no PWA, no mobile app.

- **Wrong:** "CloudFlare delivers DNS and DDoS protection"
- **Actual:** Vercel's own Edge Network. CloudFlare not used.

- **Wrong:** "HAProxy/Nginx load balancer across multiple application servers"
- **Actual:** Vercel serverless functions. No Nginx or HAProxy.

- **Wrong:** "Three parallel Node.js instances with horizontal scaling"
- **Actual:** Single Next.js app on Vercel serverless. No manually managed instances.

- **Wrong:** "Dedicated Socket.io WebSocket servers for live bidding and location tracking"
- **Actual:** No Socket.io. No WebSocket servers. HTTP polling only.

- **Wrong:** "Flask-based price recommendation service"
- **Actual:** FastAPI (not Flask). GradientBoosting model. Static route table input — not live demand/fuel data.

- **Wrong:** "FastAPI driver matching service evaluates drivers by proximity, capacity, rating"
- **Actual:** FastAPI endpoint does **price estimation only**. No driver matching service.

- **Wrong:** "TensorFlow model servers predict peak demand and driver reliability"
- **Actual:** scikit-learn GradientBoosting (not TensorFlow). No demand prediction.

- **Wrong:** "Redis cache for session management"
- **Actual:** Sessions via `takura_user` cookie + localStorage. No Redis.

- **Wrong:** "Elasticsearch for load and driver searches"
- **Actual:** No Elasticsearch. Searches are direct Supabase SQL queries.

- **Wrong:** "RabbitMQ for async email and SMS notifications"
- **Actual:** No RabbitMQ. No email. No SMS.

- **Wrong:** "MySQL master database for write operations"
- **Actual:** Supabase PostgreSQL. No MySQL.

- **Wrong:** "Two MySQL read replicas"
- **Actual:** Single Supabase instance. No read replicas.

- **Wrong:** "MongoDB stores GPS history, chat messages, and logs"
- **Actual:** No MongoDB. All data (including messages) is in Supabase PostgreSQL.

- **Wrong:** "EcoCash API and PayPal API with escrow"
- **Actual:** Neither integrated.

- **Wrong:** "Twilio or Africastalking SMS gateway"
- **Actual:** No SMS service.

- **Wrong:** "SendGrid email for receipts and marketing"
- **Actual:** No email service.

- **Wrong:** "OpenAI GPT-4o for NLP of load descriptions and driver ranking"
- **Actual:** OpenAI not used. No NLP. No AI driver ranking.

- **Wrong:** "Kubernetes orchestration for containerized AI services"
- **Actual:** No Kubernetes, no Docker, no containers. Vercel serverless only.

---

## Chapter 4 — Section 4.2.2 Networking / Architecture

- **Wrong:** "hosted on Amazon Web Services (AWS)"
- **Actual:** Deployed on **Vercel**.

- **Wrong:** "React-based web and mobile applications"
- **Actual:** Web only.

- **Wrong:** "Amazon CloudFront CDN"
- **Actual:** Vercel Edge Network.

- **Wrong:** "AWS Web Application Firewall (WAF)"
- **Actual:** Not used. Vercel provides basic protection.

- **Wrong:** "Application Load Balancer (ALB)"
- **Actual:** Not used. Vercel handles routing internally.

---

## Chapter 4 — Section 4.2.3 Core Components

- **Wrong:** "Django/Node.js on Amazon ECS using AWS Fargate"
- **Actual:** No Django, no ECS, no Fargate. Next.js serverless on Vercel.

- **Wrong:** "WebSocket server via Django Channels or Node.js"
- **Actual:** No Django. No WebSocket server.

- **Wrong:** "Amazon RDS for PostgreSQL"
- **Actual:** Supabase PostgreSQL. Not Amazon RDS.

- **Wrong:** "Amazon DynamoDB for GPS telemetry"
- **Actual:** No DynamoDB. No GPS telemetry.

- **Wrong:** "Amazon S3 for KYC files and delivery photos"
- **Actual:** No S3. No file uploads of any kind.

---

## Chapter 4 — Section 4.2.6 Security and Compliance

- **Wrong:** "TLS 1.3 via AWS Certificate Manager (ACM)"
- **Actual:** TLS managed by Vercel, not AWS ACM.

- **Wrong:** "API keys stored in AWS Secrets Manager"
- **Actual:** Environment variables in Vercel dashboard and `.env.local`.

- **Wrong:** "Amazon CloudWatch for CPU, error rates, and latency monitoring"
- **Actual:** No CloudWatch. Vercel's built-in observability only.

---

## Chapter 4 — Section 6.1 Pseudocode / Algorithms

- **Wrong (Algo 1):** Queries live active loads and available drivers to compute demand-surge pricing
- **Actual:** GradientBoosting model uses distance and cargo type only. No live demand calculation.

- **Wrong (Algo 3):** Bid acceptance calls `PaymentGateway.HoldFunds()` for escrow
- **Actual:** `POST /api/bids/[bidId]/accept` creates a job record in the DB only. No payment call.

---

## Chapter 7 — Conclusion

- **Wrong:** "comprising React.js frontend, Node.js backend, and Python-based AI"
- **Actual:** Single unified **Next.js 16** full-stack app. No separate frontend/backend. Python FastAPI for pricing only.

- **Wrong:** "proven, secure technologies (AES-256 encryption, WebSockets)"
- **Actual:** Neither AES-256 nor WebSockets are implemented.

---

