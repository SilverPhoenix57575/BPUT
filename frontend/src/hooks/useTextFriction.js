import { useEffect, useRef } from 'react'
import { useMetricsStore } from '../stores/cognitiveStore'

export const useTextFriction = (inputValue) => {
  const prevValue = useRef('')
  const rephraseCount = useRef(0)
  const backspaceCount = useRef(0)
  const lastUpdateTime = useRef(Date.now())
  const { setTextFriction, setFrictionIntensity } = useMetricsStore()

  useEffect(() => {
    const prev = prevValue.current
    const curr = inputValue || ''
    const now = Date.now()

    // Track backspaces
    if (curr.length < prev.length) {
      const deleted = prev.length - curr.length
      backspaceCount.current += deleted
      setFrictionIntensity(Math.min(1, backspaceCount.current / 30))
      setTextFriction(rephraseCount.current, backspaceCount.current)
    }

    // Track rephrases (significant changes in short time)
    if (curr.length > 10 && prev.length > 10 && now - lastUpdateTime.current < 5000) {
      const similarity = calculateSimilarity(prev, curr)
      if (similarity < 0.6 && Math.abs(curr.length - prev.length) > 5) {
        rephraseCount.current += 1
        setFrictionIntensity(Math.min(1, (rephraseCount.current * 0.3 + backspaceCount.current / 30)))
        setTextFriction(rephraseCount.current, backspaceCount.current)
      }
    }

    // Update only if there's actual change
    if (curr !== prev) {
      setTextFriction(rephraseCount.current, backspaceCount.current)
    }

    prevValue.current = curr
    lastUpdateTime.current = now
  }, [inputValue])

  const reset = () => {
    rephraseCount.current = 0
    backspaceCount.current = 0
    prevValue.current = ''
    setTextFriction(0, 0)
    setFrictionIntensity(0)
  }

  return { reset }
}

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  if (longer.length === 0) return 1.0
  return (longer.length - editDistance(longer, shorter)) / longer.length
}

function editDistance(str1, str2) {
  const matrix = []
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[str2.length][str1.length]
}
