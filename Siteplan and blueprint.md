# Store Online - Complete Sitemap, Site Plan & Blueprint

## 1. Public Website Structure

```text
/
│
├── Home
├── Products
│   ├── All Products
│   ├── Free Products
│   ├── Paid Products
│   ├── Featured Products
│   ├── New Releases
│   └── Best Sellers
│
├── Categories
│   ├── MT5
│   │   ├── Expert Advisors
│   │   ├── Indicators
│   │   ├── Utilities
│   │   └── Libraries
│   │
│   ├── MT4
│   │   ├── Expert Advisors
│   │   ├── Indicators
│   │   ├── Utilities
│   │   └── Libraries
│   │
│   ├── Android Game APK
│   ├── Software APK
│   ├── Scripts
│   ├── Templates
│   ├── AI Tools
│   └── Future Categories
│
├── Contributors
│   ├── Top Contributors
│   ├── Royalty Leaders
│   └── Contributor Profile
│
├── Blog
│   ├── Trading
│   ├── MQL5
│   ├── MT4
│   ├── MT5
│   ├── Tutorials
│   └── News
│
├── About Us
├── Contact Us
├── FAQ
├── Privacy Policy
├── Terms & Conditions
├── Refund Policy
└── Royalty Program
```

---

# 2. Authentication Structure

```text
/auth

├── Login
├── Register
├── Email Verification
├── Forgot Password
├── Reset Password
└── Change Password
```

---

# 3. Customer Dashboard

```text
/dashboard

├── Overview
├── Purchased Products
├── Downloads
├── Licenses
├── Order History
├── Reviews
├── Wishlist
├── Profile
├── Security
│   ├── Change Password
│   └── Email Settings
│
└── Support Tickets
```

---

# 4. Contributor Dashboard

```text
/contributor

├── Dashboard
│
├── Products
│   ├── Pending
│   ├── Approved
│   ├── Rejected
│   └── Published
│
├── Sales
├── Royalties
├── Withdrawals
│   ├── Request
│   ├── Pending
│   └── History
│
├── Earnings Reports
├── Contributor Profile
└── Notifications
```

---

# 5. Product Page Structure

```text
/product/[slug]

├── Product Image
├── Gallery
├── Description
├── Features
├── Screenshots
├── Changelog
├── Reviews
├── Ratings
├── License Information
├── Buy Now
└── Related Products
```

---

# 6. Royalty Workflow Blueprint

```text
Contributor
     │
     ▼
Submit Source Code
     │
     ▼
Admin Review
     │
     ▼
License Injection
     │
     ▼
Compile Product
     │
     ▼
Publish Product
     │
     ▼
Customer Purchase
     │
     ▼
Generate License
     │
     ▼
Sale Recorded
     │
     ▼
70% Royalty
     │
     ▼
Contributor Wallet

30% Website Revenue
```

---

# 7. Admin Panel Structure

```text
/admin
```

## Dashboard

```text
Overview

Total Users
Total Sales
Revenue
Royalties
Orders
Products
Contributors
Visitors
```

---

## Product Management

```text
/admin/products

├── Add Product
├── Edit Product
├── Delete Product
├── Hide Product
├── Feature Product
├── Categories
└── Bulk Upload
```

---

## Category Management

```text
/admin/categories

├── Add Category
├── Edit Category
├── Delete Category
├── Reorder Categories
├── Enable
└── Disable
```

---

## Source Code Management

```text
/admin/source-codes

├── Pending Review
├── Approved
├── Rejected
├── License Injection Queue
├── Compile Queue
└── Published Products
```

---

## Royalty Management

```text
/admin/royalties

├── Contributors
├── Earnings
├── Withdrawal Requests
├── Royalty Reports
└── Payout Settings
```

---

## User Management

```text
/admin/users

├── Customers
├── Contributors
├── Admins
├── Suspend User
├── Activate User
└── Permissions
```

---

## Orders Management

```text
/admin/orders

├── All Orders
├── Successful
├── Pending
├── Failed
└── Refund Requests
```

---

## License Manager

```text
/admin/licenses

├── Generate
├── Disable
├── Extend
├── Revoke
├── Activation Logs
└── Hardware IDs
```

---

## Website Builder

```text
/admin/site-builder

├── Homepage
├── Header
├── Footer
├── Hero Banner
├── Sidebar
├── Homepage Widgets
├── Homepage Layout
└── Theme Settings
```

---

## Advertisement Manager

```text
/admin/ads

├── AdSense
├── Banner Ads
├── Sidebar Ads
├── Popup Ads
└── Footer Ads
```

---

## SEO Manager

```text
/admin/seo

├── Homepage SEO
├── Product SEO
├── Category SEO
├── Blog SEO
├── Sitemap
├── Robots.txt
└── Meta Templates
```

---

## Email Manager

```text
/admin/emails

├── Registration Template
├── Purchase Template
├── Royalty Template
├── Newsletter
└── Password Reset
```

---

## Blog Manager

```text
/admin/blog

├── Add Article
├── Edit Article
├── Categories
├── Tags
└── SEO
```

---

## Analytics

```text
/admin/analytics

├── Sales
├── Traffic
├── Conversion
├── Products
├── Contributors
└── Revenue
```

---

# 8. Database Blueprint

### Users

```sql
users
```

| Field      |
| ---------- |
| id         |
| name       |
| email      |
| password   |
| role       |
| status     |
| created_at |

---

### Products

```sql
products
```

| Field          |
| -------------- |
| id             |
| title          |
| slug           |
| category       |
| price          |
| type           |
| contributor_id |
| visibility     |
| created_at     |

---

### Source Codes

```sql
source_codes
```

| Field          |
| -------------- |
| id             |
| contributor_id |
| file_path      |
| status         |
| reviewed_by    |
| created_at     |

---

### Royalties

```sql
royalties
```

| Field          |
| -------------- |
| id             |
| product_id     |
| contributor_id |
| amount         |
| status         |

---

### Orders

```sql
orders
```

| Field          |
| -------------- |
| id             |
| user_id        |
| product_id     |
| amount         |
| payment_status |

---

### Licenses

```sql
licenses
```

| Field       |
| ----------- |
| id          |
| order_id    |
| key         |
| expiry      |
| activations |

---

# 9. Storage Blueprint (Appwrite)

```text
Storage Buckets

product-images/
product-files/
screenshots/
licenses/
source-codes/
blog-images/
avatars/
banners/
```

---

# 10. Vercel Deployment Architecture

```text
User
 │
 ▼
Cloudflare
 │
 ▼
Vercel
 │
 ├── NextJS Frontend
 │
 ├── API Routes
 │
 └── Middleware
 │
 ▼
Supabase
 │
 ├── Database
 ├── Authentication
 └── Realtime
 │
 ▼
Appwrite Storage
 │
 ▼
Files
```

---

# 11. Revenue System

```text
Sale = $100

Customer
    │
    ▼
Cryptomus
    │
    ▼
Store Online

30$
Website Owner

70$
Contributor

Auto Ledger Update
```

---

# 12. Future SaaS Modules

```text
Phase 2

License Generator
EA Protection
Auto Compiler
Affiliate System
Coupon System
Subscription Plans
API Marketplace
AI Product Generator
Multi Vendor Marketplace
```

Ye blueprint production-level architecture hai jisme future scaling, royalty system, licensing system aur admin control pehle din se dhyan me rakha gaya hai. Is structure ko follow karke aap MQL5 Market se bhi zyada flexible marketplace bana sakte hain.
