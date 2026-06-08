<!-- BEGIN:nextjs-agent-rules -->
# AI Agent Instructions for Prime Property Development

You are an expert Full-Stack Developer AI. Your task is to build the "Prime Property" web application using Next.js (App Router), Tailwind CSS, TypeScript, and Prisma/Drizzle for the database. 

## Development Priority (Strict Order)
1.  **Backend & Security First:** Initialize the database schema based on `PRD.md`. Set up secure API routes with strong RBAC (Admin vs Superadmin). Implement rate limiting, input sanitization, and bcrypt hashing[cite: 2].
2.  **Internal Dashboard (Data Logic):** Build the `/agent/dashboard` route. This must be a STRICTLY text-based tabular data interface[cite: 2]. Implement real-time filtering (debounce 300ms) with state stored in URL query params[cite: 2]. DO NOT add any image upload features or image tags here[cite: 2].
3.  **Public Frontend (Visuals):** Build the public pages (`/`, `/about`, `/contact`). Use the design system defined in `Design.md`. You may use STATIC placeholder images (`<img src="/placeholder.jpg" />`) for the Hero section and the 6 Featured Property cards to achieve a premium look.

## Specific Coding Guidelines
*   **Forms & Validation:** Create CRUD forms for Superadmins. Implement client-side and server-side validation. Use #B33A3A for inline error messages[cite: 2].
*   **Pricing:** All `price` fields must be handled as raw integers in the backend and formatted to Indonesian Rupiah (e.g., Rp 1.350.000.000) on the frontend[cite: 2].
*   **Delete Operation:** Implement Soft Delete (`deleted_at` timestamp), never hard delete[cite: 2].
*   **Authentication:** Handle sessions using httpOnly and SameSite=Lax cookies[cite: 2]. Lockout accounts for 15 minutes after 5 failed attempts[cite: 2].

Do not deviate from the RBAC rules. An Admin attempting a POST/PUT/DELETE request must receive a 403 Forbidden response[cite: 2].
<!-- END:nextjs-agent-rules -->
