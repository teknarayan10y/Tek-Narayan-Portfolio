import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import apiRoutes from './routes/api.js'
import {
  heroData,
  aboutData,
  skillCategoriesData,
  projectsData,
  timelineData,
  aiShowcaseData,
  githubData,
  certsData,
  achievementsData,
  blogPostsData,
  testimonialsData,
  chatFAQsData
} from './seedData.js'
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
  ChatFAQModel
} from './models/Schemas.js'

dotenv.config()

const app = express()
const DEFAULT_PORT = parseInt(process.env.PORT || '5000')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_db'

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Mount API routes
app.use('/api', apiRoutes)

// Auto-seed and update database records
async function seedDatabaseIfEmpty() {
  try {
    const heroCount = await HeroModel.countDocuments()
    if (heroCount === 0) {
      console.log('Seeding MongoDB database with initial portfolio data...')
      await HeroModel.create(heroData)
      await AboutModel.create(aboutData)
      await SkillCategoryModel.insertMany(skillCategoriesData)
      await ProjectModel.insertMany(projectsData)
      await ExperienceModel.insertMany(timelineData)
      await AIShowcaseModel.insertMany(aiShowcaseData)
      await GitHubStatModel.create(githubData)
      await CertificationModel.insertMany(certsData)
      await AchievementModel.insertMany(achievementsData)
      await BlogPostModel.insertMany(blogPostsData)
      await TestimonialModel.insertMany(testimonialsData)
      await ChatFAQModel.insertMany(chatFAQsData)
      console.log('MongoDB Seeding complete!')
    } else {
      console.log('MongoDB contains existing portfolio records.')
    }

    // Migrate any remaining Sidharth / Siddharth references in DB to Tek Narayan
    await migrateDatabaseNames()
  } catch (err) {
    console.error('Error during MongoDB seeding:', err.message)
  }
}

async function migrateDatabaseNames() {
  try {
    await HeroModel.updateMany(
      { $or: [{ name: /Sidharth/i }, { name: /Siddharth/i }] },
      { $set: { name: 'Tek Narayan Yadav' } }
    )
    await AboutModel.updateMany(
      { $or: [{ name: /Sidharth/i }, { name: /Siddharth/i }] },
      { $set: { name: 'Tek Narayan Yadav' } }
    )

    const faqs = await ChatFAQModel.find()
    for (const faq of faqs) {
      let changed = false
      if (faq.response && (faq.response.includes('Sidharth') || faq.response.includes('Siddharth'))) {
        faq.response = faq.response.replace(/Sidharth/gi, 'Tek Narayan').replace(/Siddharth/gi, 'Tek Narayan')
        changed = true
      }
      if (!faq.keywords.includes('sidharth')) {
        faq.keywords.push('sidharth')
        changed = true
      }
      if (!faq.keywords.includes('siddharth')) {
        faq.keywords.push('siddharth')
        changed = true
      }
      if (changed) {
        await faq.save()
      }
    }

    const testimonials = await TestimonialModel.find()
    for (const t of testimonials) {
      if (t.review && (t.review.includes('Sidharth') || t.review.includes('Siddharth'))) {
        t.review = t.review.replace(/Sidharth/gi, 'Tek Narayan').replace(/Siddharth/gi, 'Tek Narayan')
        await t.save()
      }
    }

    console.log('MongoDB records checked & synchronized to Tek Narayan Yadav!')
  } catch (err) {
    console.error('Error migrating database names:', err.message)
  }
}

function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    console.log(`Portfolio Express Backend Server running on http://localhost:${portToUse}`)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${portToUse} is currently in use. Trying port ${portToUse + 1}...`)
      startServer(portToUse + 1)
    } else {
      console.error('Server startup error:', err.message)
    }
  })
}

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log(`Connected to MongoDB at ${MONGODB_URI}`)
    await seedDatabaseIfEmpty()
    startServer(DEFAULT_PORT)
  })
  .catch((err) => {
    console.warn(`MongoDB Connection Warning: ${err.message}`)
    console.warn('Backend server starting without live MongoDB connection...')
    startServer(DEFAULT_PORT)
  })
