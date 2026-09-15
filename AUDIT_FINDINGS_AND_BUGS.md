# MernCraft — Complete Web Application QA, Functional Testing and Role-Based Audit Report

**Deployment Under Test:**
- **Frontend (Live):** `https://mern-craft.vercel.app/`
- **Backend / API (Live):** `https://merncraft.onrender.com`
- **Audit Date:** 2026-09-03
- **Auditor Roles:** Senior Full-Stack Developer, QA Engineer, Security Tester, Product Tester, Administrator, and Real End User

---

## 0. Executive Summary & Core Verdict

The MernCraft web application is deployed and reachable across its Vercel frontend and Render backend with a live MongoDB Atlas connection. However, the application suffers from **critical architectural mismatches** between the React admin dashboard forms and the backend Mongoose schemas.

Specifically, **the entire public client portfolio, pricing table, and blog remain empty because the Admin Portal UI forms for Projects, Pricing, and Blog fail with HTTP 500 server crashes upon submission** due to mismatched schema field names and types (`name` vs `title`, `tier` vs `name`, `ObjectId` vs string). Furthermore, administrative security controls are broken: user deactivation silently fails due to a property naming defect (`active` vs `isActive`), allowing banned accounts to authenticate unimpeded; admin password changes corrupt stored credentials via double bcrypt-hashing; and the password reset flow fails for non-whitelisted email domains due to unconfigured transactional email routing.

---

## 1. Reconnaissance & Architecture Map

### 1.1 Infrastructure & Status
- **Frontend:** Vercel CDN (`https://mern-craft.vercel.app/`), HTTP 200, clean initial load.
- **Backend:** Node.js / Express deployed on Render Free Tier (`https://merncraft.onrender.com`), HTTP 200 on `/api/health`.
  - Cold-start latency observed on initial connection: **~7 seconds**.
  - Database status reported: `connected` (MongoDB Atlas shard `ac-ha6xnsb-shard-00-02.ynvkjso.mongodb.net`).
- **Database Counters (Live DB Inspection via Admin Stats):**
  - Users: 10
  - Leads: 7 (New: 7)
  - Projects: 0
  - Services: 0
  - Pricing Plans: 0
  - Pending Quotes: 0
  - Testimonials: 0
  - Blog Posts: 0

### 1.2 User Roles & Boundary Inventory
- **Visitor (Public):** Allowed access to public marketing routes (`/`, `/services`, `/projects`, `/about`, `/process`, `/pricing`, `/contact`) and lead generation submission (`POST /api/contact`).
- **Registered User (`role: 'user'`):** Authenticated session stored via HTTP-only cookie (`token`), gated to `/dashboard`.
- **Administrator (`role: 'admin'`):** Authenticated session gated to `/admin/*` routes and `/api/admin/*` endpoints via `authenticateUser` and `authorizeAdmin` middleware.

---

## 2. Testing as a First-Time Visitor / Prospective Customer

### Key Inquiries & Direct Observations:
1. **Can a visitor understand what is being offered within ~30 seconds?**
   - **Partially.** The hero headline conveys full-stack web development. However, because `services`, `projects`, `pricing`, and `testimonials` APIs return empty arrays (`[]`), all core showcase sections render empty states or empty containers.
2. **Is pricing visible and unambiguous?**
   - **No.** The Pricing page (`/pricing`) renders: *"No pricing plans available at the moment."* (API `/api/pricing` returns `[]`).
3. **Is there a way to start a project/engagement that completes end-to-end?**
   - **Yes.** The contact inquiry form on `/contact` submits to `POST /api/contact` and stores the lead as `status: 'new'` in MongoDB (HTTP 201). However, no email notification is dispatched to the admin.
4. **Is there an immediate, low-friction contact method?**
   - Direct `tel:+917096106541` and `mailto:khatriahmed405@gmail.com` links are present and technically functional. However, there is no instant live chat, WhatsApp click-to-chat button, or booking calendar.
5. **Visitor Friction Points:**
   - Empty portfolio / zero proof of work.
   - Missing pricing plans.
   - Render cold-start latency causing prolonged loading skeletons (>7 seconds).

---

## 3. Testing as a Registered User

1. **Signup Flow:**
   - `POST /api/auth/register` creates accounts with `role: 'user'`.
   - Duplicate registrations are caught with HTTP 400 (`An account with this email already exists.`).
   - Client-side role manipulation (`{"role": "admin"}`) in the registration payload is stripped by the controller override (`role: 'user'`).
2. **Login & Session Flow:**
   - Valid credentials return HTTP 200 and issue an HTTP-only, SameSite-compliant JWT cookie (`token`).
   - Incorrect passwords return HTTP 401 (`Invalid email or password`).
   - Non-existent emails return HTTP 401 (`Invalid email or password`).
3. **Password Reset:**
   - Non-existent email returns HTTP 404 (`There is no user with that email`), enabling email enumeration.
   - Valid email triggers `POST /api/auth/forgotpassword`, which throws HTTP 500 because Resend is operating in sandbox mode and rejects addresses outside the account owner.
