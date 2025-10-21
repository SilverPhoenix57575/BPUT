import { useState, useEffect } from 'react'
import { Briefcase, TrendingUp, ExternalLink, Target, Award, AlertCircle } from 'lucide-react'
import axios from 'axios'
import useUserStore from '../../stores/userStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function CareerMapping() {
  const { user } = useUserStore()
  const [recommendations, setRecommendations] = useState([])
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [skillsGap, setSkillsGap] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [user])

  const loadRecommendations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/career/recommendations?user_id=${user.id}`)
      setRecommendations(res.data.recommendations)
    } catch (err) {
      console.error('Failed to load recommendations:', err)
    } finally {
      setLoading(false)
    }
  }

  const selectCareer = async (career) => {
    setSelectedCareer(career)
    try {
      const [gapRes, jobsRes] = await Promise.all([
        axios.get(`${API_URL}/api/career/skills-gap?user_id=${user.id}&career=${career.title}`),
        axios.get(`${API_URL}/api/career/jobs?skills=${career.skills.join(',')}`)
      ])
      setSkillsGap(gapRes.data.skillsGap)
      setJobs(jobsRes.data.jobs)
    } catch (err) {
      console.error('Failed to load career details:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Career Mapping
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Discover careers that match your skills and see what you need to learn next
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Recommended Careers
          </h2>
          <div className="space-y-3">
            {recommendations.map((career, idx) => (
              <button
                key={idx}
                onClick={() => selectCareer(career)}
                className="w-full text-left p-4 rounded-xl transition-all"
                style={{
                  backgroundColor: selectedCareer?.title === career.title ? 'var(--color-accent-blue)' : 'var(--color-bg-primary)',
                  borderWidth: '1px',
                  borderColor: 'var(--color-border-primary)',
                  color: selectedCareer?.title === career.title ? '#ffffff' : 'var(--color-text-primary)'
                }}
              >
                <div className="flex items-start gap-3">
                  <Briefcase size={20} className="mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{career.title}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={selectedCareer?.title === career.title ? 'text-white/80' : 'text-green-600'}>
                        {career.match}% match
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedCareer ? (
            <div className="space-y-6">
              <div className="p-6 rounded-xl" style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderWidth: '1px',
                borderColor: 'var(--color-border-primary)'
              }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
                    <Briefcase className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                      {selectedCareer.title}
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                      {selectedCareer.description}
                    </p>
                  </div>
                </div>
              </div>

              {skillsGap && (
                <div className="p-6 rounded-xl" style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderWidth: '1px',
                  borderColor: 'var(--color-border-primary)'
                }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Target size={20} style={{ color: 'var(--color-accent-blue)' }} />
                    <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      Skills Gap Analysis
                    </h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        Overall Progress
                      </span>
                      <span className="text-sm font-bold" style={{ color: 'var(--color-accent-blue)' }}>
                        {skillsGap.completion}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all"
                        style={{ width: `${skillsGap.completion}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Award size={16} className="text-green-600" />
                        <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                          You Have ({skillsGap.mastered.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {skillsGap.mastered.map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-600" />
                            <span style={{ color: 'var(--color-text-secondary)' }}>{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle size={16} className="text-orange-600" />
                        <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                          You Need ({skillsGap.missing.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {skillsGap.missing.map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-orange-600" />
                            <span style={{ color: 'var(--color-text-secondary)' }}>{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {jobs.length > 0 && (
                <div className="p-6 rounded-xl" style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderWidth: '1px',
                  borderColor: 'var(--color-border-primary)'
                }}>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={20} style={{ color: 'var(--color-accent-blue)' }} />
                    <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      Job Opportunities
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {jobs.map((job, idx) => (
                      <a
                        key={idx}
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-lg transition-all hover:shadow-md"
                        style={{
                          backgroundColor: 'var(--color-bg-secondary)',
                          borderWidth: '1px',
                          borderColor: 'var(--color-border-primary)'
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                              {job.title}
                            </h4>
                            <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                              {job.company} • {job.location}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.slice(0, 3).map((skill, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 rounded"
                                  style={{
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    color: 'var(--color-text-secondary)'
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <ExternalLink size={16} style={{ color: 'var(--color-text-secondary)' }} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-12 rounded-xl" style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderWidth: '1px',
              borderColor: 'var(--color-border-primary)'
            }}>
              <div className="text-center">
                <Briefcase size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-secondary)' }} />
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Select a career to see detailed information
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
