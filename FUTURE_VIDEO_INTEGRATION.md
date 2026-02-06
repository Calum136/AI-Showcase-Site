# Future Video Integration Notes

## Overview
This document outlines planned video integration for the AI-Showcase-Site to improve E-E-A-T signals and user engagement.

## Priority Locations

### 1. FitLanding Page (Highest Priority)
**Location:** After hero section, before input card
**Purpose:** Show the evaluation tool in action
**Suggested Content:**
- 45-60 second demo video
- Show: paste JD → run analysis → review results
- Include face-to-camera intro for trust
- Custom thumbnail with human face

**Placeholder Code (already commented in FitLanding.tsx):**
```tsx
<motion.div className="max-w-2xl mx-auto">
  <div className="aspect-video bg-brand-stone/50 rounded-2xl border-2 border-dashed border-surface-line flex items-center justify-center">
    <Play className="w-12 h-12 text-brand-copper/50 mx-auto" />
  </div>
</motion.div>
```

### 2. Case Study Page
**Location:** After executive summary, before "The Problem"
**Purpose:** Quick walkthrough of the JollyTails system
**Suggested Content:**
- 90-second project overview
- Show actual system interface
- Include before/after comparison

### 3. Home Page
**Location:** Optional - could replace or complement FeaturedCaseStudy
**Purpose:** Quick intro/credibility builder
**Suggested Content:**
- 30-second "who I am and what I build"
- Professional but personal tone

### 4. About Page
**Location:** After hero section
**Purpose:** Personal introduction
**Suggested Content:**
- 60-second personal intro
- Discuss background and approach
- Build trust through human connection

## AI Video Generation Tools to Explore

### For Screen Recording + Narration:
- **Loom** - Simple, professional
- **Descript** - AI editing, transcription
- **ScreenPal** - Free tier available

### For AI-Generated Videos:
- **Synthesia** - AI avatars
- **HeyGen** - Text-to-video with AI presenter
- **D-ID** - Realistic AI presenters
- **Runway ML** - Creative video generation

### For Thumbnails:
- **Canva** - Templates with face-focus
- **Midjourney/DALL-E** - Custom graphics
- Keep human face prominent for CTR

## Technical Implementation

### Embedding Options:
1. **YouTube Embed** (Recommended)
   - Free hosting
   - Good SEO
   - Lazy loading support
   ```tsx
   <iframe
     src="https://www.youtube.com/embed/VIDEO_ID"
     loading="lazy"
     allowFullScreen
   />
   ```

2. **Self-hosted with video tag**
   - More control
   - Need CDN for performance
   ```tsx
   <video controls preload="metadata" poster="/thumbnail.jpg">
     <source src="/demo.mp4" type="video/mp4" />
   </video>
   ```

### Accessibility Requirements:
- Full transcript for each video
- Captions/subtitles
- Descriptive alt text for thumbnails
- Keyboard controls

## Content Script Templates

### FitLanding Demo Video (45 sec)
```
[0-5s] Face intro: "Let me show you how this evaluation tool works."
[5-20s] Screen: paste example JD
[20-35s] Screen: click analyze, show loading, reveal results
[35-45s] Face outro: "Try it yourself with any job description."
```

### Case Study Video (90 sec)
```
[0-10s] Face intro: problem context
[10-40s] Screen: show the problem (scattered docs)
[40-70s] Screen: show the solution in action
[70-90s] Face outro: results and what it means
```

## Metrics to Track
- Video play rate
- Watch time / completion rate
- Click-through from video to CTA
- Time on page with vs without video

## Status
- [ ] FitLanding placeholder added (commented out)
- [ ] Case Study placeholder
- [ ] Create demo script
- [ ] Record videos
- [ ] Add transcripts
- [ ] Deploy and measure
