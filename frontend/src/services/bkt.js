class BayesianKnowledgeTracing {
  constructor() {
    this.params = {
      pL0: 0.1,
      pT: 0.3,
      pG: 0.2,
      pS: 0.1
    }
  }

  updateKnowledge(currentMastery, isCorrect) {
    const { pG, pS } = this.params
    
    if (isCorrect) {
      const numerator = currentMastery * (1 - pS)
      const denominator = numerator + (1 - currentMastery) * pG
      return numerator / denominator
    } else {
      const numerator = currentMastery * pS
      const denominator = numerator + (1 - currentMastery) * (1 - pG)
      return numerator / denominator
    }
  }

  applyLearning(mastery) {
    return mastery + (1 - mastery) * this.params.pT
  }

  getMasteryLevel(interactions) {
    let mastery = this.params.pL0
    
    interactions.forEach(interaction => {
      mastery = this.updateKnowledge(mastery, interaction.correct)
      mastery = this.applyLearning(mastery)
    })
    
    return Math.min(mastery, 1)
  }

  recommendNextContent(competencyGraph, masteryLevels) {
    const candidates = competencyGraph.nodes.filter(node => {
      const hasMastery = masteryLevels[node.id] > 0.95
      const prerequisitesMet = node.prerequisites.every(
        prereq => masteryLevels[prereq] > 0.8
      )
      return !hasMastery && prerequisitesMet
    })
    
    return candidates.sort((a, b) => 
      masteryLevels[a.id] - masteryLevels[b.id]
    )[0]
  }
}

export default new BayesianKnowledgeTracing()
