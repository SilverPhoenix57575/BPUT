import { useEffect, useRef } from 'react'

const extractMermaidCode = (content) => {
  const codeBlockMatch = content.match(/```mermaid\s*([\s\S]*?)```/)
  if (codeBlockMatch) return codeBlockMatch[1].trim()
  
  const trimmed = content.trim()
  const diagramTypes = ['graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram', 'gantt', 'pie', 'journey', 'gitGraph', 'mindmap']
  
  for (const type of diagramTypes) {
    if (trimmed.startsWith(type)) return trimmed
  }
  
  return ''
}

export const MermaidBlock = ({ content }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    let isActive = true
    const renderDiagram = async () => {
      try {
        const diagramCode = extractMermaidCode(content)
        
        if (!diagramCode) {
          if (isActive && containerRef.current) {
            containerRef.current.innerHTML = '<p class="text-sm text-gray-500">No diagram code detected</p>'
          }
          return
        }

        const mermaidModule = await import('mermaid')
        const mermaid = mermaidModule.default ?? mermaidModule

        mermaid.initialize({ startOnLoad: false, theme: 'default' })
        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, diagramCode)
        if (isActive && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error)
        if (isActive && containerRef.current) {
          containerRef.current.innerHTML = '<p class="text-sm text-gray-500">Error rendering diagram</p>'
        }
      }
    }

    if (containerRef.current) renderDiagram()

    return () => { isActive = false }
  }, [content])

  return (
    <div className="my-4 p-4 bg-gray-50 rounded-xl overflow-x-auto">
      <div ref={containerRef} className="mermaid-container" />
    </div>
  )
}
