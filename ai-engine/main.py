"""
Skill Swap Python AI Engine Microservice (FastAPI)
Exposes REST endpoints for the Node.js backend to query TensorFlow + Scikit-learn
recommendations, personalized learning paths, and trending skills.
"""

from typing import Any, Dict, List, Optional
import os

import sklearn
import tensorflow as tf
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from skill_matcher import (
    analyze_trending_skills,
    generate_personalized_learning_path,
    match_learners_and_tutors,
)

app = FastAPI(
    title="Skill Swap AI Matching Microservice",
    version="1.0.0",
    description="TensorFlow + Scikit-learn skill matching, learning path, and trend analytics service",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class MatchRequest(BaseModel):
    learner: Dict[str, Any] = Field(default_factory=dict)
    tutors: List[Dict[str, Any]] = Field(default_factory=list)
    limit: int = Field(default=10, ge=1, le=50)


class LearningPathRequest(BaseModel):
    learner: Dict[str, Any] = Field(default_factory=dict)
    goalSkill: Optional[str] = None


class TrendingRequest(BaseModel):
    users: List[Dict[str, Any]] = Field(default_factory=list)
    sessions: List[Dict[str, Any]] = Field(default_factory=list)
    topN: int = Field(default=6, ge=1, le=20)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Skill Swap Python AI Engine",
        "tensorflowVersion": tf.__version__,
        "scikitLearnVersion": sklearn.__version__,
    }


@app.post("/ai/match-tutors")
def api_match_tutors(payload: MatchRequest):
    matches = match_learners_and_tutors(
        learner=payload.learner,
        tutors=payload.tutors,
        limit=payload.limit,
    )
    return {
        "success": True,
        "engine": "tensorflow-scikit-learn",
        "matches": matches,
    }


@app.post("/ai/learning-path")
def api_learning_path(payload: LearningPathRequest):
    roadmap = generate_personalized_learning_path(
        learner=payload.learner,
        goal_skill=payload.goalSkill,
    )
    return {
        "success": True,
        "engine": "scikit-learn-tfidf-roadmap",
        "learningPath": roadmap,
    }


@app.post("/ai/trending-skills")
def api_trending_skills(payload: TrendingRequest):
    trending = analyze_trending_skills(
        users=payload.users,
        sessions=payload.sessions,
        top_n=payload.topN,
    )
    return {
        "success": True,
        "engine": "skill-velocity-analytics",
        "trending": trending,
    }


if __name__ == "__main__":
    port = int(os.getenv("AI_PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
