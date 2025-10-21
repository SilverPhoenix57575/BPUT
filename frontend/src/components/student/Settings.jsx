import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Type, HelpCircle, Shield, Bell, Palette, Save } from 'lucide-react'

export default function Settings() {
  const [settings, setSettings] = useState({
    achievementNotifications: true,
    soundEffects: true,
    audioHints: false,
    textSize: 'medium'
  })

  useEffect(() => {
    const saved = localStorage.getItem('appSettings')
    if (saved) setSettings(JSON.parse(saved))
  }, [])

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
    alert('Settings saved successfully!')
  }

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const setTextSize = (size) => {
    setSettings(prev => ({ ...prev, textSize: size }))
    document.documentElement.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px'
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Settings ⚙️
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Customize your learning experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Sound Controls */}
        <SettingsSection
          icon={Volume2}
          title="Sound Controls"
          description="Manage audio notifications and effects"
        >
          <ToggleItem
            label="Achievement Notifications"
            description="Play sound when you earn achievements"
            checked={settings.achievementNotifications}
            onChange={() => toggleSetting('achievementNotifications')}
          />
          <ToggleItem
            label="Sound Effects"
            description="Enable UI sound effects"
            checked={settings.soundEffects}
            onChange={() => toggleSetting('soundEffects')}
          />
          <ToggleItem
            label="Audio Hints"
            description="Hear audio hints during quizzes"
            checked={settings.audioHints}
            onChange={() => toggleSetting('audioHints')}
          />
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection
          icon={Palette}
          title="Appearance"
          description="Adjust visual preferences"
        >
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-primary)' }}>
                Text Size
              </span>
              <div className="flex gap-3">
                <TextSizeButton
                  label="Small"
                  active={settings.textSize === 'small'}
                  onClick={() => setTextSize('small')}
                />
                <TextSizeButton
                  label="Medium"
                  active={settings.textSize === 'medium'}
                  onClick={() => setTextSize('medium')}
                />
                <TextSizeButton
                  label="Large"
                  active={settings.textSize === 'large'}
                  onClick={() => setTextSize('large')}
                />
              </div>
            </label>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Control what notifications you receive"
        >
          <ToggleItem
            label="Daily Reminders"
            description="Get reminded to study every day"
            checked={true}
            onChange={() => {}}
          />
          <ToggleItem
            label="Streak Alerts"
            description="Notify when your streak is at risk"
            checked={true}
            onChange={() => {}}
          />
          <ToggleItem
            label="Achievement Unlocks"
            description="Get notified when you earn badges"
            checked={true}
            onChange={() => {}}
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection
          icon={HelpCircle}
          title="Support"
          description="Get help and learn more"
        >
          <LinkItem
            label="Help Center"
            description="Browse FAQs and tutorials"
            onClick={() => window.open('https://help.example.com', '_blank')}
          />
          <LinkItem
            label="Contact Support"
            description="Get in touch with our team"
            onClick={() => window.open('mailto:support@example.com')}
          />
          <LinkItem
            label="Report a Bug"
            description="Help us improve the app"
            onClick={() => window.open('https://github.com/example/issues', '_blank')}
          />
        </SettingsSection>

        {/* Privacy & Legal */}
        <SettingsSection
          icon={Shield}
          title="Privacy & Legal"
          description="Review our policies"
        >
          <LinkItem
            label="Privacy Policy"
            description="How we handle your data"
            onClick={() => window.open('/privacy', '_blank')}
          />
          <LinkItem
            label="Terms of Service"
            description="Our terms and conditions"
            onClick={() => window.open('/terms', '_blank')}
          />
          <LinkItem
            label="Data & Privacy Settings"
            description="Manage your data preferences"
            onClick={() => alert('Data settings coming soon')}
          />
        </SettingsSection>

        {/* Save Button */}
        <div className="pt-6">
          <button
            onClick={saveSettings}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
          <Icon className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

function ToggleItem({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

function TextSizeButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
        active ? 'bg-blue-600 text-white' : ''
      }`}
      style={!active ? {
        backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text-secondary)'
      } : {}}
    >
      {label}
    </button>
  )
}

function LinkItem({ label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
    </button>
  )
}