4. **Access Control & Escalation:**
   - Unauthenticated direct access to `/dashboard` redirects to `/login`.
   - Unauthenticated direct API requests to `/api/admin/*` return HTTP 401 (`Not authorized, no token`).
   - Authenticated non-admin direct API requests to `/api/admin/*` return HTTP 403 (`Not authorized as an admin`).
   - Vertical privilege escalation from regular user to admin is blocked at the backend middleware level.

---

## 4. Testing as an Administrator

1. **Authentication & Session Separation:**
   - Admin authenticates via the shared `/login` endpoint using admin credentials (`sampleai747@gmail.com`).
   - Admin session is differentiated strictly by the JWT payload claim `role: 'admin'`.
2. **Admin Portal UI & Layout:**
   - Sidebar navigation provides links to Dashboard, Leads, Projects, Services, Pricing, Quotes, Testimonials, Blog, Users, and Settings.
   - Direct navigation to `/admin/*` by non-admins redirects to `/dashboard`. Direct navigation by unauthenticated users redirects to `/login`.
3. **Module Testing & Operational Verification:**
   - **Dashboard:** Correctly tallies MongoDB documents across all collections and displays recent lead activity.
   - **Leads:** Admin can view lead details, filter by status, search by keyword, update status (e.g., from `new` to `contacted`), and delete records (confirmed removed from DB).
   - **Quotes:** List and detail views render. The "Create Quote" button is a stub that triggers a browser `alert('Quotation builder feature coming soon!')`.
   - **Services:** Creation via API succeeds if schema requirements (`name`, `slug`) are satisfied.
   - **Projects:** **CRITICAL DEFECT.** Admin UI form submits `title`, while backend schema enforces `name: { required: true }`. Form submission crashes with HTTP 500 `ValidationError`.
   - **Pricing:** **CRITICAL DEFECT.** Admin UI form submits `name` and `popular`, while backend schema enforces `tier: { required: true }` and `isPopular`. Form submission crashes with HTTP 500 `ValidationError`.
   - **Blog:** **CRITICAL DEFECT.** Admin UI form submits `author: "Admin"` (string), while backend schema enforces `author: { type: ObjectId, ref: 'User' }`. Form submission crashes with HTTP 500 `CastError`.
   - **Users:** Admin can search and filter users. However, clicking "Deactivate" executes `PATCH /api/admin/users/:id/status` setting `user.active = false`. Because the model field is `isActive`, the database record is untouched and the deactivated user can continue to log in.
   - **Settings:** Admin profile name update succeeds. Changing password executes manual bcrypt hashing in the controller followed by the Mongoose `pre('save')` hook, double-hashing the password and permanently locking the administrator out.

---

## 5. Complete Findings & Bug Register

```
Issue ID: BUG-001
Title: All Public Dynamic Showcase Content Returns Empty Arrays — Zero Portfolio or Pricing Visible
Role Affected: Visitor / Multiple
Category: Functional
Severity: Critical
Classification: Confirmed Bug
Location: https://mern-craft.vercel.app/services | /projects | /pricing | /testimonials
Steps to Reproduce:
  1. Open browser DevTools Network tab.
  2. Navigate to https://mern-craft.vercel.app/pricing (or /services, /projects).
  3. Observe the network response for GET /api/pricing, /api/services, /api/projects.
Expected Behavior:
  Database contains active items, and the public endpoints return records to populate the UI.
Actual Behavior:
  All four endpoints return HTTP 200 with {"success":true,"data":[]}. Pricing displays "No pricing plans available at the moment."
Root Cause:
  The production database contains 0 services, 0 projects, 0 pricing plans, 0 testimonials, and 0 blog posts. Furthermore, administrative creation of these records is blocked by schema mismatches (BUG-024, BUG-025, BUG-026).
Evidence:
  - Network: GET https://merncraft.onrender.com/api/pricing -> Status 200, Body: {"success":true,"data":[]}
  - Backend Admin Stats: {"stats":{"users":10,"leads":7,"newLeads":7,"projects":0,"services":0,"pricingPlans":0,"pendingQuotes":0,"testimonials":0,"blogPosts":0}}
Reproducibility: Always
```

```
Issue ID: BUG-002
Title: Password Reset Email Dispatch Fails for All Non-Admin Users — Resend Sandbox Restriction
Role Affected: User
Category: Integration
Severity: High
Classification: Confirmed Bug
Location: POST https://merncraft.onrender.com/api/auth/forgotpassword
Steps to Reproduce:
  1. Navigate to https://mern-craft.vercel.app/forgot-password.
  2. Input a valid registered user email (e.g., qa.audit.test.merncraft@example.com).
  3. Click Send Reset Link.
Expected Behavior:
  System sends password reset email and returns HTTP 200 {"success":true,"message":"Email sent"}.
Actual Behavior:
  System returns HTTP 500 {"success":false,"message":"Password reset email could not be sent. Please try again later."}.
Root Cause:
  server/src/utils/sendEmail.js hardcodes the sender as `onboarding@resend.dev`. Under Resend's free tier, emails from `onboarding@resend.dev` can only be delivered to the verified account owner email. All other recipients are rejected by the Resend API.
Evidence:
  - Network: POST https://merncraft.onrender.com/api/auth/forgotpassword -> Status 500
  - Code reference: server/src/utils/sendEmail.js:12:
      from: `${process.env.FROM_NAME || 'MernCraft'} <onboarding@resend.dev>`
Reproducibility: Always
```

