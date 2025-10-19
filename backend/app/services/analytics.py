class AnalyticsService:
    def calculate_overall_progress(self, mastery_levels: dict) -> float:
        if not mastery_levels:
            return 0.0
        return sum(mastery_levels.values()) / len(mastery_levels)
    
    def get_competency_distribution(self, mastery_levels: dict) -> dict:
        distribution = {
            "beginner": 0,
            "intermediate": 0,
            "advanced": 0,
            "mastered": 0
        }
        
        for level in mastery_levels.values():
            if level < 0.3:
                distribution["beginner"] += 1
            elif level < 0.6:
                distribution["intermediate"] += 1
            elif level < 0.95:
                distribution["advanced"] += 1
            else:
                distribution["mastered"] += 1
        
        return distribution
    
    def get_learning_velocity(self, interactions: list) -> float:
        if len(interactions) < 2:
            return 0.0
        
        improvements = 0
        for i in range(1, len(interactions)):
            if interactions[i].get("correct") and not interactions[i-1].get("correct"):
                improvements += 1
        
        return improvements / len(interactions)
    
    def identify_struggling_areas(self, mastery_levels: dict, threshold: float = 0.4) -> list:
        return [
            {"competency": comp_id, "mastery": level}
            for comp_id, level in mastery_levels.items()
            if level < threshold
        ]
