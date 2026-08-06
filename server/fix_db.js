import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_db'

async function run() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB...')
    const db = mongoose.connection.db

    const chatfaqs = db.collection('chatfaqs')
    const allFaqs = await chatfaqs.find({}).toArray()
    for (const f of allFaqs) {
      let resp = (f.response || '').replace(/Sidharth/gi, 'Tek Narayan').replace(/Siddharth/gi, 'Tek Narayan')
      let kw = Array.isArray(f.keywords) ? [...f.keywords] : []
      if (!kw.includes('sidharth')) kw.push('sidharth')
      if (!kw.includes('siddharth')) kw.push('siddharth')
      await chatfaqs.updateOne({ _id: f._id }, { $set: { response: resp, keywords: kw } })
    }

    const heroes = db.collection('heroes')
    await heroes.updateMany({ name: /Sidharth/i }, { $set: { name: 'Tek Narayan Yadav' } })

    const abouts = db.collection('abouts')
    await abouts.updateMany({ name: /Sidharth/i }, { $set: { name: 'Tek Narayan Yadav' } })

    const testimonials = db.collection('testimonials')
    const allTest = await testimonials.find({}).toArray()
    for (const t of allTest) {
      if (t.review && /Sidharth|Siddharth/i.test(t.review)) {
        let updatedRev = t.review.replace(/Sidharth/gi, 'Tek Narayan').replace(/Siddharth/gi, 'Tek Narayan')
        await testimonials.updateOne({ _id: t._id }, { $set: { review: updatedRev } })
      }
    }

    console.log('Migration Completed Successfully!')
    process.exit(0)
  } catch (err) {
    console.error('Migration error:', err.message)
    process.exit(0)
  }
}

run()
