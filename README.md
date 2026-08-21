# 🏡 UrbanNest Lifestyle Store - Digital Transformation Project

> **Mini Hackathon Challenge**: Taking a Local Offline Shop Online  
> 🌐 **Live Web Application**: [https://urbannest-lifestyle-store-ux4q.onrender.com/](https://urbannest-lifestyle-store-ux4q.onrender.com/)  
> ⚡ **Integrations**: N8N.io AI Chatbot + N8N.io Customer Query Form  

---

## 📌 Problem Statement

"UrbanNest Lifestyle Store" is a traditional offline local business selling home décor, gift items, stationery, lifestyle accessories, and small household products. Operating exclusively through its brick-and-mortar store limited its reach to nearby foot traffic and constrained customer engagement.

The goal of this project is to take UrbanNest online with an extraordinary, modern, interactive web application featuring automated customer inquiry handling and AI assistant support powered by **N8N.io**.

---

## ✨ Proposed Solution

We built a full-stack commercial-grade digital retail web application for UrbanNest with:

1. **Stunning & Responsive Landing Page**: Warm glassmorphism aesthetic, high-resolution lifestyle photography, micro-animations, light/dark theme toggle, hero slider, and prominent call-to-action buttons.
2. **Front Dashboard N8N AI Chatbot**: Embedded directly on the front landing dashboard for instant customer Q&A (Store Timings, Product Catalog, Physical Location, Shipping Policy, Discount Codes).
3. **N8N Customer Query Form**: Connected directly via backend proxy (`/api/query`) to N8N webhook workflows, providing instant submission feedback, success toast notifications, and custom tracking reference IDs (`UN-XXXXXX`).
4. **Interactive Product Catalog**: Live keyword search, category filter pills (Home Décor, Gifts, Stationery, Lifestyle, Household), ratings, and badges.
5. **Shopping Cart & Checkout Simulation**: Slide-out drawer with quantity controls, free shipping status threshold ($50), promo coupon applier (`URBAN10`), and subtotal calculation.
6. **Physical Store Info & Google Maps Embed**: Direct store hours table, phone/email contact, and interactive location map.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System, Glassmorphism, CSS Variables), JavaScript (ES6+ Modules)
- **Design & Typography**: Google Fonts (`Outfit` + `Plus Jakarta Sans`), Dark & Light Theme system
- **Backend Server**: Node.js, Express.js
- **Integrations**: N8N.io Asynchronous Webhooks (`/api/query` and `/api/chat`)
- **Deployment Platform**: Render (`render.yaml` Infrastructure-as-Code blueprint)

---

## 👥 Team Member Contributions

| Team Member | Role & Responsibilities | Key Deliverables |
| :--- | :--- | :--- |
| **Member 1** | **UI/UX & Landing Page Lead** | Designed visual design system, dark/light themes, micro-animations, responsive layout, and hero graphics. |
| **Member 2** | **Full-Stack Web Developer** | Implemented Express backend (`server.js`), Product Search/Filter API, Shopping Cart Drawer logic, and state management. |
| **Member 3** | **AI/Chatbot & N8N Integration / DevOps** | Integrated N8N query form & front dashboard chatbot proxy handlers, configured fallback AI engine, and handled Render deployment. |

---

## ⚡ N8N.io Integration Details

The application seamlessly connects to N8N.io through dedicated server-side proxy endpoints to avoid CORS issues and protect webhook credentials.

### 1. Customer Query Form Workflow (`/api/query`)
- **Frontend Submission**: User inputs Name, Email, Phone, Category, and Message.
- **Backend Forwarder**: Express receives POST at `/api/query` and forwards payload asynchronously to `N8N_QUERY_WEBHOOK_URL`.
- **Payload Schema**:
  ```json
  {
    "submissionId": "UN-582914",
    "timestamp": "2026-08-21T15:00:00.000Z",
    "name": "Customer Name",
    "email": "customer@example.com",
    "phone": "+1 555 019 2834",
    "category": "Product Inquiry",
    "message": "Do you have wholesale availability for soy candles?"
  }
  ```
- **N8N Action**: Triggers internal notification, logs entry into database/Airtable/Google Sheets, and sends confirmation email to customer.

### 2. Front Dashboard AI Chatbot Workflow (`/api/chat`)
- **Front Dashboard Interface**: Embedded directly on the main landing dashboard with quick preset prompt pills.
- **Backend Forwarder**: Express receives POST at `/api/chat` and passes prompt to `N8N_CHATBOT_WEBHOOK_URL`.
- **Resilient Fallback Engine**: If N8N webhook URL is offline or unconfigured during offline testing, the Express backend automatically executes a smart local AI concierge engine trained on UrbanNest store details, ensuring zero presentation downtime!

---

## 🚀 Deployment Instructions on Render

### Step 1: Push Repository to GitHub
```bash
git init
git add .
git commit -m "Initial commit - UrbanNest Lifestyle Store"
git remote add origin https://github.com/your-username/urbannest-lifestyle-store.git
git push -u origin main
```

### Step 2: Deploy to Render
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository `urbannest-lifestyle-store`.
4. Configure standard settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Set Environment Variables:
   - `PORT`: `10000`
   - `N8N_QUERY_WEBHOOK_URL`: `<your-n8n-query-webhook-url>`
   - `N8N_CHATBOT_WEBHOOK_URL`: `<your-n8n-chatbot-webhook-url>`
6. Click **Create Web Service**.

Alternatively, Render will automatically auto-detect `render.yaml` and configure all settings with 1-click!

---

## 🔮 Future Improvements

1. **Live Inventory & Stripe Payment Integration**: Connect online checkout directly to physical store POS inventory & live payment gateways.
2. **Customer Order Status Tracking**: Allow customers to track their local delivery driver via N8N WhatsApp notification triggers.
3. **Personalized AI Gift Finder**: Enhanced N8N workflow recommendation engine asking 3 quick questions to suggest ideal gift packages.