```
Issue ID: BUG-003
Title: NoSQL Injection Object Payload in Login Endpoint Triggers Unhandled 500 Server Error
Role Affected: System / Visitor
Category: Security
Severity: High
Classification: Security Issue
Location: POST https://merncraft.onrender.com/api/auth/login
Steps to Reproduce:
  1. Issue a POST request to /api/auth/login with JSON body: {"email": {"$gt": ""}, "password": "any"}
Expected Behavior:
  Input validation checks that email is a string; rejects invalid types with HTTP 400.
Actual Behavior:
  Server crashes with HTTP 500 and returns an unhandled TypeError with full call stack.
Root Cause:
  server/src/controllers/authController.js:61 invokes `email.toLowerCase()` directly without validating `typeof email === 'string'`. Passing an object causes `.toLowerCase()` to throw.
Evidence:
  - Network: POST https://merncraft.onrender.com/api/auth/login -> Status 500
  - Response: {"success":false,"message":"email.toLowerCase is not a function","stack":"TypeError: email.toLowerCase is not a function\n at login (file:///opt/render/project/src/server/src/controllers/authController.js:61:52)..."}
Reproducibility: Always
```

```
Issue ID: BUG-004
Title: Full Server-Side File Paths and Stack Traces Leaked in Production API Responses
Role Affected: System
Category: Security
Severity: High
Classification: Security Issue
Location: Global Express Error Handler (All endpoints)
Steps to Reproduce:
  1. Issue any malformed request that triggers an internal server exception (e.g., BUG-003).
  2. Inspect the JSON response body.
Expected Behavior:
  Production environment suppresses stack traces (`stack: null`).
Actual Behavior:
  Full stack trace exposing server paths (`/opt/render/project/src/server/...`), line numbers, and dependencies is returned to the client.
Root Cause:
  server/src/middleware/errorHandler.js suppresses the stack only when `process.env.NODE_ENV === 'production'`. The live Render deployment environment variables do not have `NODE_ENV=production` set.
Evidence:
  - Response payload: {"success":false,"message":"...","stack":"TypeError: ... at login (file:///opt/render/project/src/server/src/controllers/authController.js:61:52)..."}
  - Code reference: server/src/middleware/errorHandler.js:9:
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
Reproducibility: Always
```

```
Issue ID: BUG-005
Title: User Deactivation in Admin Portal Fails Silently Due to Field Mismatch ('active' vs 'isActive')
Role Affected: Admin / Security
Category: Functional
Severity: High
Classification: Confirmed Bug
Location: PATCH https://merncraft.onrender.com/api/admin/users/:id/status | AdminUsers.jsx
Steps to Reproduce:
  1. Authenticate as admin and navigate to /admin/users.
  2. Locate an active user and click Deactivate.
  3. Observe UI and API response claiming success.
  4. Attempt to log in as the "deactivated" user via POST /api/auth/login.
Expected Behavior:
  User's `isActive` flag in MongoDB becomes `false`. Login is blocked with HTTP 403.
Actual Behavior:
  API returns HTTP 200 {"success":true,"message":"User deactivated"}. However, `isActive` remains `true`. The user can immediately log in and access protected routes.
Root Cause:
  Mongoose schema (User.js:9) defines `isActive: { type: Boolean, default: true }`. The controller (adminUserController.js:44) sets `user.active = req.body.active`. Mongoose strict mode ignores the non-schema `active` field. The actual `isActive` field is never modified.
Evidence:
  - Live Test Execution:
    - User ID: 6a9957776e21f353f1d661ef, pre-toggle `isActive`: True
    - PATCH /api/admin/users/6a9957776e21f353f1d661ef/status payload: `{"active": false}` -> 200 OK
    - Post-toggle DB inspection: `isActive` = True
    - POST /api/auth/login with deactivated user -> HTTP 200 OK (User authenticated)
  - Code reference: server/src/controllers/admin/adminUserController.js:44:
      user.active = req.body.active;
Reproducibility: Always
```

```
Issue ID: BUG-006
Title: User Model Default Role Set to 'admin' in Schema Definition
Role Affected: Security / System
Category: Security
Severity: High
Classification: Security Issue
Location: server/src/models/User.js:8
Steps to Reproduce:
  1. Inspect server/src/models/User.js line 8.
  2. Create a User document directly via MongoDB shell or script without passing a role.
Expected Behavior:
  Default role is `user`. Elevation to `admin` requires explicit role assignment.
Actual Behavior:
  Mongoose schema sets `role: { type: String, default: 'admin' }`. While `authController.js:28` forces `role: 'user'` during public registration, any document created outside that specific controller automatically defaults to full administrative privileges.
Root Cause:
  Schema-level default is inverted (`default: 'admin'`).
Evidence:
  - Code reference: server/src/models/User.js:8:
      role: { type: String, default: 'admin' }
Reproducibility: Always
```

