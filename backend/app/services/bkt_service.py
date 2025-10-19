class BKTService:
    def __init__(self):
        self.params = {
            "pL0": 0.1,
            "pT": 0.3,
            "pG": 0.2,
            "pS": 0.1
        }
    
    def update_knowledge(self, current_mastery: float, is_correct: bool) -> float:
        pL0, pT, pG, pS = self.params["pL0"], self.params["pT"], self.params["pG"], self.params["pS"]
        
        if is_correct:
            numerator = current_mastery * (1 - pS)
            denominator = numerator + (1 - current_mastery) * pG
            return numerator / denominator if denominator > 0 else current_mastery
        else:
            numerator = current_mastery * pS
            denominator = numerator + (1 - current_mastery) * (1 - pG)
            return numerator / denominator if denominator > 0 else current_mastery
    
    def apply_learning(self, mastery: float) -> float:
        return mastery + (1 - mastery) * self.params["pT"]
    
    def get_mastery_level(self, interactions: list) -> float:
        mastery = self.params["pL0"]
        
        for interaction in interactions:
            mastery = self.update_knowledge(mastery, interaction.get("correct", False))
            mastery = self.apply_learning(mastery)
        
        return min(mastery, 1.0)
    
    def recommend_next_content(self, competency_graph: dict, mastery_levels: dict) -> dict:
        candidates = []
        
        for node in competency_graph.get("nodes", []):
            node_id = node["id"]
            has_mastery = mastery_levels.get(node_id, 0) > 0.95
            prerequisites_met = all(
                mastery_levels.get(prereq, 0) > 0.8
                for prereq in node.get("prerequisites", [])
            )
            
            if not has_mastery and prerequisites_met:
                candidates.append({
                    "id": node_id,
                    "mastery": mastery_levels.get(node_id, 0),
                    "name": node.get("name", "")
                })
        
        if candidates:
            return min(candidates, key=lambda x: x["mastery"])
        
        return None
