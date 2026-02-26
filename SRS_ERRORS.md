# TakuraBid SRS — Incorrect Details vs Actual System

**Document:** TakuraBid doc.docx (SRS_TakuraBid_V1.0_2025, 48 pages)
**Compared against:** Deployed system at https://takura-bid-six.vercel.app/


---

## Page 2
- **Wrong:** "mobile and web interface"
- **Actual:** Web only. No mobile app exists (no React Native, no Flutter).

---

## Page 3
- **Wrong:** "centralized ride-hailing and freight management application"
- **Actual:** Freight only. No ride-hailing component.
- **Wrong:** "Secure in-app payment processing and invoice generation" listed as core feature
- **Actual:** No payment gateway implemented. No invoice generation.

---

## Page 4
- **Wrong:** "web and mobile-based application... driver app... administrator dashboard"
- **Actual:** Single unified Next.js web app. No mobile app. No admin dashboard.
- **Wrong:** "integrates with payment gateway... SMS and email alerts"
- **Actual:** None of these are integrated. Only external integration is a Python FastAPI ML pricing endpoint.

---

## Page 5
- **Wrong:** "Payments processed through EcoCash, PayPal, and Stripe"
- **Actual:** No payment gateway implemented.
- **Wrong:** "KYC-based verification for drivers and clients"
- **Wrong:** "Mobile and web applications"
- **Actual:** Web only.

---

## Page 6
- **Wrong:** "Supports multiple payment methods including mobile money and debit/credit cards"
- **Actual:** Not implemented.

---

## Page 7
- **Wrong:** "Payment gateways for secure financial transactions"
- **Actual:** Not implemented.

---

## Page 8
- **Wrong:** "Mobile app: Android (Phase 1), iOS (Phase 2)"
- **Actual:** No mobile app.
- **Wrong:** "Hosting: AWS / Google Cloud"
- **Actual:** Deployed on **Vercel**.
- **Wrong:** "Database: MySQL / PostgreSQL"
- **Actual:** **Supabase PostgreSQL only**. No MySQL.
- **Wrong:** "AI Integration: OpenAI API for recommendations"
- **Actual:** Custom Python FastAPI GradientBoosting model. No OpenAI API.
- **Wrong:** "Payment Gateways: EcoCash, PayPal, Stripe"
- **Actual:** None integrated.
- **Wrong:** "mobile app must function in offline mode"
- **Actual:** No mobile app. No offline mode.

---

## Page 9
- **Wrong:** "Drivers possess smartphones with GPS"
- **Actual:** GPS is never used anywhere in the system.
- **Wrong:** "Availability of OpenAI and Google AI APIs required"
- **Actual:** Neither is used.
- **Wrong:** Uses term "trips" throughout
- **Actual:** Correct domain terms: **load** (posted by client), **bid** (submitted by driver), **job** (created on bid acceptance).

---

## Pages 9–10 — Trip/AI Matching Features
- **Wrong:** "fare automatically deducted and transferred to driver's account after completion"
- **Actual:** No payment processing. No automatic transfers.
- **Wrong:** "Trips categorised as immediate, scheduled, or contract-based"
- **Actual:** Load statuses are: In Bidding, Assigned, In Transit, Completed.


---

## Pages 11–28 — ENTIRE SECTION IS WRONG CONTENT
- **Wrong:** These 18 pages describe a **Ministry of Labour employment portal** — job seekers, employers, CV/resume upload, NLP resume parsing, Arabic/English language support, Schema.org JobPosting standards, MoL/PEF government database integration, talent pools, candidate shortlisting, salary analytics, CMS/FAQ system.
- **Actual:** None of this relates to TakuraBid. This content appears copy-pasted from a completely different SRS document. TakuraBid has no job seeker role, no employer role, no resume parsing, no government database integration, and no content management system.

---

## Page 31
- **Wrong:** "system SHALL provide recommendation results from **OpenAI APIs** within 5 seconds"
- **Actual:** No OpenAI API. Pricing comes from a custom Python FastAPI endpoint.

---

## Pages 32–34
- **Wrong:** "scale horizontally using AWS ECS containers" (NFR-16), "increase resources on AWS instances" (NFR-17), "store API keys using AWS Secrets Manager" (NFR-30), "log events using AWS CloudWatch" (NFR-39), "intrusion detection in AWS environment" (NFR-41), "recover from AWS service failures" (NFR-53), "circuit breaker patterns for OpenAI and Google Maps" (NFR-54)
- **Actual:** No AWS infrastructure. Deployed on **Vercel**. No CloudWatch, no ECS, no Secrets Manager. No OpenAI or Google Maps dependencies.

---

## Page 37
- **Wrong (NFR-81):** "modular architecture: React frontend, **Django backend**, PostgreSQL DB"
- **Actual:** No Django. No separate backend. Stack is **Next.js 16 full-stack** (App Router handles both frontend and API Route Handlers), TypeScript, Tailwind CSS, Supabase PostgreSQL.

---

## Pages 39–43 — Diagrams
- **Wrong:** Diagram labels include "Load seeker," "Employer," "Employer registration," "Job seekers use case diagram," "Employers use case diagram"
- **Actual:** These labels belong to the unrelated job portal content (pages 11–28). TakuraBid roles are CLIENT and DRIVER only.



---

