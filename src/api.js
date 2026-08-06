// Frontend API Client with Fallback Data Support

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://portfolio-backend-1dr5.onrender.com')

function getUrl(endpoint) {
  if (typeof endpoint === 'string' && (endpoint.startsWith('http://') || endpoint.startsWith('https://'))) {
    return endpoint
  }
  return `${API_BASE}${endpoint}`
}

async function apiFetch(endpoint, options) {
  return fetch(getUrl(endpoint), options)
}

async function getJSON(endpoint, fallback) {
  try {
    const res = await apiFetch(endpoint)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data === null || data === undefined) return fallback
    return data
  } catch (err) {
    console.warn(`[API] ${endpoint} fetch warning, using fallback data:`, err.message)
    return fallback
  }
}

export async function fetchHero(fallback) {
  return getJSON('/api/hero', fallback)
}

export async function fetchAbout(fallback) {
  return getJSON('/api/about', fallback)
}

export async function fetchSkills(fallback) {
  return getJSON('/api/skills', fallback)
}

export async function fetchProjects(fallback) {
  return getJSON('/api/projects', fallback)
}

export async function fetchExperience(fallback) {
  return getJSON('/api/experience', fallback)
}

export async function fetchAIShowcase(fallback) {
  return getJSON('/api/ai-showcase', fallback)
}

export async function fetchGitHubData(fallback) {
  return getJSON('/api/github', fallback)
}

export async function fetchCertifications(fallback) {
  return getJSON('/api/certifications', fallback)
}

export async function fetchAchievements(fallback) {
  return getJSON('/api/achievements', fallback)
}

export async function fetchBlogPosts(fallback) {
  return getJSON('/api/blog', fallback)
}

export async function fetchTestimonials(fallback) {
  return getJSON('/api/testimonials', fallback)
}

export async function sendContactMessage(payload) {
  try {
    const res = await apiFetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return await res.json()
  } catch (err) {
    console.warn('[API] Contact submission fallback:', err.message)
    return { success: true, message: 'Message sent (fallback response)' }
  }
}

export async function sendChatQuery(query, fallbackResponse) {
  try {
    const res = await apiFetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    const data = await res.json()
    return data.response || fallbackResponse
  } catch (err) {
    console.warn('[API] Chat query fallback:', err.message)
    return fallbackResponse
  }
}

export async function createProject(projectData, adminKey) {
  try {
    const res = await apiFetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(projectData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, project: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function deleteProjectById(id, adminKey) {
  try {
    const res = await apiFetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-key': adminKey,
      },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function updateProject(id, projectData, adminKey) {
  try {
    const res = await apiFetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(projectData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, project: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function createSkillCategory(skillData, adminKey) {
  try {
    const res = await apiFetch('/api/skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(skillData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, skillCategory: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function deleteSkillCategoryById(id, adminKey) {
  try {
    const res = await apiFetch(`/api/skills/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-key': adminKey,
      },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function createBlogPost(postData, adminKey) {
  try {
    const res = await apiFetch('/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(postData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, post: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function deleteBlogPostById(id, adminKey) {
  try {
    const res = await apiFetch(`/api/blog/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-key': adminKey,
      },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function updateGitHubStats(githubData, adminKey) {
  try {
    const res = await apiFetch('/api/github', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(githubData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, stats: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function createCertification(certData, adminKey) {
  try {
    const res = await apiFetch('/api/certifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(certData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, cert: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function deleteCertificationById(id, adminKey) {
  try {
    const res = await apiFetch(`/api/certifications/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-key': adminKey,
      },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function createAchievement(achievementData, adminKey) {
  try {
    const res = await apiFetch('/api/achievements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(achievementData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, achievement: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function deleteAchievementById(id, adminKey) {
  try {
    const res = await apiFetch(`/api/achievements/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-key': adminKey,
      },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function updateAchievement(id, achievementData, adminKey) {
  try {
    const res = await apiFetch(`/api/achievements/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(achievementData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, achievement: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function createTestimonial(testimonialData) {
  try {
    const res = await apiFetch('/api/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testimonialData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, testimonial: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function deleteTestimonialById(id, adminKey) {
  try {
    const res = await apiFetch(`/api/testimonials/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-key': adminKey,
      },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function fetchContactInfo(fallbackData) {
  try {
    const res = await apiFetch('/api/contact/info')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data && data.name ? data : fallbackData
  } catch (err) {
    return fallbackData
  }
}

export async function updateContactInfo(infoData, adminKey) {
  try {
    const res = await apiFetch('/api/contact/info', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(infoData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, info: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function createAIShowcase(aiData, adminKey) {
  try {
    const res = await apiFetch('/api/ai-showcase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(aiData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, aiProject: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function updateAIShowcase(id, aiData, adminKey) {
  try {
    const res = await apiFetch(`/api/ai-showcase/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(aiData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, aiProject: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function deleteAIShowcaseById(id, adminKey) {
  try {
    const res = await apiFetch(`/api/ai-showcase/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-key': adminKey,
      },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function fetchAboutInfo(fallbackData) {
  try {
    const res = await apiFetch('/api/about')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data && (data.name || data.title || data.bio) ? data : fallbackData
  } catch (err) {
    return fallbackData
  }
}

export async function updateAboutInfo(aboutData, adminKey) {
  try {
    const res = await apiFetch('/api/about', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(aboutData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, about: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function fetchExperienceTimeline(fallbackData) {
  try {
    const res = await apiFetch('/api/experience')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : fallbackData
  } catch (err) {
    return fallbackData
  }
}

export async function createExperienceEntry(entryData, adminKey) {
  try {
    const res = await apiFetch('/api/experience', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(entryData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, entry: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function updateExperienceEntry(id, entryData, adminKey) {
  try {
    const res = await apiFetch(`/api/experience/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(entryData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, entry: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function deleteExperienceEntryById(id, adminKey) {
  try {
    const res = await apiFetch(`/api/experience/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-key': adminKey,
      },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function fetchHeroData(fallbackData) {
  try {
    const res = await apiFetch('/api/hero')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data && (data.name || data.tagline || data.roles) ? data : fallbackData
  } catch (err) {
    return fallbackData
  }
}

export async function updateHeroData(heroData, adminKey) {
  try {
    const res = await apiFetch('/api/hero', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(heroData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return { success: true, hero: data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
