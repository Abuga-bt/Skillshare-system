<<<<<<< HEAD
=======
# SkillSwap 🤝

A community-powered skill exchange platform where neighbors share knowledge, learn new skills, and build meaningful connections.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)

## 🌟 Features

### For Skill Seekers
- **Discover Skills** - Browse a diverse catalog of skills offered by community members
- **Smart Search** - Filter by category, location, and availability
- **Direct Messaging** - Connect instantly with skill providers
- **Request Exchanges** - Propose skill swaps with personalized messages

### For Skill Providers
- **Showcase Expertise** - Create detailed skill listings with descriptions
- **Build Reputation** - Earn reviews and ratings from successful exchanges
- **Manage Requests** - Accept, decline, or negotiate exchange proposals
- **Track History** - View all past and pending exchanges

### Community Features
- **User Profiles** - Customizable profiles with bio, location, and avatar
- **Rating System** - 5-star reviews to build trust within the community
- **Real-time Chat** - Instant messaging between users
- **Skill Categories** - Technology, Education, Creative, Health & Wellness, and more

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Backend**: Lovable Cloud (Supabase)
- **Authentication**: Email-based auth with session management
- **Database**: PostgreSQL with Row Level Security
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd skillswap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui base components
│   ├── Layout.tsx     # Main layout wrapper
│   ├── Navbar.tsx     # Navigation header
│   └── Footer.tsx     # Site footer
├── contexts/          # React context providers
│   └── AuthContext.tsx
├── hooks/             # Custom React hooks
├── integrations/      # External service integrations
│   └── supabase/      # Database client & types
├── lib/               # Utility functions
├── pages/             # Route page components
│   ├── Index.tsx      # Landing page
│   ├── Skills.tsx     # Skill discovery
│   ├── Exchanges.tsx  # Exchange management
│   ├── Messages.tsx   # Chat interface
│   ├── Profile.tsx    # User profile
│   ├── Help.tsx       # FAQ & support
│   └── About.tsx      # About the platform
└── main.tsx           # Application entry point
```

## 🎨 Design System

SkillSwap uses a custom design system built on Tailwind CSS with semantic color tokens:

- **Primary**: Main brand color for CTAs and highlights
- **Secondary**: Supporting elements and backgrounds
- **Accent**: Emphasis and decorative elements
- **Muted**: Subtle text and disabled states

Dark mode is fully supported with automatic system preference detection.

## 📊 Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profile information |
| `skills` | Skill listings (offered & wanted) |
| `exchange_requests` | Skill exchange proposals |
| `messages` | Direct messages between users |
| `reviews` | User ratings and feedback |

## 🔒 Security

- Row Level Security (RLS) policies on all tables
- Authenticated routes for sensitive operations
- Secure session management
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)

---

<p align="center">
  Made with ❤️ for communities everywhere
</p>
>>>>>>> e2a5835aa06fe1e08f5570b054d2928ceb54c011
