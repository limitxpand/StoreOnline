# Store Online Project Plan

Aapka **"Store Online"** project ek complete digital marketplace + royalty platform hoga jo MQL5 products, source code licensing aur future me Android APK, Software, Scripts, Templates, etc. sab support karega.

## Project Overview

**Website Name:** Store Online

**Business Model:**

* Product Sale Marketplace
* Royalty Sharing System
* License Protected Products
* Admin Controlled Publishing
* Ads Revenue (Google AdSense)
* SEO Optimized

---

# Technology Stack

| Service          | Purpose                   |
| ---------------- | ------------------------- |
| Next.js 15       | Frontend + SSR            |
| Node.js API      | Backend                   |
| Supabase         | Database + Authentication |
| Appwrite Storage | Product Files Storage     |
| Vercel           | Hosting                   |
| GitHub           | Source Control            |
| Resend           | Emails                    |
| Cryptomus        | Crypto Payments           |
| Google AdSense   | Advertising               |
| Cloudflare       | Security + CDN            |
| Stripe (Future)  | Card Payments             |

---

# User Roles

## 1. Visitor

* Home Page access
* Product Search
* Category Browse
* Product Details
* Reviews Read
* Register/Login

---

## 2. Customer

* Buy Products
* Download Purchased Products
* View Licenses
* Manage Account
* Change Password
* Order History

---

## 3. Contributor (Royalty User)

Source code owner.

Can:

* Submit source code to Admin
* View royalty earnings
* View sales reports
* Withdraw earnings

Cannot:

* Delete uploaded source code
* Edit injected licensed version
* Directly publish products

---

## 4. Super Admin

Full A-Z control.

Can:

* Create categories
* Delete categories
* Add products
* Hide products
* Feature products
* Manage homepage
* Manage users
* Manage royalty
* Manage ads
* Manage SEO
* Manage payments
* Manage licenses

---

# Homepage Layout

```
HEADER
------------------------------------------------

Logo
Search Bar

Filter:
[All]
[Products]
[Categories]

Login
Register

------------------------------------------------

SIDEBAR

MT5
 ├ Expert Advisors
 ├ Indicators
 ├ Utilities
 ├ Libraries

MT4
 ├ Expert Advisors
 ├ Indicators
 ├ Utilities
 ├ Libraries

Android APK
Software APK

Future Categories...

------------------------------------------------

MAIN CONTENT

Equal Product Grid

□ Product
□ Product
□ Product
□ Product

□ Product
□ Product
□ Product
□ Product
```

Sab products equal-size cards me show honge.

---

# Product Card

Product Image

Product Name

Category

Price

Rating

Downloads

Buy Now

View Details

---

# Search System

Search Bar

Filters:

* All
* Products
* Categories

Advanced Filters:

* Free
* Paid
* MT4
* MT5
* APK
* Utilities
* EA
* Indicators

---

# Royalty System

## Workflow

Step 1

Contributor source code submit karega.

Admin dashboard me jayega.

---

Step 2

Admin review karega.

---

Step 3

Admin:

* License Injection Module inject karega
* Compile karega
* Product upload karega

---

Step 4

Product marketplace me publish hoga.

---

Step 5

Sale hone par automatic royalty split.

Example:

Product Price = $100

Website Fee = 30%

Royalty = 70%

Calculation:

```
100$

Admin Fee:
30$

Contributor:
70$
```

Automatic ledger maintain hoga.

---

# License Injection Module

Admin ke paas ek custom licensing engine hoga.

Features:

* Hardware Lock
* Account Lock
* Expiry Date
* License Key
* Download Protection
* Activation Limit

Example:

```
ABC-STORE-XXXX-XXXX
```

Har purchase par unique license.

---

# Contributor Dashboard

My Products

Pending Products

Approved Products

Rejected Products

Sales History

Royalty Earnings

Withdraw Request

License Statistics

---

# Customer Dashboard

Purchased Products

Downloads

Invoices

Licenses

Profile

Change Password

Support Tickets

---

# Admin Dashboard

## Website Management

* Site Name
* Logo
* Theme
* Homepage Sections
* Footer
* Banner

---

## Product Management

* Add Product
* Edit Product
* Hide Product
* Delete Product
* Feature Product

---

## Category Management

Examples:

* MT5
* MT4
* Android APK
* Software
* Scripts
* Templates

Admin unlimited categories create kar sakta hai.

---

## Royalty Management

* Contributor List
* Royalty %
* Earnings
* Withdraw Requests

---

## User Management

* Customers
* Contributors
* Admins

---

## SEO Management

Page-wise SEO.

Fields:

* Meta Title
* Meta Description
* Keywords
* Open Graph
* Sitemap

Automatic SEO generation.

---

## Advertisement Management

Google AdSense placement:

* Header
* Sidebar
* Product Pages
* Blog

Admin enable/disable kar sakega.

---

# Payment System

## Cryptomus Integration

Supported:

* BTC
* ETH
* USDT
* LTC
* TRX

Flow:

```
Customer
    ↓
Cryptomus
    ↓
Payment Success
    ↓
License Generated
    ↓
Download Enabled
```

---

# Email System (Resend)

Automatic emails:

* Registration
* Email Verification
* Purchase Success
* License Delivered
* Password Reset
* Withdrawal Approved

---

# Database Structure

### Users

```sql
users
```

### Products

```sql
products
```

### Categories

```sql
categories
```

### Orders

```sql
orders
```

### Licenses

```sql
licenses
```

### Royalties

```sql
royalties
```

### Withdrawals

```sql
withdrawals
```

### Reviews

```sql
reviews
```

### Blog

```sql
blog_posts
```

---

# Security

* Supabase Auth
* JWT
* Rate Limiting
* DDOS Protection
* Cloudflare WAF
* File Encryption
* Admin Audit Logs
* Malware Scanning

---

# Future Expansion

Store Online future me support karega:

* MT5 Products
* MT4 Products
* Android APK
* Windows Software
* Trading Bots
* Templates
* Source Codes
* AI Tools
* SaaS Products

---

# Recommended Folder Structure

```bash
store-online/

app/
components/
modules/

admin/
dashboard/
products/
royalty/
users/

api/

lib/

database/

storage/

emails/

seo/

public/
```

## Estimated Development Phases

### Phase 1

Marketplace + Auth + Payments

**2–3 Weeks**

### Phase 2

Royalty Engine + Contributor System

**2 Weeks**

### Phase 3

License Injection Management

**2–4 Weeks**

### Phase 4

SEO + Ads + Analytics

**1 Week**

### Phase 5

Testing + Security + Launch

**1–2 Weeks**

Total MVP: **8–12 weeks**

Is architecture ke saath "Store Online" future me MQL5 Market jaisa marketplace ban sakta hai, lekin extra royalty-sharing aur admin-controlled license injection system ke saath.