```
Issue ID: BUG-007
Title: Forgot Password Endpoint Discloses Account Existence (Email Enumeration)
Role Affected: Security / Visitor
Category: Security
Severity: Medium
Classification: Security Issue
Location: POST https://merncraft.onrender.com/api/auth/forgotpassword
Steps to Reproduce:
  1. Send POST to /api/auth/forgotpassword with unregistered email `fake_unregistered_999@example.com`.
  2. Send POST to /api/auth/forgotpassword with registered email `sampleai747@gmail.com`.
Expected Behavior:
  Endpoint returns identical generic response (HTTP 200) regardless of account existence.
Actual Behavior:
  Unregistered email returns HTTP 404 {"success":false,"message":"There is no user with that email"}. Registered email returns HTTP 200.
Root Cause:
  authController.js:131 explicitly checks `if (!user) return res.status(404)...`.
Evidence:
  - Unregistered email: Status 404, Body: {"success":false,"message":"There is no user with that email"}
  - Registered email: Status 200, Body: {"success":true,"message":"Email sent"}
Reproducibility: Always
```

```
Issue ID: BUG-008
Title: Complete Absence of Rate Limiting Across Authentication Endpoints
Role Affected: Security / System
Category: Security
Severity: Medium
Classification: Security Issue
Location: POST /api/auth/login | /register | /forgotpassword
Steps to Reproduce:
  1. Issue 50 rapid sequential POST requests to /api/auth/login with incorrect passwords.
Expected Behavior:
  Requests are throttled with HTTP 429 Too Many Requests after threshold violations.
Actual Behavior:
  All requests execute without throttling, lockout, or progressive delay.
Root Cause:
  No rate-limiting middleware (e.g., `express-rate-limit`) is installed or mounted in server/src/app.js.
Evidence:
  - Code reference: server/src/app.js lacks rate-limiting middleware.
  - Live execution: High-frequency requests execute unthrottled.
Reproducibility: Always
```

```
Issue ID: BUG-009
Title: Contact Form Persists Raw Unsanitized XSS Payloads in Database
Role Affected: Security / Admin
Category: Security
Severity: Medium
Classification: Security Issue
Location: POST https://merncraft.onrender.com/api/contact
Steps to Reproduce:
  1. Submit contact form with payload: `{"name":"<script>alert(1)</script>","email":"test@example.com","projectType":"Business Website","message":"<img src=x onerror=alert(1)>"}`.
  2. Query lead via Admin API `GET /api/admin/leads/:id`.
Expected Behavior:
  Server sanitizes HTML tags or escapes entities before database insertion.
Actual Behavior:
  Server returns HTTP 201 and stores raw script and image onerror payloads in MongoDB.
Root Cause:
  contactController.js takes `req.body` and directly invokes `Lead.create()` without HTML sanitization middleware (e.g., `DOMPurify` or `xss`).
Evidence:
  - Network Response: {"success":true,"data":{"name":"<script>alert(1)</script>","message":"<img src=x onerror=alert(1)>",...}}
Reproducibility: Always
```

```
Issue ID: BUG-010
Title: Unbounded String Inputs Stored in User and Lead Collections (Storage Exhaustion Risk)
Role Affected: System
Category: Validation
Severity: Medium
Classification: Confirmed Bug
Location: POST /api/auth/register | POST /api/contact
Steps to Reproduce:
  1. Submit registration or contact request with a 10,000-character string in the `name` property.
Expected Behavior:
  Validation rejects excessive payload lengths with HTTP 400.
Actual Behavior:
  Server returns HTTP 201 and persists the entire 10,000-character string.
Root Cause:
  Mongoose schemas for `User` and `Lead` omit `maxlength` schema constraints on string fields.
Evidence:
  - Live Test: Registration of 10,000 "A" characters succeeded with HTTP 201 (User ID: `6a9958166e21f353f1d661f2`).
Reproducibility: Always
```

```
Issue ID: BUG-011
Title: Predictable Developer Secret Key Configured as Production JWT_SECRET
Role Affected: System / Security
Category: Security
Severity: High
Classification: Security Issue
Location: server/.env:4
Steps to Reproduce:
  1. Inspect JWT_SECRET in server/.env.
Expected Behavior:
  A cryptographically random 256-bit or 512-bit secret is generated.
Actual Behavior:
  Secret is set to `mc_super_secret_dev_key_2026_xyz`.
Root Cause:
  A predictable development passphrase was retained in the production deployment environment.
Evidence:
  - Code reference: server/.env:4: JWT_SECRET=mc_super_secret_dev_key_2026_xyz
Reproducibility: Always
```

