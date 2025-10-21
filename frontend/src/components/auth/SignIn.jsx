import { useState } from 'react'
import { Mail, Lock, Brain, Sparkles, AlertCircle } from 'lucide-react'

export default function SignIn({ onSignIn, onSwitchToSignUp, loading, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSignIn({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-2xl mb-4">
            <Brain className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Sign in to continue your learning journey</p>
        </div>

        <div className="rounded-2xl shadow-xl p-8" style={{ 
          backgroundColor: 'var(--color-bg-primary)', 
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignUp}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <Sparkles size={16} />
            <span>Offline-first • Privacy-first • Student-first</span>
          </div>
        </div>

        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForgotPassword(false)}>
            <div className="rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4" style={{
              backgroundColor: 'var(--color-bg-primary)'
            }} onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Reset Password
              </h2>
              {!resetSent ? (
                <>
                  <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                    Enter your email and we'll send you a reset link.
                  </p>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl mb-4"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderColor: 'var(--color-border-primary)',
                      borderWidth: '1px',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1 px-4 py-3 rounded-xl font-medium"
                      style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { setResetSent(true); setTimeout(() => { setShowForgotPassword(false); setResetSent(false); setResetEmail('') }, 3000) }}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium"
                    >
                      Send Link
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="text-6xl mb-4">✉️</div>
                  <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Check your email!</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Reset link sent to {resetEmail}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
