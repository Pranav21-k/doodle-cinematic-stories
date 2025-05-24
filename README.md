# Doodle Cinematic Stories

A modern, responsive video portfolio website showcasing cinematic storytelling through professional video content. Built with React, TypeScript, and Tailwind CSS.

## 🎬 Featured Videos

The application showcases videos from the `/public/modelling/` folder with the following priority structure:

### Main Featured Videos (Auto-rotating carousel)
- **1.mp4** - Cinematic Showcase (Premium Collection)
- **2.mp4** - Creative Vision (Artistic Direction) 
- **3.mp4** - Professional Portfolio (Studio Production)
- **4.mp4** - Brand Storytelling (Visual Narrative)

### Video Categories

#### Fashion & Modeling (`01.mp4` - `08.mp4`)
- Fashion show highlights, runway showcases, collections, and editorial content

#### Events & Nightlife (`p2.mp4` - `p6.mp4`)
- Club events, DJ showcases, VIP coverage, concerts, and private parties

#### Brand Collaborations (`ad1.mp4`)
- Product launches, marketing campaigns, and brand partnerships

#### Fitness & Training (`f1.mp4`, `f2.mp4`, `t1.mp4` - `t3.mp4`)
- Workout series, wellness content, personal training, and yoga sessions

## 🚀 Video Features

- **Auto-playing carousel** with the 4 main featured videos (1-4.mp4)
- **Category filtering** - Browse videos by type (Fashion, Events, Fitness, Brand)
- **Interactive preview** - Hover to play, click to view full-screen
- **Featured video management** - Toggle which videos appear in the main carousel
- **Responsive design** - Works on desktop, tablet, and mobile
- **Local storage** - Video preferences are saved locally

## Project info

**URL**: https://lovable.dev/projects/8557c19c-18dd-4108-bedd-d4d5096cfbe1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/8557c19c-18dd-4108-bedd-d4d5096cfbe1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## 📁 Video Setup

### Adding New Videos

1. Place your MP4 files in the `/public/modelling/` directory
2. Update the video array in `/src/pages/Index.tsx` to include your new videos
3. Videos will automatically be available in the portfolio

### Video Structure

Videos should be placed in `/public/modelling/` with the following naming conventions:

- `1.mp4, 2.mp4, 3.mp4, 4.mp4` - Main featured videos (highest priority)
- `01.mp4 - 08.mp4` - Fashion and modeling content  
- `p1.mp4 - p6.mp4` - Events and party content
- `f1.mp4, f2.mp4` - Fitness content
- `t1.mp4 - t3.mp4` - Training content
- `ad1.mp4` - Advertisement/brand content

### Video Configuration

Videos are configured in `/src/pages/Index.tsx` with the following properties:

```typescript
{
  id: number,           // Unique identifier
  title: string,        // Display title
  client: string,       // Client or project name
  category: string,     // Category (fashion, events, fitness, brand)
  thumbnail: string,    // Path to video file (same as videoUrl)
  videoUrl: string,     // Path to video file in /public/modelling/
  featured: boolean     // Whether to show in main carousel
}
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- **Vite** - Fast development build tool
- **TypeScript** - Type-safe JavaScript
- **React** - UI framework with hooks and components
- **shadcn-ui** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

## Key Features

- 🎥 **Video Portfolio** - Professional video showcase with categories
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Modern UI** - Clean, professional design with smooth animations
- ⚡ **Fast Performance** - Optimized video loading and playback
- 🔧 **Admin Panel** - Video management interface (development mode)
- 💾 **Local Storage** - Persistent video preferences
- 🎯 **SEO Optimized** - Professional business website structure

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8557c19c-18dd-4108-bedd-d4d5096cfbe1) and click on Share → Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 🎯 Business Sections

The website includes:

- **Hero Section** - Compelling introduction with call-to-action
- **Video Portfolio** - Main showcase with filtering and featured videos
- **Client Logos** - Trust indicators and social proof
- **About Us** - Company story and expertise
- **Services** - Detailed service offerings
- **Contact** - Multiple ways to get in touch
- **Footer** - Additional links and information