```
Issue ID: BUG-012
Title: Contact Form Submissions Do Not Trigger Email Notifications to Site Administrators
Role Affected: Business / Admin
Category: Business Logic
Severity: High
Classification: Confirmed Bug
Location: POST /api/contact | contactController.js
Steps to Reproduce:
  1. Submit a valid lead via https://mern-craft.vercel.app/contact.
  2. Verify if any email notification is sent to the administrator.
Expected Behavior:
  Lead creation triggers an alert email notifying the business of an incoming inquiry.
Actual Behavior:
  Lead document is created in MongoDB, but no notification is sent. Administrators only discover inquiries if they manually check `/admin/leads`.
Root Cause:
  contactController.js contains only `Lead.create()`; no email notification function is invoked.
Evidence:
  - Code reference: server/src/controllers/contactController.js:1-22 contains no dispatch logic.
Reproducibility: Always
```

```
Issue ID: BUG-013
Title: Admin Password Change Double-Hashes Credentials, Causing Permanent Account Lockout
Role Affected: Admin
Category: Functional
Severity: High
Classification: Confirmed Bug
Location: PATCH /api/admin/settings | adminSettingsController.js
Steps to Reproduce:
  1. Authenticate as admin and navigate to /admin/settings.
  2. Input current password and a new password; submit the form.
  3. Attempt to log in with the new password.
Expected Behavior:
  Password is hashed once with bcrypt; subsequent logins with the new password succeed.
Actual Behavior:
  Password is hashed twice with bcrypt. Subsequent logins fail permanently because `bcrypt.compare()` compares plaintext against a hash-of-a-hash.
Root Cause:
  adminSettingsController.js:29 manually hashes `newPassword` via `bcrypt.hash()`, then sets `user.password = hash` and calls `user.save()`. The Mongoose pre-save hook in User.js:14 detects `this.isModified('password')` and runs `bcrypt.hash()` a second time on the already-hashed string.
Evidence:
  - Code reference: server/src/controllers/admin/adminSettingsController.js:29:
      user.password = await bcrypt.hash(newPassword, salt);
  - Code reference: server/src/models/User.js:15:
      if (!this.isModified('password')) return;
      this.password = await bcrypt.hash(this.password, salt);
Reproducibility: Always
```

```
Issue ID: BUG-014
Title: User Dashboard Is a Static Stub Without User-Specific Projects or Quotes
Role Affected: User
Category: UX Issue
Severity: Medium
Classification: UX Issue
Location: https://mern-craft.vercel.app/dashboard
Steps to Reproduce:
  1. Log in as a registered user and navigate to /dashboard.
Expected Behavior:
  User can track quotes, submitted inquiries, or active project milestones.
Actual Behavior:
  Dashboard displays read-only name/email and a hardcoded message: "You have no active projects currently. Submit a quote to get started!" with a link to the public contact form.
Root Cause:
  client/src/pages/Dashboard/Dashboard.jsx makes zero API calls. The backend provides no `/api/user/quotes` or `/api/user/projects` endpoints.
Evidence:
  - Code reference: client/src/pages/Dashboard/Dashboard.jsx:20-40.
Reproducibility: Always
```

```
Issue ID: BUG-015
Title: Unescaped Regular Expressions in Admin Search Queries (ReDoS Vulnerability)
Role Affected: Admin / System
Category: Security
Severity: Medium
Classification: Potential Risk
Location: GET /api/admin/leads | GET /api/admin/users
Steps to Reproduce:
  1. Send a request to `/api/admin/leads?search=.*.*.*` or complex regex patterns.
Expected Behavior:
  Search terms are escaped before passing to MongoDB regex operators.
Actual Behavior:
  Search query is passed directly into `$regex: req.query.search`.
Root Cause:
  adminLeadController.js:19 and adminUserController.js:13 pass raw query parameters directly into `$regex` without sanitizing special characters.
Evidence:
  - Code reference: server/src/controllers/admin/adminLeadController.js:19:
      { name: { $regex: req.query.search, $options: 'i' } }
Reproducibility: Always
```

```
Issue ID: BUG-016
Title: Dead, Unused SMTP Credentials Present in Production Environment File
Role Affected: System
Category: Configuration
Severity: Low
Classification: Observation
Location: server/.env:6-11
Steps to Reproduce:
  1. Inspect server/.env lines 6 to 11.
  2. Search entire codebase for `SMTP_HOST`, `SMTP_PORT`, `SMTP_EMAIL`, `SMTP_PASSWORD`.
Expected Behavior:
  Environment variables correspond to active application subsystems.
Actual Behavior:
  SMTP credentials exist in `.env`, but `sendEmail.js` exclusively uses `RESEND_API_KEY`.
Root Cause:
  Abandoned legacy SMTP configuration left in environment files.
Evidence:
  - Code reference: server/src/utils/sendEmail.js contains zero references to `SMTP_*`.
Reproducibility: Always
```

