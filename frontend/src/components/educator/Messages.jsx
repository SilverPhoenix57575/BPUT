import { useState } from 'react'
import { Inbox, Send, Mail, Clock } from 'lucide-react'

export default function Messages() {
  const [activeTab, setActiveTab] = useState('inbox')
  const [selectedMessage, setSelectedMessage] = useState(null)

  const messages = [
    { id: 1, from: 'Aisha Khan', subject: 'Help Needed', preview: 'I need help with Chapter 5...', time: '10 mins ago', read: false },
    { id: 2, from: 'Rahul Sharma', subject: 'Quiz Question', preview: 'Can you explain question 3...', time: '1 hour ago', read: false },
    { id: 3, from: 'Priya Patel', subject: 'Assignment Submission', preview: 'I submitted my assignment...', time: '2 hours ago', read: true },
    { id: 4, from: 'Arjun Singh', subject: 'Doubt in Homework', preview: 'I have a doubt in problem 7...', time: '1 day ago', read: true }
  ]

  if (selectedMessage) {
    return (
      <div className="max-w-4xl mx-auto px-6">
        <button onClick={() => setSelectedMessage(null)} className="mb-6 text-blue-600 hover:underline">
          ← Back to Inbox
        </button>

        <div className="rounded-2xl p-6 shadow-lg" style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          borderWidth: '1px'
        }}>
          <div className="border-b pb-4 mb-4" style={{ borderColor: 'var(--color-border-primary)' }}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{selectedMessage.subject}</h2>
            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <span>From: {selectedMessage.from}</span>
              <span>•</span>
              <span>{selectedMessage.time}</span>
            </div>
          </div>

          <div className="mb-6" style={{ color: 'var(--color-text-primary)' }}>
            <p>Dear Teacher,</p>
            <p className="mt-4">{selectedMessage.preview} I would really appreciate your guidance on this topic. Could you please help me understand the concept better?</p>
            <p className="mt-4">Thank you!</p>
            <p className="mt-2">Best regards,<br/>{selectedMessage.from}</p>
          </div>

          <div className="border-t pt-4" style={{ borderColor: 'var(--color-border-primary)' }}>
            <textarea
              placeholder="Type your reply..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl mb-3"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                borderWidth: '1px',
                color: 'var(--color-text-primary)'
              }}
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Send size={18} />
              Send Reply
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Messages</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Communicate with students</p>
      </div>

      <div className="rounded-2xl shadow-lg overflow-hidden" style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-primary)',
        borderWidth: '1px'
      }}>
        <div className="flex border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
          <TabButton label="Inbox" active={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} />
          <TabButton label="Sent" active={activeTab === 'sent'} onClick={() => setActiveTab('sent')} />
          <TabButton label="Compose" active={activeTab === 'compose'} onClick={() => setActiveTab('compose')} />
        </div>

        {activeTab === 'inbox' && (
          <div>
            {messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className="w-full p-4 border-b text-left hover:bg-opacity-50 transition-colors"
                style={{
                  borderColor: 'var(--color-border-primary)',
                  backgroundColor: msg.read ? 'transparent' : 'rgba(59, 130, 246, 0.05)'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className={msg.read ? 'text-gray-400' : 'text-blue-600'} />
                    <span className={`font-semibold ${msg.read ? '' : 'text-blue-600'}`} style={{ color: 'var(--color-text-primary)' }}>
                      {msg.from}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                    <Clock size={14} />
                    {msg.time}
                  </div>
                </div>
                <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>{msg.subject}</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{msg.preview}</p>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'compose' && (
          <div className="p-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="To: Student name or class"
                className="w-full px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  borderWidth: '1px',
                  color: 'var(--color-text-primary)'
                }}
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  borderWidth: '1px',
                  color: 'var(--color-text-primary)'
                }}
              />
              <textarea
                placeholder="Message"
                rows={8}
                className="w-full px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  borderWidth: '1px',
                  color: 'var(--color-text-primary)'
                }}
              />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Send size={18} />
                Send Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-4 font-medium transition-all"
      style={{
        color: active ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)',
        borderBottom: active ? '2px solid var(--color-accent-blue)' : '2px solid transparent'
      }}
    >
      {label}
    </button>
  )
}
