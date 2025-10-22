class CareerMapper:
    def __init__(self):
        self.career_skills = {
            "Frontend Developer": {
                "required_competencies": ["cs_001", "cs_002", "cs_003", "cs_008"],
                "skills": ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design", "REST APIs"],
                "salary_range": "$75,000 - $120,000",
                "job_outlook": "16% (Faster than average)",
                "description": "Build user-facing web applications with modern frameworks and responsive design"
            },
            "Backend Developer": {
                "required_competencies": ["cs_001", "cs_002", "cs_004", "cs_005", "cs_010"],
                "skills": ["Python", "Node.js", "SQL", "REST APIs", "Authentication", "Git", "Docker"],
                "salary_range": "$85,000 - $140,000",
                "job_outlook": "22% (Much faster than average)",
                "description": "Design and maintain server-side logic, databases, and APIs"
            },
            "Full Stack Developer": {
                "required_competencies": ["cs_001", "cs_002", "cs_003", "cs_004", "cs_005", "cs_008", "cs_010"],
                "skills": ["JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs", "Docker", "AWS"],
                "salary_range": "$90,000 - $150,000",
                "job_outlook": "22% (Much faster than average)",
                "description": "Work on both frontend and backend to build complete web applications"
            },
            "Data Scientist": {
                "required_competencies": ["cs_001", "cs_005", "cs_012", "cs_018"],
                "skills": ["Python", "R", "SQL", "Machine Learning", "Statistics", "Data Visualization", "Pandas"],
                "salary_range": "$100,000 - $160,000",
                "job_outlook": "36% (Much faster than average)",
                "description": "Analyze complex data to drive business decisions using ML and statistics"
            },
            "DevOps Engineer": {
                "required_competencies": ["cs_001", "cs_002", "cs_010", "cs_015"],
                "skills": ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Git", "Python", "Terraform"],
                "salary_range": "$95,000 - $145,000",
                "job_outlook": "20% (Much faster than average)",
                "description": "Automate deployment pipelines and manage cloud infrastructure"
            },
            "Mobile Developer": {
                "required_competencies": ["cs_001", "cs_002", "cs_003", "cs_008"],
                "skills": ["React Native", "Flutter", "Swift", "Kotlin", "REST APIs", "Git", "Mobile UI/UX"],
                "salary_range": "$80,000 - $135,000",
                "job_outlook": "19% (Much faster than average)",
                "description": "Create native or cross-platform mobile applications for iOS and Android"
            },
            "Machine Learning Engineer": {
                "required_competencies": ["cs_001", "cs_005", "cs_012", "cs_018"],
                "skills": ["Python", "TensorFlow", "PyTorch", "ML Algorithms", "Deep Learning", "SQL", "Docker"],
                "salary_range": "$110,000 - $180,000",
                "job_outlook": "40% (Much faster than average)",
                "description": "Build and deploy ML models to solve real-world problems"
            },
            "Cloud Architect": {
                "required_competencies": ["cs_001", "cs_010", "cs_015", "cs_016"],
                "skills": ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "Networking", "Security"],
                "salary_range": "$120,000 - $190,000",
                "job_outlook": "25% (Much faster than average)",
                "description": "Design scalable cloud infrastructure and migration strategies"
            },
            "Cybersecurity Analyst": {
                "required_competencies": ["cs_001", "cs_016", "cs_017"],
                "skills": ["Network Security", "Penetration Testing", "SIEM", "Cryptography", "Linux", "Python"],
                "salary_range": "$85,000 - $140,000",
                "job_outlook": "35% (Much faster than average)",
                "description": "Protect systems and networks from security threats and vulnerabilities"
            },
            "UI/UX Designer": {
                "required_competencies": ["cs_008", "cs_003"],
                "skills": ["Figma", "Adobe XD", "User Research", "Prototyping", "HTML/CSS", "Design Systems"],
                "salary_range": "$70,000 - $115,000",
                "job_outlook": "13% (Faster than average)",
                "description": "Design intuitive and beautiful user interfaces and experiences"
            }
        }
    
    def get_career_recommendations(self, mastered_competencies: list) -> list:
        recommendations = []
        mastered_set = set(mastered_competencies)
        
        for career, details in self.career_skills.items():
            required = set(details["required_competencies"])
            match_percentage = len(required & mastered_set) / len(required) * 100 if required else 0
            
            recommendations.append({
                "title": career,
                "description": details["description"],
                "match": round(match_percentage, 1),
                "salary": details["salary_range"],
                "growth": details["job_outlook"],
                "skills": details["skills"]
            })
        
        return sorted(recommendations, key=lambda x: x["match"], reverse=True)
    
    def get_skills_gap(self, career: str, mastered_competencies: list) -> dict:
        if career not in self.career_skills:
            return {"error": "Career not found"}
        
        required = set(self.career_skills[career]["required_competencies"])
        mastered = set(mastered_competencies)
        mastered_skills = required & mastered
        missing_skills = required - mastered
        
        all_skills = self.career_skills[career]["skills"]
        mastered_count = len(mastered_skills)
        total_count = len(required)
        
        # Map competencies to skill names for display
        mastered_skill_names = all_skills[:mastered_count] if mastered_count > 0 else []
        missing_skill_names = all_skills[mastered_count:] if mastered_count < len(all_skills) else []
        
        return {
            "completion": round(len(mastered_skills) / len(required) * 100, 1) if required else 0,
            "mastered": mastered_skill_names,
            "missing": missing_skill_names
        }
    
    def get_job_listings(self, skills: list) -> list:
        # Mock job listings - in production, integrate with real job APIs
        job_templates = [
            {"title": "Senior {role}", "company": "Tech Giants Inc", "location": "Remote", "level": "senior"},
            {"title": "Mid-Level {role}", "company": "Innovation Labs", "location": "Hybrid", "level": "mid"},
            {"title": "Junior {role}", "company": "StartUp Ventures", "location": "On-site", "level": "junior"},
            {"title": "{role} - Entry Level", "company": "Digital Solutions", "location": "Remote", "level": "entry"},
        ]
        
        jobs = []
        for template in job_templates:
            jobs.append({
                "title": template["title"].format(role="Developer"),
                "company": template["company"],
                "location": template["location"],
                "url": "#",
                "skills": skills[:5] if skills else ["Programming", "Problem Solving"]
            })
        
        return jobs
