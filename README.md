# Nova - Modern Streaming Platform 

<div align="center">
  <img src="./public/logo.png" alt="Nova Logo" width="120" height="120">
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC)](https://tailwindcss.com/)
  [![Clerk](https://img.shields.io/badge/Clerk-6.x-7C3AED)](https://clerk.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748)](https://www.prisma.io/)
  
  **A sleek, modern streaming platform aggregating content from multiple sources**
</div>

## 🌟 Features

### 🎬 Content & Streaming
- **Multi-Source Streaming**: Access movies and TV shows from 20+ streaming sources
- **Content Categories**: Hollywood, Bollywood, Anime, Netflix Originals, Amazon Prime Video
- **Live Sports**: Real-time sports streaming with dedicated sports section
- **Search & Discovery**: Advanced search with filters for genre, year, and quality
- **Watch Later**: Personal watchlist functionality with local storage

### 🔐 Authentication & User Management
- **Clerk Authentication**: Secure user authentication with OAuth support
- **User Profiles**: Customizable profiles with avatar upload functionality
- **Database Sync**: Automatic user data synchronization via webhooks

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark UI with gradient accents
- **Hero Carousel**: Featured content with auto-rotating showcase
- **Infinite Scroll**: Seamless content loading with pagination

### 🛡️ Security & Safety
- **Smart Sandbox Protection**: Intelligent iframe sandboxing with security indicators
- **Ad-Blocker Recommendations**: Built-in warnings and popup blocking
- **Content Moderation**: Adult content filtering and blocked content management
- **Secure Headers**: Proper security headers and CSRF protection

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/mdtahseen7/nova-nextjs.git
cd nova-nextjs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see Nova in action.

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database (PostgreSQL recommended for production)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Clerk URLs (Optional customization)
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# Production Settings
NODE_ENV="production"
```

### Database Setup

Nova supports multiple database providers:

1. **PostgreSQL** (Recommended for production)
   - Supabase, Vercel Postgres, or self-hosted PostgreSQL
   
2. **SQLite** (Development only)
   - Automatic setup for local development

For detailed database configuration, see [DATABASE_SETUP.md](./DATABASE_SETUP.md)

## 🎯 Streaming Sources & Security

### Available Sources
Nova aggregates content from 20+ streaming sources including:
- VidSrc, AutoEmbed, VidPlay
- SmashyStream, SuperEmbed
- 2Embed, VidFast, Vidify
- And many more...

### 🔒 Security Notice

**⚠️ Important: Use Ad Blockers**

Some streaming sources require disabled iframe sandboxing, which may expose users to:
- Popup advertisements
- Redirect attempts  
- Overlay ads
- Tracking scripts

**Recommended Ad Blockers:**
- uBlock Origin (Chrome/Firefox)
- AdBlock Plus
- Brave Browser (built-in blocking)

Nova provides:
- Built-in popup blocking
- Security level indicators
- Source safety warnings
- Ad-blocker recommendations

For more details, see [SANDBOX_SECURITY.md](./SANDBOX_SECURITY.md) and [AD_SECURITY_RISKS.md](./AD_SECURITY_RISKS.md)

## 📱 Pages & Features

| Page | Description | Features |
|------|-------------|----------|
| **Home** | Main dashboard | Hero carousel, content sections, search |
| **Watch** | Video player | Multi-source streaming, episode selection |
| **Live Sports** | Sports streaming | Real-time sports content |
| **Profile** | User management | Avatar upload, profile settings |
| **Settings** | Configuration | User preferences, account settings |

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.4.4** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - Modern React with concurrent features

### Backend
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary database (production)
- **Clerk** - Authentication and user management
- **Svix** - Webhook verification

### External APIs
- **TMDB API** - Movie and TV show metadata
- **Multiple streaming sources** - Video content providers

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Configure environment variables
   - Deploy automatically

3. **Configure Database**
   - Set up PostgreSQL (Supabase/Vercel Postgres)
   - Update `DATABASE_URL` in Vercel environment

For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### Other Platforms
Nova can be deployed to any platform supporting Node.js:
- Netlify, Railway, DigitalOcean App Platform
- AWS, Google Cloud, Azure
- Self-hosted with Docker

## 📄 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
```

## 🔧 Development

### Project Structure
```
nova-nextjs/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── watch/          # Video player page
│   └── ...
├── components/         # Reusable React components
├── lib/               # Utilities and configurations
├── prisma/            # Database schema and migrations
├── public/            # Static assets
└── types/             # TypeScript type definitions
```

### Key Components
- **HeroSection**: Featured content carousel
- **ContentSection**: Movie/TV show grids
- **Navbar**: Navigation with search
- **Avatar**: User profile picture component

## ⚖️ Legal & Disclaimer

**Important Notice**: Nova is an educational project that aggregates links to third-party streaming sources. 

- **No Content Hosting**: Nova does not host any video content
- **Third-Party Sources**: All streams are provided by external sources
- **Educational Purpose**: This project is for educational and demonstration purposes
- **User Responsibility**: Users are responsible for compliance with local laws

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and inquiries:
- **Issues**: Open a GitHub issue
- **Documentation**: Check the docs folder
- **Security**: Report security issues privately

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/mdtahseen7">MD Tahseen</a></p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>

