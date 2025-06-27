# Sales Analytics Dashboard

A comprehensive and visually appealing dashboard for monitoring web store sales. Built with React, TypeScript, and Tailwind CSS, this dashboard provides real-time insights into sales performance, top-selling products, and inventory status.

## Live Demo

You can view a live demo of the project here: **[Live Demo](https://scale-cds-public-us-west-2.s3.amazonaws.com/63fe4e654667d0a6f128105c/U8uV3sLYjTDoICS)**
---

## Features

-   **📊 Dynamic Sales Charts**: Interactive gradient line graph displaying daily sales for the last 7, 30, and 90 days.
-   **📈 Key Performance Indicators (KPIs)**: Clear, at-a-glance cards for:
    -   Total Revenue
    -   Total Units Sold
    -   Average Order Value (AOV)
-   **🔄 Data Refresh**: A refresh button in the header to instantly fetch the latest mock data.
-   **⭐ Top Selling Products**: A ranked list of the top 5 selling items, complete with product thumbnails, names, categories, and sales figures.
-   **🔴 Live Sales Ticker**: A real-time feed showcasing recent orders with product names and prices to create a sense of activity.
-   **⚠️ Low-Stock Alerts**: A dedicated section to highlight items with inventory levels below their threshold, prompting for reordering.
-   ** toggleswitch  Customizable Views**: Seamlessly toggle the main chart and top products view between **Revenue** and **Units Sold**.
-   **🔍 Product Search**: A search bar to filter product and category data across the dashboard.
-   **🌙 Dark Mode**: A sleek, modern dark mode for comfortable viewing in low-light environments.
-   **✨ Engaging UI/UX**: Built with smooth animations from Framer Motion, responsive design for all screen sizes, and a clean, intuitive layout.

---

## Technologies Used

This project is built with a modern frontend stack:

-   **[React]
-   **[TypeScript]
-   **[Tailwind CSS]
-   **[Recharts]
-   **[Framer Motion]
-   **[React Icons]

---


### Prerequisites

Make sure you have Node.js and npm (or yarn) installed on your machine.

-   Node.js (v14 or newer)
  

## Code Overview

The primary logic is contained within the `SalesDashboard.tsx` component.

-   **State Management**: Utilizes React Hooks (`useState`, `useEffect`, `useMemo`) to manage component state, including view modes, time ranges, and dynamically generated mock data.
-   **Data Visualization**: Leverages `Recharts` for creating the area and pie charts, with custom tooltips for an enhanced user experience.
-   **Animations & UX**: `Framer Motion` is used extensively for page load animations, card transitions, and interactive feedback, creating a polished and responsive feel.
-   **Styling**: `Tailwind CSS` is used for all styling, enabling a consistent and maintainable design system directly within the markup.

---