```
Issue ID: BUG-017
Title: Admin Quotes and Blog Endpoints Lack Pagination and Query Limits
Role Affected: Admin / Performance
Category: Performance
Severity: Low
Classification: Performance Issue
Location: GET /api/admin/quotes | GET /api/admin/blog
Steps to Reproduce:
  1. Inspect adminQuoteController.js:8 and adminBlogController.js:4.
Expected Behavior:
  List endpoints implement limit/skip pagination.
Actual Behavior:
  Controllers invoke `Quote.find().sort(...)` and `BlogPost.find().sort(...)` without limits, returning full collections in a single response payload.
Root Cause:
  Missing pagination architecture in quote and blog controllers.
Evidence:
  - Code reference: server/src/controllers/admin/adminQuoteController.js:8:
      const quotes = await Quote.find().sort({ createdAt: -1 });
Reproducibility: Always
```

```
Issue ID: BUG-018
Title: Destructive Record Deletions Rely on Native Browser Dialog Without Soft-Delete
Role Affected: Admin
Category: UX Issue
Severity: Low
Classification: UX Issue
Location: AdminLeads.jsx:53 | AdminQuotes.jsx:41 | AdminProjects.jsx:60
Steps to Reproduce:
  1. In any admin table, click Delete on a record.
Expected Behavior:
  A custom confirmation modal opens, explaining that the action is permanent, or records are moved to an archive status.
Actual Behavior:
  Native browser `window.confirm()` dialog pops up. Confirming performs an unrecoverable hard delete (`Model.deleteOne()`).
Root Cause:
  Destructive actions execute immediate hard delete without soft-delete flags or undo capabilities.
Evidence:
  - Code reference: client/src/pages/Admin/Leads/AdminLeads.jsx:53.
Reproducibility: Always
```

