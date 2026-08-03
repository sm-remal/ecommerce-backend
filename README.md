# **Project Documentation & Analysis**

> **Single Vendor E-Commerce Catalog System**
>

**Project Name: Perfect Gifts Station**

**Business Description:** Perfect Gifts Station is a premier destination
for high-quality, customized gifts designed to preserve your precious
memories. We specialize in custom mugs, frames, mini albums, love cards,
and premium polaroid prints, crafted with absolute transparency,
superior quality, and 100% data privacy

**Brand Colors:**

-   Primary Color: #BC2D92

-   Secondary Color: #2F0B3E

-   Accent Color: #FBF596

**Typography (Fonts)**

● English Font: Poppins / Inter (Google Font)

● Bangla Font: Hind Siliguri / Tiro Bangla (Google Font)

❌ Online Payment

❌ Checkout

❌ Cart থেকে payment gateway

✔ Product Catalog

✔ Stock

✔ Order Inquiry

✔ Admin Panel

✔ Customer WhatsApp Order

**Technology Stack**

**Frontend:**

-   Next.js 16 (App Router)

-   TypeScript

-   Tailwind CSS

-   Shadcn UI

-   Framer Motion

-   React Hook Form

-   Zod

-   TanStack Query

-   Axios

**Backend:**

-   Node.js

-   Express.js

-   TypeScript

-   Prisma ORM

-   MySQL

## **Authentication**

-   JWT

-   Access Token

-   Refresh Token

-   bcrypt

**Storage**

-   Cloudinary

-   Product Images

-   Banner Images

-   Category Images

**Deployment**

-   Frontend - VPS or cPanel

-   Backend - VPS or cPanel

-   Database - VPS or cPanel

**Folder Structure**

**Frontend**

app/

components/

features/

hooks/

lib/

types/

services/

middleware.ts

**Backend**

src/

config/

db/

middleware/

modules/

utility/

