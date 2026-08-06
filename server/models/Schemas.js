import mongoose from 'mongoose'

// Hero Schema
const heroSchema = new mongoose.Schema({
  name: String,
  tagline: String,
  roles: [String],
  techOrbs: [{ label: String, color: String, angle: Number, radius: Number }],
  resumeUrl: String,
  resumeName: String,
})

// About Schema
const aboutSchema = new mongoose.Schema({
  name: String,
  role: String,
  location: String,
  bio: [String],
  tags: [String],
  cards: [{ icon: String, color: String, title: String, desc: String }],
  stats: [{ label: String, value: Number, suffix: String }]
})

// Skill Category Schema
const skillCategorySchema = new mongoose.Schema({
  name: String,
  color: String,
  skills: [{ name: String, pct: Number }]
})

// Project Schema
const projectSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  tech: [String],
  color: String,
  gradient: String,
  features: [String],
  category: String,
  status: String,
  liveUrl: String,
  githubUrl: String
})

// Experience / Timeline Schema
const experienceSchema = new mongoose.Schema({
  year: String,
  startDate: String,
  endDate: String,
  isCurrent: Boolean,
  title: String,
  desc: String,
  color: String,
  icon: String
})

// AI Showcase Schema
const aiShowcaseSchema = new mongoose.Schema({
  iconName: String,
  title: String,
  desc: String,
  color: String,
  tags: [String],
  status: String
})

// GitHub Dashboard Schema
const githubStatSchema = new mongoose.Schema({
  repositoriesCount: Number,
  totalStars: Number,
  followers: Number,
  commitsThisYear: Number,
  currentStreak: Number,
  longestStreak: Number,
  recentRepos: [{ name: String, desc: String, lang: String, stars: Number, forks: Number, color: String }],
  langStats: [{ lang: String, pct: Number, color: String }],
  contribGrid: [{ id: Number, lvl: Number }]
})

// Certification Schema
const certificationSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  date: String,
  category: String,
  color: String,
  gradient: String,
  credentialId: String,
  imageUrl: String,
  skills: [String],
  verified: Boolean
})

// Achievement Schema
const achievementSchema = new mongoose.Schema({
  platform: String,
  color: String,
  stats: [{ label: String, value: Number }],
  badge: String,
  badgeColor: String
})

// Blog Post Schema
const blogPostSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  category: String,
  readTime: String,
  date: String,
  color: String,
  gradient: String,
  tags: [String],
  featured: Boolean
})

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  name: String,
  role: String,
  company: String,
  avatar: String,
  avatarColor: String,
  rating: Number,
  review: String,
  highlight: String
})

// Contact Message Schema
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: String,
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

// Chat FAQ Schema
const chatFAQSchema = new mongoose.Schema({
  keywords: [String],
  response: String
})

// Contact Info & Socials Schema
const contactInfoSchema = new mongoose.Schema({
  name: String,
  role: String,
  bio: String,
  socials: [
    { label: String, href: String, color: String }
  ]
})

export const HeroModel = mongoose.model('Hero', heroSchema)
export const AboutModel = mongoose.model('About', aboutSchema)
export const SkillCategoryModel = mongoose.model('SkillCategory', skillCategorySchema)
export const ProjectModel = mongoose.model('Project', projectSchema)
export const ExperienceModel = mongoose.model('Experience', experienceSchema)
export const AIShowcaseModel = mongoose.model('AIShowcase', aiShowcaseSchema)
export const GitHubStatModel = mongoose.model('GitHubStat', githubStatSchema)
export const CertificationModel = mongoose.model('Certification', certificationSchema)
export const AchievementModel = mongoose.model('Achievement', achievementSchema)
export const BlogPostModel = mongoose.model('BlogPost', blogPostSchema)
export const TestimonialModel = mongoose.model('Testimonial', testimonialSchema)
export const ContactMessageModel = mongoose.model('ContactMessage', contactMessageSchema)
export const ContactInfoModel = mongoose.model('ContactInfo', contactInfoSchema)
export const ChatFAQModel = mongoose.model('ChatFAQ', chatFAQSchema)
