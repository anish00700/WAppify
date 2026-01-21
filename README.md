# WAppify - Advanced WhatsApp Analytics & Behavioral Profiling

WAppify is a privacy-first, sophisticated analytics platform that transforms your WhatsApp chat exports into stunning visual stories and deep psychological insights. It runs entirely in your browser, ensuring your personal conversations never leave your device.

## 🚀 Key Features

### 🔒 Privacy First
- **Local Processing**: All chat parsing and analysis happens 100% client-side using WebAssembly.
- **Zero Data Retention**: Your chat files are never uploaded to any server.

### 📊 Deep Analysis Suite
- **Relationship Health Trend**: Visualise how your connection has evolved over time with sentiment analysis.
- **Behavioral Profiling**: AI-driven detection of chat personas (e.g., "Ghost", "Simp", "Night Owl", "Early Bird").
- **Activity Heatmaps**: Discover your busiest hours and days of the week.
- **Word Clouds**: Dynamic visualization of your most used vocabulary.

### 📚 Digital Storybook
- **PDF Export**: Convert your chat history into a beautifully formatted, novel-style PDF.
- **Custom Design**: Professional typography and layout optimized for printing as a keepsake.

### 👥 Interactive Dashboard
- **Group Comparisons**: Compare statistics across different group chats.
- **Global Search**: Instantly find specific messages or dates.
- **Responsive Design**: Seamless experience across desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion (for animations)
- **Charts**: Recharts
- **PDF Generation**: @react-pdf/renderer
- **Backend/Auth**: Supabase (Auth, Edge Functions, Database)
- **State Management**: React Context API
- **Routing**: React Router DOM

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anish00700/WAppify.git
   cd WAppify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔐 Security & Auth

Authentication is handled securely via Supabase.
- **Email Verification**: Required for all new accounts to ensure user authenticity.
- **Protected Routes**: Dashboard and analysis pages are strictly gated behind authentication.
- **Row Level Security (RLS)**: Database policies ensure users can only access their own profile data.

## 💳 Subscription System

The project includes a tiered subscription model (Free vs. Pro).
- **Free Tier**: Basic statistics, limited history analysis.
- **Pro Tier**: specialized behavioral insights, PDF export, unlimited uploads.
- *Current Status*: Payment processing is simulated for demonstration purposes.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by [Anish Patil](https://github.com/anish00700)