[app.ts](http://app.ts)

[server.ts](http://server.ts)

## **Public Pages**

Home

All Products

Category

Product Details

Search

About

Contact

Privacy

Terms

404 Page

## **Homepage**

Professional Homepage contains

Hero Slider

Featured Categories

New Arrival

Best Seller

Discount Products

Trending Products

Brands

Why Choose Us

Customer Reviews

FAQ

Contact

Footer

## **Product Category**

**Example:**

-   **Frames** - Premium photo frames to display your special moments on
    > the wall or table.

-   **Mugs** - Magic Mug and Ray Gular\'s customized mug, which will
    > bring new joy to your morning coffee.

-   **Photo Albums** - What is the album in which your memories will be
    > kept?

-   **Cards** - Customized love cards, perfect for gifting to loved
    > ones.

-   **Polaroid Picture** - Cute and beautiful to look at, it can be hung
    > on the wall with towel tape or kept in a purse or album.

-   **Magic Mirror** - An ordinary mirror, but when the light is turned
    > on, you can see your beautiful image inside.

-   **Water Pot** - You can customize your photo on the water bottle.
    > The relationship between your photo and your daily water intake.

-   **Combo Offer** - Various customized product combinations.

### 

### 

### **Product Information & Images**

1.  Customized Mug -- A premium ceramic mug customized with your
    > favorite photo or printed design.

2.  Magic Mug -- A heat-sensitive mug that reveals your hidden photo or
    > design when hot water is poured into it.

3.  Custom Photo Frame -- Beautifully designed photo frames available in
    > various styles to showcase your cherished memories.

4.  Mini Album -- A compact photo album that creatively arranges
    > multiple photos in a stylish and memorable way.

5.  Customized Love Card -- A personalized greeting card featuring your
    > own photos and heartfelt messages, perfect for special occasions.

6.  Magic Mirror -- A stylish mirror that looks ordinary when unlit but
    > displays your beautiful photo when the built-in light is turned
    > on.

7.  Polaroid Picture -- High-quality Polaroid-style photo prints that
    > preserve your special moments with a classic aesthetic.

8.  Waterproof Polaroid Photo -- Durable Polaroid prints made with
    > waterproof material, ensuring they won\'t be damaged by water.

9.  Water Pot -- A customizable water bottle or flask featuring your
    > favorite photo, making it both practical and personal.

**Support:**

-   Image

-   Description

-   Slug

-   Status

-   SEO

**Product Module**

-   Product Id

-   Product Name

-   Slug

-   SKU

-   Description

-   Short Description

-   Category

-   Brand

-   Tags

-   Images

-   Thumbnail

-   Gallery

-   Price

-   Discount Price

-   Stock

-   Status

-   Featured

-   Trending

-   New Arrival

-   Meta Title

-   Meta Description

-   Keywords

-   Created At

-   Updated At

**Inventory System**

-   Available

-   Out of Stock

-   Low Stock

-   Coming Soon

-   Hidden

**Low stock alert**

**Example:** Stock ---\-\-\-\--\> 10 ---\-\-\-\--\> Warning
---\-\-\-\--\> 3

**Automatically show**

-   Only 2 left

-   Low Stock

-   Out of Stock

**Product Details Page**

-   Professional Layout

-   Large Image and + 3 Images (For slide view)

-   Gallery

-   Zoom

-   Price

-   Discount

-   Availability

-   SKU

-   Category

-   Description

-   Specification

-   Related Products

-   Share Button

-   WhatsApp Order

-   Messenger Order

**WhatsApp Order**

1.  Click

    ↓

2.  Automatically open

Hello, I want to order

Product: Rolex Watch

Price: 3500 Tk

Link: website/product/rolex

**Messenger:** Same concept

**Search System**

-   Name

-   Category

-   Brand

-   Tag

-   Price

-   Availability

## **Filter**

-   Category

-   Brand

-   Price - (low - high/ high - low)

-   Newest

-   Oldest

-   A-Z

-   Z-A

-   Discount

-   Stock

**Discount System**

1.  Product wise Discount

2.  Category wise Discount

**Discount Type**

1.  Percentage

2.  Fixed

**Discount Follow Roles:** 1. Start Date 2. End Date 3. Automatic
calculation

**Promo Banner**

-   Admin can create

-   Title

-   Subtitle

-   Button

-   Image

-   Expiry

## **Admin Dashboard**

-   Dashboard Overview

-   Products - CRUD operation

-   Categories - CRUD operation

-   Orders (Inquiry)

-   Coupons - CRUD operation

-   Banners

-   Website Settings - CRUD operation

-   Users - CRUD operation

-   Reports

1.  **Dashboard Cards**

-   Total Products

-   Categories

-   In Stock

-   Out of Stock

-   Today\'s Visitors

-   Monthly Visitors

-   Total Orders

2.  **Charts**

3.  **Monthly Products**

4.  **Category Distribution**

5.  **Stock Status**

**Order System**

-   Since there is no payment system

-   Instead

Customer clicks

↓

Order via WhatsApp / Messenger

↓

Admin receives

↓

Then manually confirms

**Inquiry Form By Email:**

-   Name

-   Phone

-   Address

-   Product

-   Quantity

-   Message

-   Admin receives

Customer also gets WhatsApp

**Settings (CMS)**

-   Logo

-   Favicon

-   Social Links

-   WhatsApp Number

-   Messenger Link

-   Google Map

-   Email

-   Phone

-   Footer

-   SEO

**SEO**

-   Next.js is best.

-   Every page

-   Meta Title

-   Description

-   Open Graph

-   Facebook/Instagram Card

-   JSON-LD

-   Sitemap

-   Robots

-   Canonical URL

-   Dynamic Metadata

-   **Performance**

```{=html}
<!-- -->
```
-   Image Optimization - 5 MB convert to 200/300 KB (jpg/png/jpeg
    > convert **WebP** or **AVIF** )

-   Lazy Loading

-   Server Components

-   ISR

-   Caching

-   CDN

-   Compression

**Security**

-   JWT

-   HTTPS

-   CORS

-   Access Token

-   Refresh Token

-   Helmet

-   Validation

-   Zod

-   Rate Limit

-   XSS Protection

-   SQL Injection Protection

-   Sanitize

**Admin Features**

-   Create Product

-   Update Product

-   Delete Product

-   Category CRUD

-   Upload Images

-   Cloudinary

-   Stock Update

-   Discount Update

-   Banner CRUD

-   Website Setting

**Analytics**

-   Google Analytics

-   Google Search Console

-   Facebook Pixel

-   Microsoft Clarity

**Premium Features**

-   Wishlist

-   Sticky Header

-   Image Zoom

-   Product Share

-   Copy Link

-   Pagination

-   Loading Skeleton

**Database Design**

-   admin

-   categories

-   products

-   product_images

-   brands

-   discounts

-   banners

-   settings

-   order_requests

-   activity_logs

## **Prisma Modules**

-   Auth

-   Admin

-   Product

-   Category

-   Banner

-   Discount

-   OrderRequest

-   Dashboard

-   Settings

-   Media

**API Structure**

/api/v1/auth

/api/v1/products

/api/v1/categories

/api/v1/banners

/api/v1/discounts

/api/v1/orders

/api/v1/settings

/api/v1/dashboard

**UI Style Recommendation**

-   Minimal but premium UI

-   Plenty of whitespace

-   Large product imagery

-   Soft shadows instead of heavy borders

-   Rounded corners (10--14px)

-   Consistent spacing using an 8px grid

-   Smooth micro-animations

-   Fast page transitions

-   Responsive mobile-first layout

-   Accessible color contrast and typography

**Future Scalability**

-   Multiple admin roles (Super Admin, Manager, Staff)

-   Customer accounts

-   Shopping cart & checkout

-   Online payment gateways (SSLCommerz, Stripe)

-   Order tracking

-   Reviews & ratings

-   Multi-language

-   Multi-currency

-   Multi-vendor marketplace

-   Mobile apps (Flutter/React Native)

**Company Information**

## **About Us**

-   Company History: Perfect Gift Station was founded with the vision of
    > creating unique and memorable gifts. We specialize in customized
    > products and are committed to turning your special moments into
    > lasting memories.

-   Mission: To provide high-quality customized products that celebrate
    > life\'s precious moments while ensuring 100% customer satisfaction
    > and reliability.

-   Vision: To become one of the leading customized gift brands, where
    > customers can confidently find personalized gifts for every
    > occasion.

## **Contact Information**

-   Hotline Number: \[017xxxxxxxx\]

-   WhatsApp Number: \[01734584990\]

-   Email Address: \[perfectgiftsstation@gmail.com\]

-   Office/Shop Address: \[Collate Gate, Tongi, Gazipur\]

-   Google Maps Location: \[Near Hasan Massjid\]

-   Business Hours: Every day from 10:00 AM to 8:00 PM.

## **Social Media Links**

-   **Facebook Page:** https://www.facebook.com/perfectgiftsstation

-   **Instagram:** https://www.instagram.com/perfectgiftsstation

-   **TikTok / YouTube:** https://www.tiktok.com/@perfectgiftsstation

## 

## **Return & Refund Policy**

### **Return Policy**

Since all of our products are custom-made using your photos or designs,
we generally do not accept returns. However, if the product arrives
damaged or contains a manufacturing defect caused by us, we will take
full responsibility.

**Refund & Exchange Policy**

If an incorrect or defective product is delivered due to our mistake, we
will replace it free of charge. Customers must report the issue and
provide proof within 10 days of receiving the product.

## **15. Privacy Policy**

### **User Data Usage**

The information you provide while placing an order, including your
photos, name, and contact details, will be kept strictly confidential.
Your uploaded photos will only be used to create your customized product
and will never be shared with any third party. Once the order is
completed, all customer-uploaded personal files and information are
permanently deleted from our system within 3 days.

## **16. Terms & Conditions**

### **Order Policy**

After placing an order, our team will contact you to confirm your design
and order details. Production will begin only after receiving your final
approval.

### **Delivery Timeline**

We typically deliver products within 3 to 7 business days, depending on
the order type and delivery location. Delivery is available across
Bangladesh.

### **Cancellation Policy**

Once the production process has started or your design has been printed,
the order cannot be cancelled.
