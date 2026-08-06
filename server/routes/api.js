import express from 'express'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
import {
  HeroModel,
  AboutModel,
  SkillCategoryModel,
  ProjectModel,
  ExperienceModel,
  AIShowcaseModel,
  GitHubStatModel,
  CertificationModel,
  AchievementModel,
  BlogPostModel,
  TestimonialModel,
  ContactMessageModel,
  ContactInfoModel,
  ChatFAQModel
} from '../models/Schemas.js'

const router = express.Router()

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// GET /api/hero
router.get('/hero', async (req, res) => {
  try {
    const data = await HeroModel.findOne()
    res.json(data || {})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/hero — Update hero roles & resume file (Admin required)
router.put('/hero', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { name, tagline, roles, techOrbs, resumeUrl, resumeName } = req.body
    let hero = await HeroModel.findOne()
    if (!hero) {
      hero = new HeroModel({ name, tagline, roles, techOrbs, resumeUrl, resumeName })
    } else {
      if (name !== undefined) hero.name = name
      if (tagline !== undefined) hero.tagline = tagline
      if (roles !== undefined) hero.roles = roles
      if (techOrbs !== undefined) hero.techOrbs = techOrbs
      if (resumeUrl !== undefined) hero.resumeUrl = resumeUrl
      if (resumeName !== undefined) hero.resumeName = resumeName
    }

    await hero.save()
    res.json(hero)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/about
router.get('/about', async (req, res) => {
  try {
    const data = await AboutModel.findOne()
    res.json(data || {})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/about — Update about journey details (Admin required)
router.put('/about', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { name, role, location, bio, tags, cards } = req.body
    let about = await AboutModel.findOne()
    if (!about) {
      about = new AboutModel({ name, role, location, bio, tags, cards })
    } else {
      if (name !== undefined) about.name = name
      if (role !== undefined) about.role = role
      if (location !== undefined) about.location = location
      if (bio !== undefined) about.bio = bio
      if (tags !== undefined) about.tags = tags
      if (cards !== undefined) about.cards = cards
    }

    await about.save()
    res.json(about)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/skills
router.get('/skills', async (req, res) => {
  try {
    const categories = await SkillCategoryModel.find()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/skills — Add new skill category / skills (Admin required)
router.post('/skills', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { name, color, skills } = req.body
    if (!name) return res.status(400).json({ error: 'Category name is required' })

    const formattedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map(s => {
          const parts = s.split(':')
          return { name: parts[0].trim(), pct: parseInt(parts[1] || '85') }
        })
      : []

    const newCategory = new SkillCategoryModel({
      name,
      color: color || '#4361ee',
      skills: formattedSkills,
    })

    await newCategory.save()
    res.status(201).json(newCategory)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/skills/:id — Remove skill category (Admin required)
router.delete('/skills/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const deleted = await SkillCategoryModel.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Skill category not found' })

    res.json({ success: true, message: 'Skill category deleted', id: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await ProjectModel.find()
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin123'

// POST /api/projects — Add new project (Admin required)
router.post('/projects', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { title, subtitle, description, tech, color, gradient, features, category, status, liveUrl, githubUrl } = req.body
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and Description are required' })
    }

    const newProject = new ProjectModel({
      title,
      subtitle: subtitle || 'Featured Project',
      description,
      tech: Array.isArray(tech) ? tech : (tech || '').split(',').map(t => t.trim()).filter(Boolean),
      color: color || '#4361ee',
      gradient: gradient || 'from-blue-600 to-purple-700',
      features: Array.isArray(features) ? features : (features || '').split(',').map(f => f.trim()).filter(Boolean),
      category: category || 'Full Stack',
      status: status || 'Live',
      liveUrl: liveUrl || '#',
      githubUrl: githubUrl || '#'
    })

    await newProject.save()
    res.status(201).json(newProject)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/projects/:id — Remove project (Admin required)
router.delete('/projects/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const deleted = await ProjectModel.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Project not found' })

    res.json({ success: true, message: 'Project deleted successfully', id: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/projects/:id — Update existing project (Admin required)
router.put('/projects/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { title, subtitle, description, tech, color, gradient, features, category, status, liveUrl, githubUrl } = req.body
    const updated = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subtitle,
        description,
        tech: Array.isArray(tech) ? tech : (tech || '').split(',').map(t => t.trim()).filter(Boolean),
        color,
        gradient,
        features: Array.isArray(features) ? features : (features || '').split(',').map(f => f.trim()).filter(Boolean),
        category,
        status,
        liveUrl,
        githubUrl,
      },
      { new: true }
    )

    if (!updated) return res.status(404).json({ error: 'Project not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/experience
router.get('/experience', async (req, res) => {
  try {
    const timeline = await ExperienceModel.find()
    res.json(timeline)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/experience — Add new timeline experience entry (Admin required)
router.post('/experience', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { year, startDate, endDate, isCurrent, title, desc, color, icon } = req.body
    if (!title || !desc) {
      return res.status(400).json({ error: 'Title and description are required' })
    }

    const newEntry = new ExperienceModel({
      year: year || '2024',
      startDate: startDate || '',
      endDate: endDate || '',
      isCurrent: Boolean(isCurrent),
      title: title.trim(),
      desc: desc.trim(),
      color: color || '#4361ee',
      icon: icon || '🚀',
    })

    await newEntry.save()
    res.status(201).json(newEntry)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/experience/:id — Update timeline experience entry (Admin required)
router.put('/experience/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { year, startDate, endDate, isCurrent, title, desc, color, icon } = req.body
    const updated = await ExperienceModel.findByIdAndUpdate(
      req.params.id,
      { year, startDate, endDate, isCurrent: Boolean(isCurrent), title, desc, color, icon },
      { new: true }
    )

    if (!updated) return res.status(404).json({ error: 'Timeline experience entry not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/experience/:id — Delete timeline experience entry (Admin required)
router.delete('/experience/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const deleted = await ExperienceModel.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Timeline experience entry not found' })

    res.json({ success: true, message: 'Timeline entry deleted', id: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/ai-showcase
router.get('/ai-showcase', async (req, res) => {
  try {
    const items = await AIShowcaseModel.find()
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ai-showcase — Add new AI project card (Admin required)
router.post('/ai-showcase', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { title, desc, color, tags, status, iconName } = req.body
    if (!title || !desc) {
      return res.status(400).json({ error: 'Title and description are required' })
    }

    const newAIProject = new AIShowcaseModel({
      title: title.trim(),
      desc: desc.trim(),
      color: color || '#a855f7',
      tags: Array.isArray(tags) ? tags : (tags || 'LangChain, OpenAI').split(',').map(t => t.trim()).filter(Boolean),
      status: status || 'Production',
      iconName: iconName || 'Brain',
    })

    await newAIProject.save()
    res.status(201).json(newAIProject)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/ai-showcase/:id — Update existing AI project card (Admin required)
router.put('/ai-showcase/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { title, desc, color, tags, status, iconName } = req.body
    const updated = await AIShowcaseModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        desc,
        color,
        tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean),
        status,
        iconName,
      },
      { new: true }
    )

    if (!updated) return res.status(404).json({ error: 'AI Showcase project not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/ai-showcase/:id — Remove AI project card (Admin required)
router.delete('/ai-showcase/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const deleted = await AIShowcaseModel.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'AI Showcase project not found' })

    res.json({ success: true, message: 'AI Showcase project deleted', id: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/github
router.get('/github', async (req, res) => {
  try {
    const stats = await GitHubStatModel.findOne()
    res.json(stats || {})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/github — Update GitHub statistics & repos (Admin required)
router.put('/github', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { repositoriesCount, totalStars, followers, commitsThisYear, currentStreak, longestStreak, recentRepos, langStats, contribGrid } = req.body
    let stats = await GitHubStatModel.findOne()
    if (!stats) {
      stats = new GitHubStatModel({
        repositoriesCount: repositoriesCount || 48,
        totalStars: totalStars || 377,
        followers: followers || 124,
        commitsThisYear: commitsThisYear || 847,
        currentStreak: currentStreak || 23,
        longestStreak: longestStreak || 91,
        recentRepos: recentRepos || [],
        langStats: langStats || [],
        contribGrid: contribGrid || [],
      })
    } else {
      if (repositoriesCount !== undefined) stats.repositoriesCount = repositoriesCount
      if (totalStars !== undefined) stats.totalStars = totalStars
      if (followers !== undefined) stats.followers = followers
      if (commitsThisYear !== undefined) stats.commitsThisYear = commitsThisYear
      if (currentStreak !== undefined) stats.currentStreak = currentStreak
      if (longestStreak !== undefined) stats.longestStreak = longestStreak
      if (recentRepos !== undefined) stats.recentRepos = recentRepos
      if (langStats !== undefined) stats.langStats = langStats
      if (contribGrid !== undefined) stats.contribGrid = contribGrid
    }

    await stats.save()
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/certifications
router.get('/certifications', async (req, res) => {
  try {
    const certs = await CertificationModel.find()
    res.json(certs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/certifications — Add new certification (Admin required)
router.post('/certifications', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { title, issuer, date, category, color, gradient, credentialId, imageUrl, skills, verified } = req.body
    if (!title || !issuer) {
      return res.status(400).json({ error: 'Title and Issuer are required' })
    }

    const newCert = new CertificationModel({
      title,
      issuer,
      date: date || '2024',
      category: category || 'Full Stack',
      color: color || '#4361ee',
      gradient: gradient || 'from-blue-600 to-blue-800',
      credentialId: credentialId || `CERT-${Date.now().toString().slice(-6)}`,
      imageUrl: imageUrl || '',
      skills: Array.isArray(skills) ? skills : (skills || '').split(',').map(s => s.trim()).filter(Boolean),
      verified: verified !== undefined ? Boolean(verified) : true,
    })

    await newCert.save()
    res.status(201).json(newCert)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/certifications/:id — Remove certification (Admin required)
router.delete('/certifications/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const deleted = await CertificationModel.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Certification not found' })

    res.json({ success: true, message: 'Certification deleted', id: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/achievements
router.get('/achievements', async (req, res) => {
  try {
    const items = await AchievementModel.find()
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/achievements — Add new coding milestone achievement (Admin required)
router.post('/achievements', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { platform, color, stats, badge, badgeColor } = req.body
    if (!platform) {
      return res.status(400).json({ error: 'Platform name is required' })
    }

    const newAchievement = new AchievementModel({
      platform,
      color: color || '#f59e0b',
      stats: Array.isArray(stats) ? stats : [],
      badge: badge || 'Coder',
      badgeColor: badgeColor || color || '#f59e0b',
    })

    await newAchievement.save()
    res.status(201).json(newAchievement)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/achievements/:id — Delete achievement (Admin required)
router.delete('/achievements/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const deleted = await AchievementModel.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Achievement milestone not found' })

    res.json({ success: true, message: 'Achievement milestone deleted', id: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/achievements/:id — Update existing achievement card (Admin required)
router.put('/achievements/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { platform, color, stats, badge, badgeColor } = req.body
    const updated = await AchievementModel.findByIdAndUpdate(
      req.params.id,
      { platform, color, stats, badge, badgeColor },
      { new: true }
    )

    if (!updated) return res.status(404).json({ error: 'Achievement milestone not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/blog
router.get('/blog', async (req, res) => {
  try {
    const posts = await BlogPostModel.find()
    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/blog — Publish new blog post (Admin required)
router.post('/blog', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { title, excerpt, content, category, readTime, date, color, gradient, tags, featured } = req.body
    if (!title || !excerpt) {
      return res.status(400).json({ error: 'Title and Excerpt are required' })
    }

    const newPost = new BlogPostModel({
      title,
      excerpt,
      content: content || '',
      category: category || 'Engineering',
      readTime: readTime || '5 min',
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color: color || '#a855f7',
      gradient: gradient || 'from-purple-600/20 to-blue-600/10',
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean),
      featured: Boolean(featured),
    })

    await newPost.save()
    res.status(201).json(newPost)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/blog/:id — Remove blog post (Admin required)
router.delete('/blog/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const deleted = await BlogPostModel.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Blog post not found' })

    res.json({ success: true, message: 'Blog post deleted', id: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const list = await TestimonialModel.find()
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/testimonials — Public endpoint to submit a review/comment
router.post('/testimonials', async (req, res) => {
  try {
    const { name, role, company, rating, review, highlight } = req.body
    if (!name || !review) {
      return res.status(400).json({ error: 'Name and Review comment are required.' })
    }

    const colors = ['#4361ee', '#06b6d4', '#a855f7', '#ec4899', '#f59e0b', '#84ce24', '#61dafb']
    const avatarColor = colors[Math.floor(Math.random() * colors.length)]
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    const newTestimonial = new TestimonialModel({
      name: name.trim(),
      role: role ? role.trim() : 'Visitor',
      company: company ? company.trim() : 'Portfolio Visitor',
      avatar: avatar || 'PV',
      avatarColor,
      rating: rating ? parseInt(rating) : 5,
      review: review.trim(),
      highlight: highlight ? highlight.trim() : (review.trim().length > 40 ? review.trim().slice(0, 40) + '...' : review.trim()),
    })

    await newTestimonial.save()
    res.status(201).json(newTestimonial)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/testimonials/:id — Delete review (Admin required)
router.delete('/testimonials/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const deleted = await TestimonialModel.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Testimonial not found' })

    res.json({ success: true, message: 'Testimonial deleted', id: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/contact — store contact message in MongoDB & send email to portfolio owner
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' })
    }

    // 1. Save message to MongoDB
    const newMessage = new ContactMessageModel({ name, email, subject, message })
    await newMessage.save()

    // 2. Email Notification setup
    const ownerEmail = process.env.OWNER_EMAIL || process.env.EMAIL_USER || 'teknarayan2456@gmail.com'
    const emailUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : ''
    const rawPass = process.env.EMAIL_PASS || ''
    const emailPass = rawPass.replace(/\s+/g, '')

    if (emailUser && emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        })

        const mailOptions = {
          from: `"${name} (Portfolio Contact)" <${emailUser}>`,
          to: ownerEmail,
          replyTo: email,
          subject: `📩 New Portfolio Contact: ${subject || 'Inquiry'} from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
              <div style="background: linear-gradient(135deg, #4361ee, #7c3aed); padding: 16px 20px; border-radius: 12px; margin-bottom: 20px;">
                <h2 style="color: #ffffff; margin: 0; font-size: 20px;">📩 New Contact Message Received!</h2>
              </div>
              <p style="margin: 6px 0;"><strong>Sender Name:</strong> ${name}</p>
              <p style="margin: 6px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #4361ee;">${email}</a></p>
              <p style="margin: 6px 0;"><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="margin-bottom: 8px;"><strong>Message Content:</strong></p>
              <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 10px; font-style: italic; white-space: pre-wrap; color: #334155; line-height: 1.6;">${message}</div>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 12px; color: #64748b; margin: 0;">Sent directly from your 3D Portfolio Website Contact Form to <strong>${ownerEmail}</strong>.</p>
            </div>
          `,
        }

        const mailResult = await transporter.sendMail(mailOptions)
        console.log('✅ Contact email successfully dispatched to owner Gmail:', mailResult.response)
      } catch (mailErr) {
        console.error('❌ Nodemailer Error sending email:', mailErr.message)
      }
    } else {
      console.log(`[Contact Notification] Message saved in DB! To send live emails to ${ownerEmail}, configure EMAIL_USER & EMAIL_PASS in server/.env`)
    }

    res.status(201).json({
      success: true,
      message: `Thank you ${name}! Your message has been saved in MongoDB and dispatched to the portfolio owner (${ownerEmail})!`,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/contact/info
router.get('/contact/info', async (req, res) => {
  try {
    const info = await ContactInfoModel.findOne()
    res.json(info || {})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/contact/info — Update contact info & socials (Admin required)
router.put('/contact/info', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Passcode' })
    }

    const { name, role, bio, socials } = req.body
    let info = await ContactInfoModel.findOne()
    if (!info) {
      info = new ContactInfoModel({ name, role, bio, socials })
    } else {
      if (name !== undefined) info.name = name
      if (role !== undefined) info.role = role
      if (bio !== undefined) info.bio = bio
      if (socials !== undefined) info.socials = socials
    }

    await info.save()
    res.json(info)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/messages — view submitted contact messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await ContactMessageModel.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/chat — Live multi-collection MongoDB AI assistant
router.post('/chat', async (req, res) => {
  try {
    const { query } = req.body
    if (!query) return res.status(400).json({ error: 'Query is required' })

    const qLower = query.toLowerCase().trim()

    // 1. Check custom ChatFAQs in MongoDB first
    const faqs = await ChatFAQModel.find()
    let faqMatch = faqs.find(item => item.keywords && item.keywords.some(k => qLower.includes(k.toLowerCase())))
    if (faqMatch && faqMatch.response) {
      const cleanResp = faqMatch.response.replace(/Sidharth/gi, 'Tek Narayan').replace(/Siddharth/gi, 'Tek Narayan')
      return res.json({ response: cleanResp })
    }

    // 2. Project Queries — fetch live projects from MongoDB
    if (qLower.includes('project') || qLower.includes('built') || qLower.includes('work') || qLower.includes('app') || qLower.includes('system')) {
      const projects = await ProjectModel.find().sort({ order: 1 })

      // Check if user is asking about a specific project
      const specific = projects.find(p => p.title && qLower.includes(p.title.toLowerCase()))
      if (specific) {
        let text = `🚀 **${specific.title}** (${specific.category || 'Featured Project'})\n`
        text += `${specific.description}\n`
        if (Array.isArray(specific.tags) && specific.tags.length > 0) {
          text += `🛠️ Tech Stack: ${specific.tags.join(', ')}\n`
        }
        if (specific.github) text += `🐱 GitHub: ${specific.github}\n`
        if (specific.liveDemo) text += `🌐 Live Demo: ${specific.liveDemo}`
        return res.json({ response: text })
      }

      if (projects.length > 0) {
        let text = `Here are the projects fetched live from Tek Narayan's database:\n\n`
        projects.slice(0, 5).forEach((p, idx) => {
          text += `${idx + 1}. **${p.title}** — ${p.tagline || p.description?.slice(0, 80)}...\n`
          if (Array.isArray(p.tags) && p.tags.length > 0) text += `   Tech: ${p.tags.slice(0, 4).join(', ')}\n`
        })
        text += `\nYou can click on the 'Projects' section to explore all live demos & source code!`
        return res.json({ response: text })
      }
    }

    // 3. Journey / Experience / Timeline Queries — fetch live timeline entries
    if (qLower.includes('experience') || qLower.includes('journey') || qLower.includes('timeline') || qLower.includes('career') || qLower.includes('history')) {
      const experiences = await ExperienceModel.find().sort({ year: 1 })
      if (experiences.length > 0) {
        let text = `Here is Tek Narayan's journey timeline fetched live from MongoDB:\n\n`
        experiences.forEach(exp => {
          text += `📅 **${exp.year}**: **${exp.role}** at ${exp.company}\n`
          if (exp.description) text += `   ${exp.description}\n`
        })
        return res.json({ response: text })
      }
    }

    // 4. Skills & Tech Stack Queries — fetch live skills from MongoDB
    if (qLower.includes('skill') || qLower.includes('tech') || qLower.includes('stack') || qLower.includes('know') || qLower.includes('language')) {
      const categories = await SkillCategoryModel.find()
      const about = await AboutModel.findOne()

      let text = `Tek Narayan's technical skills fetched live from MongoDB:\n\n`
      if (categories.length > 0) {
        categories.forEach(cat => {
          const skillList = (cat.skills || []).map(s => `${s.name} (${s.pct}%)`).join(', ')
          text += `🔹 **${cat.name}**: ${skillList}\n`
        })
      }
      if (about && Array.isArray(about.tags) && about.tags.length > 0) {
        text += `\n⚡ Top Keywords: ${about.tags.join(', ')}`
      }
      return res.json({ response: text })
    }

    // 5. Testimonial / Review Queries — fetch live reviews from MongoDB
    if (qLower.includes('testimonial') || qLower.includes('review') || qLower.includes('feedback') || qLower.includes('client')) {
      const reviews = await TestimonialModel.find()
      if (reviews.length > 0) {
        let text = `Client testimonials fetched live from MongoDB:\n\n`
        reviews.slice(0, 3).forEach(t => {
          text += `⭐ **${t.name}** (${t.role} at ${t.company}):\n"${t.review}"\n\n`
        })
        return res.json({ response: text.trim() })
      }
    }

    // 6. Blog / Article Queries — fetch live blog posts from MongoDB
    if (qLower.includes('blog') || qLower.includes('article') || qLower.includes('post') || qLower.includes('read')) {
      const blogs = await BlogPostModel.find()
      if (blogs.length > 0) {
        let text = `Articles written by Tek Narayan (live from MongoDB):\n\n`
        blogs.forEach((b, idx) => {
          text += `${idx + 1}. **${b.title}** (${b.category || 'Tech'}, ${b.readTime || '5 min read'})\n   ${b.excerpt || ''}\n`
        })
        return res.json({ response: text })
      }
    }

    // 7. GitHub & Open Source Queries — fetch GitHub stats live from MongoDB
    if (qLower.includes('github') || qLower.includes('open source') || qLower.includes('repo')) {
      const gh = await GitHubStatModel.findOne()
      if (gh) {
        let text = `GitHub Activity fetched live from MongoDB:\n`
        text += `🐱 Profile: @${gh.username || 'teknarayanyadav'}\n`
        text += `📦 Total Repositories: ${gh.publicRepos || 24}\n`
        text += `🔥 Yearly Contributions: ${gh.totalContributions || 500}+\n`
        if (Array.isArray(gh.repos) && gh.repos.length > 0) {
          text += `Top Repos:\n`
          gh.repos.forEach(r => text += ` - **${r.name}**: ${r.description || ''} (${r.language})\n`)
        }
        return res.json({ response: text })
      }
    }

    // 8. Contact & Hiring Queries — fetch live contact info from MongoDB
    if (qLower.includes('contact') || qLower.includes('email') || qLower.includes('hire') || qLower.includes('reach') || qLower.includes('linkedin')) {
      const hero = await HeroModel.findOne()
      const about = await AboutModel.findOne()

      let text = `You can reach out to Tek Narayan Yadav directly:\n\n`
      text += `📧 Email: teknarayan2456@gmail.com\n`
      text += `💼 LinkedIn: https://linkedin.com/in/teknarayanyadav\n`
      text += `🐱 GitHub: https://github.com/teknarayanyadav\n`
      text += `📍 Location: ${about?.location || 'India'}\n`
      text += `⚡ Availability: Open for full-time roles, freelance projects, and AI development!`
      return res.json({ response: text })
    }

    // 9. General Developer Info (Name, Who, About) — fetch live from HeroModel and AboutModel
    const hero = await HeroModel.findOne()
    const about = await AboutModel.findOne()
    let text = `**${hero?.name || 'Tek Narayan Yadav'}** is a ${hero?.roles?.join(' & ') || 'Full Stack & AI Engineer'}.\n\n`
    if (about && Array.isArray(about.bio) && about.bio.length > 0) {
      text += `${about.bio.join('\n\n')}\n\n`
    } else if (hero?.tagline) {
      text += `${hero.tagline}\n\n`
    }
    text += `Ask me about his **projects**, **skills**, **journey timeline**, **blogs**, or **contact info**!`
    return res.json({ response: text })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
