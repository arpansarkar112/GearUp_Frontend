# GearUp Frontend 🏋️

**"Rent Sports & Outdoor Gear Instantly"**

GearUp is a modern, responsive Next.js application for a sports and outdoor equipment rental service. Customers can browse available gear, select rental dates, and complete secure payments. Providers manage their gear inventory and fulfill rental orders through an intuitive dashboard. Admins oversee the entire platform through a comprehensive moderation interface.

## 🚀 Live Demo & Documentation

- **Live URL:** [https://gear-up-frontend-liart.vercel.app/](https://gear-up-frontend-liart.vercel.app/)
- **API Integration Map:** [API_INTEGRATION.md](https://github.com/arpansarkar112/GearUp_Frontend/blob/master/API_INTEGRATION.md)

---

## 👥 Roles & Permissions

| Role | Description | Frontend UI Expectations |
|------|-------------|-----------------|
| **Customer** | Users who rent sports gear | Public browsing, interactive date-pickers for rentals, checkout/payment flow, order tracking dashboard, review submission. |
| **Provider** | Gear vendors/rental shops | Protected provider dashboard, gear CRUD forms (with image upload UI), order management tables with status-update actions. |
| **Admin** | Platform moderators | Protected admin dashboard, user management tables (suspend/activate actions), global platform statistics, content moderation UI. |

---

## 🔄 Flow Diagrams & UI Considerations

### 🏋️ Customer Journey
```text
[Register/Login] → [Browse Gear] → [View Details] 
       ↓
[Select Dates & "Rent Now"] → [Checkout UI]
       ↓
[Stripe/SSLCommerz Redirect] → [Payment Success Page]
       ↓
[Track Order Status] → [Mark as Returned] → [Leave Review Form]
```

### 🏪 Provider Journey
```text
[Register/Login] → [Dashboard Overview] → [Add Gear Form]
       ↓
[View Incoming Orders Table] → [Click "Confirm" / "Mark Picked Up"]
       ↓
[Toast Notification: "Order Updated"] → [Customer can now pick up]
```

---

*Created by Arpan Sarkar*
