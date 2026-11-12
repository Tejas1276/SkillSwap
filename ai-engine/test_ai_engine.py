from fastapi.testclient import TestClient

from main import app
from skill_matcher import (
    analyze_trending_skills,
    generate_personalized_learning_path,
    match_learners_and_tutors,
)

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert "tensorflowVersion" in body
    assert "scikitLearnVersion" in body


def test_match_tutors_ranks_best_skill_credibility_and_rating_first():
    learner = {
        "name": "Tejas",
        "skillsToLearn": [{"skill": "react", "targetProficiency": "intermediate"}],
        "bio": "Want to master modern React hooks and web apps",
    }
    tutors = [
        {
            "_id": "t1",
            "name": "Low Match Tutor",
            "skillsToTeach": [{"skill": "guitar", "proficiency": "expert"}],
            "rating": {"average": 4.9, "count": 10},
            "credibilityScore": 90.0,
        },
        {
            "_id": "t2",
            "name": "Rohan Sharma",
            "skillsToTeach": [
                {"skill": "react", "proficiency": "expert", "description": "React hooks and full stack"}
            ],
            "rating": {"average": 4.9, "count": 20},
            "credibilityScore": 94.0,
        },
        {
            "_id": "t3",
            "name": "New React Tutor",
            "skillsToTeach": [{"skill": "react", "proficiency": "beginner"}],
            "rating": {"average": 3.5, "count": 1},
            "credibilityScore": 55.0,
        },
    ]

    matches = match_learners_and_tutors(learner, tutors, limit=3)
    assert len(matches) == 3
    assert matches[0]["tutorId"] == "t2"
    assert matches[0]["matchScore"] > matches[2]["matchScore"]
    assert matches[0]["matchScore"] > matches[1]["matchScore"]
    assert "react" in matches[0]["matchedSkills"]


def test_learning_path_endpoint():
    res = client.post(
        "/ai/learning-path",
        json={
            "learner": {
                "skillsToTeach": [{"skill": "HTML5 & Semantic Markup"}],
                "skillsToLearn": [{"skill": "web development"}],
            },
            "goalSkill": "web development",
        },
    )
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    roadmap = body["learningPath"]
    assert len(roadmap["steps"]) >= 4
    assert roadmap["steps"][0]["status"] == "completed"


def test_trending_skills_endpoint():
    res = client.post(
        "/ai/trending-skills",
        json={
            "users": [
                {
                    "skillsToLearn": [{"skill": "python"}, {"skill": "react"}],
                    "skillsToTeach": [{"skill": "python"}],
                }
            ],
            "sessions": [{"skill": "react"}, {"skill": "react"}],
            "topN": 5,
        },
    )
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    assert len(body["trending"]) > 0
    assert body["trending"][0]["skill"].lower() == "react"
