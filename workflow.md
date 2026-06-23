Agar aap **Supabase ki jagah Neon.tech (PostgreSQL)** use kar rahe hain aur **Cloudflare use nahi kar rahe**, to architecture aur workflow kuch is tarah hona chahiye:

# Final Tech Stack

| Service          | Purpose                |
| ---------------- | ---------------------- |
| Next.js 15       | Frontend + Backend API |
| Vercel           | Hosting                |
| Neon.tech        | PostgreSQL Database    |
| Appwrite         | File Storage           |
| Resend           | Emails                 |
| Cryptomus        | Payments               |
| GitHub           | Source Control         |
| AdSense          | Ads                    |
| NextAuth/Auth.js | Authentication         |

---

# Complete User Workflow

## Visitor

```text
Visit Website
    ↓
Search Product
    ↓
View Product
    ↓
Register/Login
    ↓
Buy Product
```

---

## Buyer Workflow

```text
Register
    ↓
Verify Email
    ↓
Login
    ↓
Buy Product
    ↓
Payment Success
    ↓
License Generated
    ↓
Download Enabled
    ↓
Product Appears In Dashboard
```

Buyer Dashboard:

```text
Dashboard

Overview
My Orders
Downloads
Licenses
Wishlist
Reviews
Profile
Change Password
Security
```

### Password Change

User khud kar sakta hai:

```text
Profile
    ↓
Security
    ↓
Current Password
New Password
Confirm Password
    ↓
Save
```

Admin bhi force password reset kar sakta hai.

---

# Contributor (Royalty Seller) Workflow

## Source Code Submission

```text
Contributor Login
    ↓
Submit Product Request
    ↓
Upload Source Code
    ↓
Pending Review
```

Source code public website par upload nahi hoga.

Direct Admin Panel me jayega.

---

## Admin Review

```text
Pending Source Code
        ↓
Review
        ↓
Approve / Reject
```

---

## License Injection

```text
Source Code
      ↓
License Module Injection
      ↓
Compile
      ↓
Create Product
      ↓
Publish
```

---

## Product Sale

```text
Customer Purchase
      ↓
Cryptomus Success
      ↓
License Generate
      ↓
Download Access
      ↓
Royalty Ledger Update
```

---

# Royalty Calculation

Example:

```text
Product Price = $100

Website Fee = 30%

Contributor = 70%
```

Result:

```text
Admin Revenue = $30

Contributor Revenue = $70
```

---

# Admin Overview System

Ye sabse important part hai.

Aapka admin dashboard sirf counters nahi dikhayega.

Har item clickable hoga.

---

## Dashboard Overview

```text
Total Users
Total Buyers
Total Contributors
Total Products
Pending Reviews
Sales Today
Sales This Month
Revenue
Royalties
Withdraw Requests
```

---

## Click Total Users

```text
Users List
```

Admin dekh sakega:

| Field             |
| ----------------- |
| User ID           |
| Full Name         |
| Username          |
| Email             |
| Role              |
| Country           |
| Registration Date |
| Last Login        |
| Status            |

---

## User Details Page

Admin kisi bhi user par click kare:

```text
User Profile
```

Admin dekh sakta hai:

| Information       |
| ----------------- |
| Name              |
| Email             |
| Username          |
| Join Date         |
| Last Login        |
| Account Status    |
| Total Purchases   |
| Total Sales       |
| Royalty Earned    |
| Orders            |
| Licenses          |
| Uploaded Products |

---

# Admin Controls

Admin kar sakta hai:

### User

```text
View
Edit
Suspend
Activate
Reset Password
Delete
Change Role
```

---

### Contributor

```text
View Source Code Requests
Approve
Reject
View Earnings
View Royalties
```

---

### Products

```text
Hide Product
Show Product
Edit Product
Delete Product
Feature Product
```

---

# Admin User Detail Example

```text
John Smith

Email:
john@gmail.com

Role:
Contributor

Products:
25

Approved:
18

Pending:
3

Rejected:
4

Total Sales:
$5,120

Royalty Earned:
$3,584

Withdrawn:
$2,000

Pending:
$1,584
```

Admin sab kuch dekh sakta hai.

---

# Database Structure (Neon)

### Users

```sql
users
```

```text
id
name
username
email
password_hash
role
status
created_at
last_login
```

---

### Products

```sql
products
```

```text
id
title
slug
category
price
status
visibility
contributor_id
created_at
```

---

### Source Codes

```sql
source_codes
```

```text
id
contributor_id
file_path
status
admin_notes
created_at
```

---

### Orders

```sql
orders
```

```text
id
user_id
product_id
amount
payment_status
created_at
```

---

### Royalties

```sql
royalties
```

```text
id
order_id
contributor_id
sale_amount
platform_fee
royalty_amount
status
```

---

### Licenses

```sql
licenses
```

```text
id
order_id
license_key
hardware_limit
activation_count
expiry_date
```

---

# Storage Structure (Appwrite)

```text
appwrite-storage

product-files/
source-codes/
licenses/
product-images/
screenshots/
avatars/
banners/
blog-images/
```

Source code bucket ko private rakho.

Sirf admin access.

---

# Recommended Admin Permissions

## Super Admin

100% access

```text
Everything
```

---

## Moderator

```text
Products
Reviews
Support
```

---

## Finance Admin

```text
Orders
Revenue
Royalties
Withdrawals
```

---

# Security Recommendation

Cloudflare nahi use kar rahe to:

* Rate Limiting
* reCAPTCHA
* Next.js Middleware Protection
* JWT Session Validation
* Argon2 Password Hashing
* Email Verification Mandatory
* Appwrite Private Buckets
* SQL Injection Protection (Prisma/Drizzle ORM)

zaroor implement karein.

## Final Workflow

```text
Visitor
   ↓
Register
   ↓
Login
   ↓
Buy Product
   ↓
Payment Success
   ↓
License Generated
   ↓
Download

Contributor
   ↓
Submit Source Code
   ↓
Admin Review
   ↓
License Injection
   ↓
Publish Product
   ↓
Sale
   ↓
70% Royalty

Admin
   ↓
Complete Control
   ↓
Users
Products
Royalties
Orders
SEO
Ads
Categories
Website Builder
Licenses
Emails
Analytics
```

Is architecture me admin ke paas practically website ka har data point visible aur controllable rahega, jabki buyer aur contributor dono apna profile aur password independently manage kar sakenge.
