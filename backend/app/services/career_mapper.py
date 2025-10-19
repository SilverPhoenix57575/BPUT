class CareerMapper:
    def __init__(self):
        self.career_skills = {
            "Software Developer": {
                "required_competencies": ["cs_001", "cs_002", "cs_003", "cs_004", "cs_005"],
                "salary_range": "$70,000 - $120,000",
                "job_outlook": "Excellent (22% growth)"
            },
            "Data Scientist": {
                "required_competencies": ["cs_001", "cs_005", "cs_012", "cs_018"],
                "salary_range": "$85,000 - $150,000",
                "job_outlook": "Very Good (15% growth)"
            },
            "Web Developer": {
                "required_competencies": ["cs_001", "cs_002", "cs_003", "cs_008"],
                "salary_range": "$55,000 - $95,000",
                "job_outlook": "Good (13% growth)"
            },
            "DevOps Engineer": {
                "required_competencies": ["cs_001", "cs_002", "cs_010", "cs_015"],
                "salary_range": "$80,000 - $130,000",
                "job_outlook": "Excellent (20% growth)"
            }
        }
    
    def get_career_recommendations(self, mastered_competencies: list) -> list:
        recommendations = []
        mastered_set = set(mastered_competencies)
        
        for career, details in self.career_skills.items():
            required = set(details["required_competencies"])
            match_percentage = len(required & mastered_set) / len(required) * 100 if required else 0
            missing = required - mastered_set
            
            recommendations.append({
                "career": career,
                "match": round(match_percentage, 1),
                "salary": details["salary_range"],
                "outlook": details["job_outlook"],
                "skillsNeeded": len(missing),
                "nextSkills": list(missing)[:3]
            })
        
        return sorted(recommendations, key=lambda x: x["match"], reverse=True)
    
    def get_skills_gap(self, career: str, mastered_competencies: list) -> dict:
        if career not in self.career_skills:
            return {"error": "Career not found"}
        
        required = set(self.career_skills[career]["required_competencies"])
        mastered = set(mastered_competencies)
        missing = required - mastered
        
        return {
            "career": career,
            "totalRequired": len(required),
            "mastered": len(mastered & required),
            "missing": list(missing),
            "percentComplete": round(len(mastered & required) / len(required) * 100, 1) if required else 0
        }
    
    def get_job_listings(self, skills: list) -> list:
        return [
            {
                "title": "Junior Software Developer",
                "company": "Tech Corp",
                "location": "Remote",
                "salary": "$60,000 - $80,000",
                "matchScore": 85
            },
            {
                "title": "Web Developer",
                "company": "Digital Agency",
                "location": "Hybrid",
                "salary": "$55,000 - $75,000",
                "matchScore": 78
            }
        ]
