import { useState } from 'react'
import { Mail, Lock, User, Brain, GraduationCap, BookOpen, AlertCircle } from 'lucide-react'

export default function SignUp({ onSignUp, onSwitchToSignIn, loading, error }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSignUp(formData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-2xl mb-4">
            <Brain className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Join AI Learning
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Start your personalized learning journey today</p>
        </div>

        <div className="rounded-2xl shadow-xl p-8" style={{ 
          backgroundColor: 'var(--color-bg-primary)', 
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    borderWidth: '1px',
                    color: 'var(--color-text-primary)'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    borderWidth: '1px',
                    color: 'var(--color-text-primary)'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    borderWidth: '1px',
                    color: 'var(--color-text-primary)'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'student'})}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'student'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <GraduationCap className={`mx-auto mb-2 ${formData.role === 'student' ? 'text-blue-600' : 'text-gray-400'}`} size={24} />
                  <span className={`text-sm font-semibold ${formData.role === 'student' ? 'text-blue-600' : 'text-gray-600'}`}>
                    Student
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'educator'})}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'educator'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <BookOpen className={`mx-auto mb-2 ${formData.role === 'educator' ? 'text-purple-600' : 'text-gray-400'}`} size={24} />
                  <span className={`text-sm font-semibold ${formData.role === 'educator' ? 'text-purple-600' : 'text-gray-600'}`}>
                    Educator
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Already have an account?{' '}
              <button
                onClick={onSwitchToSignIn}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