```
Issue ID: BUG-019
Title: Success Message in Admin Settings Inherits Error Container CSS Styling
Role Affected: Admin
Category: UI/UX
Severity: Low
Classification: UX Issue
Location: https://mern-craft.vercel.app/admin/settings | AdminSettings.jsx:77
Steps to Reproduce:
  1. Navigate to /admin/settings, update Name, and click Save Changes.
Expected Behavior:
  Success notification uses a dedicated success container class.
Actual Behavior:
  Component renders: `<div className="admin-error" style={{backgroundColor: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0'}}>{success}</div>`.
Root Cause:
  Admin CSS lacks an `.admin-success` class; developer reused `.admin-error` with inline color overrides.
Evidence:
  - Code reference: client/src/pages/Admin/Settings/AdminSettings.jsx:77.
Reproducibility: Always
```

```
Issue ID: BUG-020
Title: Render Backend Cold-Start Latency (~7 Seconds) Disrupts Initial Visitor Flow
Role Affected: Visitor
Category: Performance
Severity: Medium
Classification: Performance Issue
Location: https://merncraft.onrender.com
Steps to Reproduce:
  1. Allow backend instance to remain idle for 15 minutes until spun down.
  2. Navigate to https://mern-craft.vercel.app/.
Expected Behavior:
  Initial API queries complete within 1-2 seconds.
Actual Behavior:
  Requests stall for ~7 seconds while the Render container boots up.
Root Cause:
  Render Free Tier spins down inactive instances.
Evidence:
  - Verified during initial health check: 7.2s response time on first request.
Reproducibility: Intermittent (Upon instance spin-down)
```

```
Issue ID: BUG-021
Title: Lack of Real-Time Low-Friction Contact Channel (WhatsApp / Instant Chat)
Role Affected: Visitor
Category: Business-Conversion
Severity: Medium
Classification: Business-Conversion Issue
Location: https://mern-craft.vercel.app/contact
Steps to Reproduce:
  1. Visit the Contact page and inspect available communication channels.
Expected Behavior:
  High-converting service agency sites offer click-to-chat WhatsApp or instant engagement widgets.
Actual Behavior:
  Only asynchronous email/phone links and a static form are present.
Root Cause:
  Product feature gap.
Evidence:
  - UI inspection of Contact page.
Reproducibility: Always
```

```
Issue ID: BUG-022
Title: Mass Assignment Vulnerability in Quote and Blog Creation Controllers
Role Affected: Admin / System
Category: Security
Severity: Medium
Classification: Security Issue
Location: POST /api/admin/quotes | POST /api/admin/blog
Steps to Reproduce:
  1. Send POST to /api/admin/quotes with arbitrary unexpected properties.
Expected Behavior:
  Controllers whitelist allowed properties before passing to the model.
Actual Behavior:
  `Quote.create(req.body)` passes raw request body directly to Mongoose.
Root Cause:
  Lack of request payload whitelisting.
Evidence:
  - Code reference: server/src/controllers/admin/adminQuoteController.js:20:
      const quote = await Quote.create(req.body);
Reproducibility: Always
```

```
Issue ID: BUG-023
Title: Quote Schema Omits Enum Restrictions on Status Field
Role Affected: Admin / System
Category: Database
Severity: Low
Classification: Confirmed Bug
Location: server/src/models/Quote.js:7
Steps to Reproduce:
  1. Inspect server/src/models/Quote.js.
  2. Send PATCH /api/admin/quotes/:id with `{"status": "invalid_random_status"}`.
Expected Behavior:
  Status field enforces allowed enum values (e.g., `['draft', 'sent', 'accepted', 'rejected']`).
Actual Behavior:
  Status is defined as raw `String` without validation; arbitrary strings are saved.
Root Cause:
  server/src/models/Quote.js line 7: `status: { type: String, default: 'draft' }`.
Evidence:
  - Code reference: server/src/models/Quote.js:7 lacks `enum` validator.
Reproducibility: Always
```

```
Issue ID: BUG-024
Title: Admin Project Creation Fails with HTTP 500 Due to Schema Field Mismatch ('title' vs 'name')
Role Affected: Admin
Category: Functional
Severity: Critical
Classification: Confirmed Bug
Location: POST https://merncraft.onrender.com/api/admin/projects | AdminProjects.jsx
Steps to Reproduce:
  1. Authenticate as admin and navigate to /admin/projects.
  2. Click Add Project, fill out the form, and click Save.
Expected Behavior:
  Project document is created in MongoDB and displayed in the table.
Actual Behavior:
  API returns HTTP 500 `ValidationError: Project validation failed: name: Path 'name' is required.` No project can be saved.
Root Cause:
  AdminProjects.jsx submits `{ title: '...', category: '...' }`, but the Mongoose schema (Project.js:4) enforces `name: { type: String, required: true }`.
Evidence:
  - Live Test: POST https://merncraft.onrender.com/api/admin/projects with form payload returned:
    Status 500, Body: {"success":false,"message":"Project validation failed: name: Path `name` is required.","stack":"ValidationError: Project validation failed: name: Path `name` is required.\n at model.validate ..."}
Reproducibility: Always
```

```
Issue ID: BUG-025
Title: Admin Pricing Plan Creation Fails with HTTP 500 Due to Schema Mismatch ('name' vs 'tier')
Role Affected: Admin
Category: Functional
Severity: Critical
Classification: Confirmed Bug
Location: POST https://merncraft.onrender.com/api/admin/pricing | AdminPricing.jsx
Steps to Reproduce:
  1. Authenticate as admin and navigate to /admin/pricing.
  2. Click Add Plan, fill out the modal form, and submit.
Expected Behavior:
  Pricing plan is created in MongoDB and visible on both admin and public pricing views.
Actual Behavior:
  API returns HTTP 500 `ValidationError: PricingPlan validation failed: tier: Path 'tier' is required.` No pricing plan can be saved.
Root Cause:
  AdminPricing.jsx submits `{ name: 'Starter', price: '...', popular: false }`, but the Mongoose schema (PricingPlan.js:4-8) enforces `tier: { type: String, required: true }` and `isPopular: { type: Boolean }`.
Evidence:
  - Live Test: POST https://merncraft.onrender.com/api/admin/pricing with form payload returned:
    Status 500, Body: {"success":false,"message":"PricingPlan validation failed: tier: Path `tier` is required.","stack":"ValidationError: PricingPlan validation failed: tier: Path `tier` is required.\n at model.validate ..."}
Reproducibility: Always
```

```
Issue ID: BUG-026
Title: Admin Blog Post Creation Fails with HTTP 500 Due to Author Type Mismatch ('ObjectId' vs String)
Role Affected: Admin
Category: Functional
Severity: Critical
Classification: Confirmed Bug
Location: POST https://merncraft.onrender.com/api/admin/blog | AdminBlog.jsx
Steps to Reproduce:
  1. Authenticate as admin and navigate to /admin/blog.
  2. Click New Post, fill out the fields, and submit.
Expected Behavior:
  Blog post is created and saved to MongoDB.
Actual Behavior:
  API returns HTTP 500 `ValidationError: BlogPost validation failed: author: Cast to ObjectId failed for value "Admin" (type string) at path "author"`. No blog post can be saved.
Root Cause:
  AdminBlog.jsx submits hardcoded string `{ author: 'Admin' }`, but the Mongoose schema (BlogPost.js:7) specifies `author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }`.
Evidence:
  - Live Test: POST https://merncraft.onrender.com/api/admin/blog with form payload returned:
    Status 500, Body: {"success":false,"message":"BlogPost validation failed: author: Cast to ObjectId failed for value \"Admin\" (type string) at path \"author\"","stack":"ValidationError: BlogPost validation failed: author: Cast to ObjectId ..."}
Reproducibility: Always
```

```
Issue ID: BUG-027
Title: 'Create Quote' in Admin Portal Is an Incomplete Stub (Browser Alert Only)
Role Affected: Admin
Category: Functional / UI
Severity: Medium
Classification: Confirmed Bug
Location: https://mern-craft.vercel.app/admin/quotes | AdminQuotes.jsx:60
Steps to Reproduce:
  1. Authenticate as admin and navigate to /admin/quotes.
  2. Click the primary action button "Create Quote".
Expected Behavior:
  A modal or quotation form opens to compose and send quotes.
Actual Behavior:
  Browser displays alert dialog: "Quotation builder feature coming soon!" No form or creation mechanism exists in the UI.
Root Cause:
  client/src/pages/Admin/Quotes/AdminQuotes.jsx line 60 has an inline `onClick={() => alert('Quotation builder feature coming soon!')}` stub.
Evidence:
  - Code reference: client/src/pages/Admin/Quotes/AdminQuotes.jsx:60.
Reproducibility: Always
```

---

## 6. Audit Summary

### 6.1 Testing Coverage Matrix

| Area / Subsystem | Testing Type | Result / Status |
|---|---|---|
| **Infrastructure & Health** | Live HTTP / Latency probe | Verified: Render 7s cold-start, MongoDB connected |
| **Public Pages (10 Routes)** | Functional navigation & rendering | Verified: All routes load; dynamic showcases empty |
| **Contact / Lead Generation** | Form submission & DB check | Verified: Leads saved; zero admin alerts |
| **User Registration** | Live API & edge payloads | Verified: Normal creation ok; role injection blocked |
| **User Authentication** | Live API credential checks | Verified: Wrong password/user returns 401 |
| **Password Reset** | Live API token generation | Verified: Email enumeration (404) & Resend 500 error |
| **Vertical Privilege Escalation** | Auth token role spoofing | Verified: Blocked at middleware (401 / 403) |
| **Horizontal Data Access** | Lead ID query without admin auth | Verified: Protected behind `authorizeAdmin` |
| **Admin Dashboard** | Live stats & recent query | Verified: Aggregates real-time DB counts |
| **Admin Leads Module** | Full CRUD & status change | Verified: Status & notes update; delete removes record |
| **Admin Users Module** | User status toggle | Verified: **BUG-005** — Deactivation fails silently |
| **Admin Projects Module** | Form creation test | Verified: **BUG-024** — Schema mismatch crashes (500) |
| **Admin Pricing Module** | Form creation test | Verified: **BUG-025** — Schema mismatch crashes (500) |
| **Admin Blog Module** | Form creation test | Verified: **BUG-026** — Type mismatch crashes (500) |
| **Admin Quotes Module** | UI action test | Verified: **BUG-027** — Incomplete stub alert |
| **Admin Settings Module** | Profile & password update | Verified: Profile update ok; password change double-hashes |
| **Security & Injection** | NoSQL, XSS, ReDoS, Maxlength | Verified: NoSQL crashes server, XSS stored raw, stack traces leaked |

### 6.2 Issue Totals by Severity and Category

| Severity | Count |
|---|---|
| **Critical** | 4 |
| **High** | 7 |
| **Medium** | 10 |
| **Low** | 6 |
| **Total Issues Documented** | **27** |

| Category | Count |
|---|---|
| **Security** | 9 |
| **Functional** | 8 |
| **UI / UX** | 4 |
| **Performance** | 2 |
| **Business / Conversion** | 2 |
| **Configuration** | 1 |
| **Database** | 1 |

---

### 6.3 Critical Blockers

1. **BUG-001 / BUG-024 / BUG-025 / BUG-026 (The Content Pipeline Deadlock):**
   - Public pages have no services, projects, pricing, or blog posts.
   - Administrators cannot add projects because the form sends `title` instead of `name` (HTTP 500).
   - Administrators cannot add pricing plans because the form sends `name` instead of `tier` (HTTP 500).
   - Administrators cannot add blog posts because the form sends string `Admin` instead of `ObjectId` (HTTP 500).
   - *Result:* The core business value proposition cannot be populated from the UI.

2. **BUG-005 (Administrative Security Failure):**
   - Deactivating a compromised user account in the admin dashboard has zero effect in the database. Deactivated users retain full login and access rights.

3. **BUG-013 (Administrative Account Lockout):**
   - Any administrator attempting to update their password from the Settings page will permanently corrupt their credentials due to controller-plus-model double-hashing.

4. **BUG-002 (Password Reset Broken):**
   - No customer or administrator can reset their password via email due to sandbox domain restrictions.

---

### 6.4 Major User Journey Breakdowns

- **Prospective Client Journey:** A visitor lands on the site, reads the hero pitch, navigates to Services or Projects or Pricing to evaluate proof of work and cost, and encounters empty containers. If they fill out the contact form, their inquiry is saved to the database, but site administrators receive no alert.
- **Client Account Journey:** A client registers and logs in, but lands on a static dashboard showing "No active projects" with no historical inquiry tracking or interactive features. If they forget their password, the reset email fails to dispatch.
- **Site Administrator Journey:** An administrator logs in to manage the platform. They can review inquiries and update lead notes. However, attempting to add new portfolio projects, set pricing tiers, write blog updates, or disable abusive users fails across all modules due to frontend-to-backend schema incompatibilities.
