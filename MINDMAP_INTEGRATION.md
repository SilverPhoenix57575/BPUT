# 🧠 Mind Map Integration - Setup Guide

## ✅ What's Been Added

### New Components
1. **MermaidBlock** (`components/hub/diagrams/MermaidBlock.jsx`) - Renders Mermaid diagrams
2. **ConceptNode** (`components/hub/graph/ConceptNode.jsx`) - Interactive graph nodes with notes
3. **KnowledgeGraph** (`components/hub/graph/KnowledgeGraph.jsx`) - Full interactive graph with zoom/pan
4. **graphStore** (`stores/graphStore.js`) - State management for knowledge graph

### Updated Components
- **MindMapCreator** - Now has 2 view modes:
  - 🌳 **Tree View** - Original static visualization
  - 🔗 **Interactive Graph** - Draggable nodes with zoom/pan controls

### New Dependencies
- `mermaid` - Diagram rendering
- `reactflow` - Interactive graph library

---

## 🚀 Installation

Run this command in the `frontend` directory:

```bash
npm install
```

This will install the new dependencies: `mermaid` and `reactflow`.

---

## 🎯 Features

### Interactive Graph View
- ✅ **Drag & Drop** - Move nodes around
- ✅ **Zoom & Pan** - Navigate large graphs
- ✅ **Lock/Unlock** - Freeze node positions
- ✅ **Notes** - Add personal notes to each concept
- ✅ **Progress Tracking** - Mark concepts as mastered
- ✅ **Export** - Download graph as JSON
- ✅ **MiniMap** - Overview of entire graph
- ✅ **Auto-layout** - Circular arrangement from center

### Mermaid Diagrams
- Supports all Mermaid diagram types
- Auto-detects diagram code
- Renders in markdown code blocks

---

## 📖 Usage

1. **Generate a Mind Map**
   - Enter a topic (e.g., "Data Structures")
   - Click "Generate"

2. **Switch Views**
   - Click "Tree View" for static visualization
   - Click "Interactive Graph" for draggable nodes

3. **Interact with Nodes**
   - Drag nodes to reposition
   - Click note icon to add personal notes
   - Click expand icon to see descriptions
   - Lock graph to prevent accidental moves

4. **Export**
   - Click download icon to save as JSON

---

## 🎨 How It Works

When you generate a mind map:
1. API returns hierarchical data (central topic + branches)
2. Data is displayed in Tree View by default
3. Data is converted to graph nodes with circular layout
4. Switch to Interactive Graph to see draggable version
5. All changes persist in browser storage

---

## 🔧 Customization

### Change Layout
Edit `convertToGraphNodes()` in `MindMapCreator.jsx`:
```javascript
const angle = (idx * 2 * Math.PI) / mapData.data.branches.length
const radius = 250 // Adjust spacing
```

### Change Colors
Edit node colors in `ConceptNode.jsx`:
```javascript
data.mastered ? 'border-green-500 bg-green-50' : 'border-gray-300'
```

### Add More Node Types
Create new node components in `components/hub/graph/` and register in `nodeTypes`.

---

## 🐛 Troubleshooting

**Graph not showing?**
- Check browser console for errors
- Ensure `npm install` completed successfully
- Clear browser cache and reload

**Nodes overlapping?**
- Adjust `radius` in `convertToGraphNodes()`
- Use lock/unlock to manually arrange
- Increase container height in MindMapCreator

**Mermaid not rendering?**
- Check diagram syntax
- Ensure content starts with diagram type (e.g., `graph TD`)

---

## 📚 Next Steps

- Add more node types (images, videos, links)
- Implement collaborative editing
- Add AI-powered auto-layout
- Export to PNG/SVG
- Import from external sources

---

**Made with ❤️ for BPUT Hackathon**
