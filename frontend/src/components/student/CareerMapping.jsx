import { useState, useEffect } from 'react'
import { Briefcase, TrendingUp, ExternalLink, Target, Award, AlertCircle, DollarSign, TrendingUp as Growth, BookOpen, Rocket } from 'lucide-react'
import axios from 'axios'
import useUserStore from '../../stores/userStore'
import useProgressStore from '../../stores/progressStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function CareerCard({ career, label }) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderWidth: '1px',
        borderColor: 'var(--color-border-primary)'
      }}>
        <div className="text-xs font-medium mb-2" style={{ color: 'var(--color-accent-blue)' }}>
          {label}
        </div>
        <div className="flex items-start gap-3 mb-3">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
            <Briefcase className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              {career.title}
            </h3>
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              {career.description}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'var(--color-text-secondary)' }}>Match Score</span>
            <span className="font-bold" style={{ color: 'var(--color-accent-blue)' }}>{career.match}%</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'var(--color-text-secondary)' }}>Salary Range</span>
            <span className="font-medium text-green-600">{career.salary || career.avgSalary}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'var(--color-text-secondary)' }}>Growth</span>
            <span className="font-medium text-blue-600">{career.growth}</span>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Key Skills</div>
            <div className="flex flex-wrap gap-2">
              {(career.skills || career.requiredSkills || []).slice(0, 5).map((skill, idx) => (
                <span
                  key={idx}
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
        </div>
      </div>
    </div>
  )
}

export default function CareerMapping() {
  const { user } = useUserStore()
  const { masteryLevels } = useProgressStore()
  const [recommendations, setRecommendations] = useState([])
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [skillsGap, setSkillsGap] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [compareCareer, setCompareCareer] = useState(null)

  useEffect(() => {
    loadRecommendations()
  }, [user])

  const loadRecommendations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/career/recommendations?user_id=${user.id}`)
      const careers = res.data.recommendations
      setRecommendations(careers)
      if (careers.length > 0) {
        selectCareer(careers[0])
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err)
      // Load from local JSON as fallback
      try {
        const localRes = await fetch('/careers.json')
        const careers = await localRes.json()
        
        // Calculate match based on user's mastery levels
        const masteredCompetencies = Object.keys(masteryLevels).filter(k => masteryLevels[k] >= 0.95)
        const careersWithMatch = careers.map(career => {
          const match = career.competencies ? 
            (career.competencies.filter(c => masteredCompetencies.includes(c)).length / career.competencies.length * 100) : 50
          return { ...career, match: Math.round(match) }
        }).sort((a, b) => b.match - a.match)
        
        setRecommendations(careersWithMatch)
        if (careersWithMatch.length > 0) {
          selectCareer(careersWithMatch[0])
        }
      } catch (localErr) {
        console.error('Failed to load local careers:', localErr)
      }
    } finally {
      setLoading(false)
    }
  }

  const selectCareer = async (career) => {
    setSelectedCareer(career)
    setLoadingDetails(true)
    
    try {
      const [gapRes, jobsRes] = await Promise.all([
        axios.get(`${API_URL}/api/career/skills-gap?user_id=${user.id}&career=${career.title}`),
        axios.get(`${API_URL}/api/career/jobs?skills=${career.skills?.join(',') || ''}`)
      ])
      setSkillsGap(gapRes.data.skillsGap)
      setJobs(jobsRes.data.jobs)
    } catch (err) {
      console.error('Failed to load career details:', err)
      
      // Calculate skill gap based on match percentage
      const matchRatio = (career.match || 50) / 100
      const totalSkills = career.requiredSkills || career.skills || []
      const masteredCount = Math.floor(totalSkills.length * matchRatio)
      
      setSkillsGap({
        completion: career.match || 50,
        mastered: totalSkills.slice(0, masteredCount),
        missing: totalSkills.slice(masteredCount)
      })
      
      // Generate mock job listings
      setJobs([
        {
          title: `Senior ${career.title}`,
          company: 'Tech Giants Inc',
          location: 'Remote',
          url: '#',
          skills: totalSkills.slice(0, 5)
        },
        {
          title: `${career.title}`,
          company: 'Innovation Labs',
          location: 'Hybrid',
          url: '#',
          skills: totalSkills.slice(0, 4)
        },
        {
          title: `Junior ${career.title}`,
          company: 'StartUp Ventures',
          location: 'On-site',
          url: '#',
          skills: totalSkills.slice(0, 3)
        }
      ])
    } finally {
      setLoadingDetails(false)
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Career Mapping
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Discover careers that match your skills and see what you need to learn next
          </p>
        </div>
        {selectedCareer && (
          <button
            onClick={() => setCompareMode(!compareMode)}
            className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
            style={{
              backgroundColor: compareMode ? 'var(--color-accent-blue)' : 'var(--color-bg-primary)',
              color: compareMode ? '#ffffff' : 'var(--color-text-primary)',
              borderWidth: '1px',
              borderColor: 'var(--color-border-primary)'
            }}
          >
            <Target size={18} />
            {compareMode ? 'Exit Compare' : 'Compare Careers'}
          </button>
        )}
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
                onClick={() => compareMode ? setCompareCareer(career) : selectCareer(career)}
                className="w-full text-left p-4 rounded-xl transition-all relative"
                style={{
                  backgroundColor: selectedCareer?.title === career.title || compareCareer?.title === career.title 
                    ? 'var(--color-accent-blue)' : 'var(--color-bg-primary)',
                  borderWidth: '1px',
                  borderColor: 'var(--color-border-primary)',
                  color: selectedCareer?.title === career.title || compareCareer?.title === career.title 
                    ? '#ffffff' : 'var(--color-text-primary)'
                }}
              >
                {compareMode && compareCareer?.title === career.title && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    Comparing
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Briefcase size={20} className="mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{career.title}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={selectedCareer?.title === career.title || compareCareer?.title === career.title ? 'text-white/80' : 'text-green-600'}>
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
          {compareMode && compareCareer ? (
            <div className="grid md:grid-cols-2 gap-4">
              <CareerCard career={selectedCareer} label="Current Selection" />
              <CareerCard career={compareCareer} label="Comparing With" />
            </div>
          ) : selectedCareer ? (
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
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                      {selectedCareer.title}
                    </h2>
                    <p className="mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                      {selectedCareer.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600" />
                        <span style={{ color: 'var(--color-text-secondary)' }}>
                          {selectedCareer.salary || selectedCareer.avgSalary}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Growth size={16} className="text-blue-600" />
                        <span style={{ color: 'var(--color-text-secondary)' }}>
                          {selectedCareer.growth}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {loadingDetails ? (
                <div className="flex items-center justify-center p-12 rounded-xl" style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderWidth: '1px',
                  borderColor: 'var(--color-border-primary)'
                }}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : skillsGap && (
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
                        {skillsGap.mastered.length > 0 ? (
                          skillsGap.mastered.map((skill, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 rounded-full bg-green-600" />
                              <span style={{ color: 'var(--color-text-secondary)' }}>{skill}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Start learning to build your skills!</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle size={16} className="text-orange-600" />
                        <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                          Learning Roadmap ({skillsGap.missing.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {skillsGap.missing.length > 0 ? (
                          skillsGap.missing.map((skill, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 text-sm p-2 rounded" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-600" />
                                <span style={{ color: 'var(--color-text-secondary)' }}>{skill}</span>
                              </div>
                              <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--color-accent-blue)', color: '#ffffff' }}>
                                Priority {idx + 1}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-green-600">🎉 You have all required skills!</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {skillsGap.missing.length > 0 && (
                    <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                            Ready to start learning?
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            Begin with {skillsGap.missing[0]} to advance your career
                          </p>
                        </div>
                        <button
                          onClick={() => window.location.hash = '#hub'}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                          style={{ backgroundColor: 'var(--color-accent-blue)', color: '#ffffff' }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          <Rocket size={18} />
                          Start Learning
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!loadingDetails && jobs.length > 0 && (
                <div className="p-6 rounded-xl" style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderWidth: '1px',
                  borderColor: 'var(--color-border-primary)'
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={20} style={{ color: 'var(--color-accent-blue)' }} />
                      <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        Job Opportunities
                      </h3>
                    </div>
                    <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>
                      {jobs.length} positions
                    </span>
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
