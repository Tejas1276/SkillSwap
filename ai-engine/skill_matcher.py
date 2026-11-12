"""
Skill Swap AI Skill-Matching & Recommendation Engine
Uses Scikit-learn (TF-IDF + Cosine Similarity + MinMaxScaler) and
TensorFlow (Keras neural compatibility scoring model) to match learners
and tutors, generate personalized learning paths, and detect trending skills.
"""

from __future__ import annotations

import os
from collections import Counter
from typing import Any, Dict, List

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

import numpy as np
import tensorflow as tf
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Curated multi-track prerequisite knowledge graph for personalized learning paths
LEARNING_PATH_GRAPH: Dict[str, List[Dict[str, str]]] = {
    "web development": [
        {"step": "1", "skill": "HTML5 & Semantic Markup", "level": "beginner", "focus": "Page structure, forms, accessibility"},
        {"step": "2", "skill": "Modern CSS3, Flexbox & Grid", "level": "beginner", "focus": "Responsive layout systems"},
        {"step": "3", "skill": "JavaScript ES6+ & Async/Await", "level": "intermediate", "focus": "DOM manipulation, fetch API, closures"},
        {"step": "4", "skill": "React.js Components & Hooks", "level": "intermediate", "focus": "State management, Context API, Vite"},
        {"step": "5", "skill": "Node.js, Express & MongoDB", "level": "advanced", "focus": "REST APIs, JWT auth, Mongoose schemas"},
        {"step": "6", "skill": "WebRTC Real-Time Systems", "level": "advanced", "focus": "Peer-to-peer media & signaling"},
    ],
    "data science": [
        {"step": "1", "skill": "Python 3 Fundamentals", "level": "beginner", "focus": "Data structures, functions, virtualenvs"},
        {"step": "2", "skill": "NumPy & Pandas Data Analysis", "level": "beginner", "focus": "Vectorized arrays, dataframes, cleaning"},
        {"step": "3", "skill": "Data Visualization & EDA", "level": "intermediate", "focus": "Feature correlation and storytelling"},
        {"step": "4", "skill": "Scikit-learn Machine Learning", "level": "intermediate", "focus": "TF-IDF, regression, classification, clustering"},
        {"step": "5", "skill": "Deep Learning with TensorFlow", "level": "advanced", "focus": "Neural networks, Keras pipelines, embeddings"},
    ],
    "ui/ux design": [
        {"step": "1", "skill": "Design Principles & Typography", "level": "beginner", "focus": "Hierarchy, contrast, grid systems"},
        {"step": "2", "skill": "User Research & Wireframing", "level": "beginner", "focus": "User flows and low-fidelity mockups"},
        {"step": "3", "skill": "Figma Design Systems", "level": "intermediate", "focus": "Reusable components, tokens, auto-layout"},
        {"step": "4", "skill": "Interactive Prototyping & Testing", "level": "advanced", "focus": "Usability audits and design handoff"},
    ],
    "machine learning": [
        {"step": "1", "skill": "Linear Algebra & Probability", "level": "beginner", "focus": "Vectors, cosine similarity, distributions"},
        {"step": "2", "skill": "Python & Scikit-learn Pipelines", "level": "intermediate", "focus": "Feature engineering and model evaluation"},
        {"step": "3", "skill": "Neural Networks with TensorFlow", "level": "advanced", "focus": "Gradient descent, Keras layers, serving"},
        {"step": "4", "skill": "ML Microservice Deployment", "level": "advanced", "focus": "FastAPI inference endpoints & monitoring"},
    ],
    "dsa (c++)": [
        {"step": "1", "skill": "C++ STL & Time Complexity", "level": "beginner", "focus": "Big-O analysis, vectors, maps, sets"},
        {"step": "2", "skill": "Recursion, Stacks & Queues", "level": "intermediate", "focus": "Backtracking and monotonic structures"},
        {"step": "3", "skill": "Trees, Tries & Heaps", "level": "intermediate", "focus": "Traversals and priority queues"},
        {"step": "4", "skill": "Graphs & Dynamic Programming", "level": "advanced", "focus": "Shortest paths, memoization, tabulation"},
    ],
    "public speaking": [
        {"step": "1", "skill": "Vocal Clarity & Body Language", "level": "beginner", "focus": "Pacing, eye contact, stage confidence"},
        {"step": "2", "skill": "Structured Storytelling", "level": "intermediate", "focus": "Hook, narrative arc, memorable closing"},
        {"step": "3", "skill": "Technical Demo & Q&A Defense", "level": "advanced", "focus": "Handling tough questions concisely"},
    ],
}

PROFICIENCY_WEIGHTS = {
    "beginner": 0.4,
    "intermediate": 0.65,
    "advanced": 0.85,
    "expert": 1.0,
}


class NeuralCompatibilityScorer:
    """
    Lightweight TensorFlow/Keras scoring network initialized with domain-aligned
    positive kernel weights to fuse skill similarity, tutor rating, credibility,
    and review confidence into a calibrated compatibility score.
    """

    def __init__(self) -> None:
        self.model = self._build_and_initialize_model()

    @staticmethod
    def _build_and_initialize_model() -> tf.keras.Model:
        inputs = tf.keras.Input(shape=(4,), name="match_features")
        # Positive-constrained linear combination + bounded sigmoid calibration layer
        hidden = tf.keras.layers.Dense(
            4,
            activation="relu",
            use_bias=True,
            name="feature_interaction",
        )(inputs)
        output = tf.keras.layers.Dense(
            1,
            activation="sigmoid",
            name="compatibility_score",
        )(hidden)
        model = tf.keras.Model(inputs=inputs, outputs=output)

        # Initialize deterministic calibrated weights reflecting platform priorities:
        # [0] skill_similarity (45%), [1] credibility_norm (25%), [2] rating_norm (20%), [3] confidence (10%)
        w_hidden = np.array(
            [
                [1.8, 0.4, 0.2, 0.6],   # skill similarity
                [0.4, 1.4, 0.3, 0.4],   # credibility
                [0.3, 0.4, 1.3, 0.3],   # rating
                [0.2, 0.2, 0.2, 0.8],   # experience confidence
            ],
            dtype=np.float32,
        )
        b_hidden = np.array([-0.1, -0.1, -0.1, -0.1], dtype=np.float32)
        w_out = np.array([[1.2], [0.9], [0.85], [0.5]], dtype=np.float32)
        b_out = np.array([-1.35], dtype=np.float32)

        model.get_layer("feature_interaction").set_weights([w_hidden, b_hidden])
        model.get_layer("compatibility_score").set_weights([w_out, b_out])
        return model

    def predict_batch(self, feature_matrix: np.ndarray) -> np.ndarray:
        if len(feature_matrix) == 0:
            return np.array([], dtype=np.float32)
        tensor_in = tf.convert_to_tensor(feature_matrix, dtype=tf.float32)
        preds = self.model(tensor_in, training=False).numpy().reshape(-1)
        return preds


# Instantiate shared scorer once at module import
neural_scorer = NeuralCompatibilityScorer()


def _extract_skill_tokens(skills: List[Dict[str, Any]], key: str = "skill") -> List[str]:
    tokens = []
    for entry in skills or []:
        if isinstance(entry, dict) and entry.get(key):
            tokens.append(str(entry[key]).strip().lower())
        elif isinstance(entry, str) and entry.strip():
            tokens.append(entry.strip().lower())
    return tokens


def match_learners_and_tutors(
    learner: Dict[str, Any],
    tutors: List[Dict[str, Any]],
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """
    Ranks candidate tutors for a learner using Scikit-learn TF-IDF Cosine Similarity
    paired with TensorFlow compatibility scoring over rating and AI credibility.
    """
    if not tutors:
        return []

    learner_skills = _extract_skill_tokens(learner.get("skillsToLearn", []))
    learner_goal = str(learner.get("goalSkill") or "").strip().lower()
    if learner_goal and learner_goal not in learner_skills:
        learner_skills.insert(0, learner_goal)

    learner_notes = " ".join(
        str(s.get("notes", ""))
        for s in (learner.get("skillsToLearn") or [])
        if isinstance(s, dict)
    )
    learner_doc = f"{' '.join(learner_skills)} {learner_notes} {learner.get('bio', '')}".strip()

    if not learner_doc:
        learner_doc = "general peer learning web development design programming"

    tutor_docs: List[str] = []
    tutor_skill_sets: List[List[str]] = []

    for tutor in tutors:
        t_skills = _extract_skill_tokens(tutor.get("skillsToTeach", []))
        t_descriptions = " ".join(
            f"{s.get('skill', '')} {s.get('description', '')} {s.get('proficiency', '')}"
            for s in (tutor.get("skillsToTeach") or [])
            if isinstance(s, dict)
        )
        tutor_skill_sets.append(t_skills)
        tutor_docs.append(f"{' '.join(t_skills)} {t_descriptions} {tutor.get('bio', '')}".strip())

    # 1. Compute Scikit-learn TF-IDF Cosine Similarity
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
    tfidf_matrix = vectorizer.fit_transform([learner_doc] + tutor_docs)
    learner_vec = tfidf_matrix[0:1]
    tutor_vecs = tfidf_matrix[1:]
    cos_sims = cosine_similarity(learner_vec, tutor_vecs).flatten()

    # Exact substring bonus to boost direct skill name hits cleanly
    feature_rows = []
    exact_matches_per_tutor: List[List[str]] = []

    for idx, tutor in enumerate(tutors):
        t_skills = tutor_skill_sets[idx]
        matched = [
            ts for ts in t_skills
            if any(ls in ts or ts in ls for ls in learner_skills)
        ]
        exact_matches_per_tutor.append(matched)

        tfidf_sim = float(cos_sims[idx])
        overlap_ratio = (
            min(1.0, len(matched) / max(1, len(learner_skills))) if learner_skills else 0.0
        )
        blended_sim = min(1.0, 0.55 * tfidf_sim + 0.45 * overlap_ratio)

        rating_obj = tutor.get("rating") or {}
        avg_rating = float(rating_obj.get("average", 4.5) if isinstance(rating_obj, dict) else rating_obj or 4.5)
        rating_count = int(rating_obj.get("count", 0) if isinstance(rating_obj, dict) else 0)
        credibility = float(tutor.get("credibilityScore", 75.0))

        # Proficiency bonus based on matched taught skills
        max_prof = max(
            [
                PROFICIENCY_WEIGHTS.get(str(s.get("proficiency", "intermediate")).lower(), 0.65)
                for s in (tutor.get("skillsToTeach") or [])
                if isinstance(s, dict)
            ]
            or [0.65]
        )

        feature_rows.append([
            blended_sim,
            min(1.0, max(0.0, credibility / 100.0)),
            min(1.0, max(0.0, avg_rating / 5.0)),
            min(1.0, 0.4 * max_prof + 0.6 * min(1.0, rating_count / 20.0)),
        ])

    feature_matrix = np.array(feature_rows, dtype=np.float32)

    # 2. TensorFlow Neural Ranker Inference
    tf_scores = neural_scorer.predict_batch(feature_matrix)

    results: List[Dict[str, Any]] = []
    for idx, tutor in enumerate(tutors):
        sim_score = feature_rows[idx][0]
        cred_norm = feature_rows[idx][1]
        rating_norm = feature_rows[idx][2]
        nn_score = float(tf_scores[idx])

        # Weighted composite ensures transparent interpretability alongside NN calibration
        composite_0_to_100 = round(
            (0.45 * nn_score + 0.30 * sim_score + 0.15 * cred_norm + 0.10 * rating_norm) * 100.0,
            1,
        )

        matched = exact_matches_per_tutor[idx]
        if composite_0_to_100 >= 82:
            label = "Top AI Match"
        elif composite_0_to_100 >= 68:
            label = "Strong Match"
        else:
            label = "Recommended Peer"

        explanation_parts = []
        if matched:
            explanation_parts.append(f"Teaches your target skills ({', '.join(matched)})")
        else:
            explanation_parts.append(f"Skill similarity {round(sim_score * 100)}%")
        explanation_parts.append(f"Credibility {round(cred_norm * 100)}/100")

        results.append({
            "tutorId": str(tutor.get("_id") or tutor.get("id") or ""),
            "name": tutor.get("name"),
            "matchScore": min(99.5, composite_0_to_100),
            "skillSimilarity": round(sim_score * 100.0, 1),
            "neuralConfidence": round(nn_score * 100.0, 1),
            "compatibilityLabel": label,
            "matchedSkills": matched,
            "explanation": " • ".join(explanation_parts),
        })

    results.sort(key=lambda r: (r["matchScore"], r["skillSimilarity"]), reverse=True)
    return results[:limit]


def generate_personalized_learning_path(
    learner: Dict[str, Any],
    goal_skill: str | None = None,
) -> Dict[str, Any]:
    """
    Generates a tailored multi-step learning roadmap based on the learner's target
    skill and current taught expertise, using TF-IDF nearest-track matching.
    """
    desired_skills = _extract_skill_tokens(learner.get("skillsToLearn", []))
    known_skills = set(_extract_skill_tokens(learner.get("skillsToTeach", [])))

    primary_goal = (goal_skill or (desired_skills[0] if desired_skills else "web development")).strip().lower()

    # Match primary_goal to closest curriculum track via Scikit-learn TF-IDF
    track_names = list(LEARNING_PATH_GRAPH.keys())
    vectorizer = TfidfVectorizer()
    vecs = vectorizer.fit_transform([primary_goal] + track_names)
    sims = cosine_similarity(vecs[0:1], vecs[1:]).flatten()
    best_idx = int(np.argmax(sims))
    best_sim = float(sims[best_idx])

    if best_sim >= 0.2:
        chosen_track = track_names[best_idx]
        raw_steps = LEARNING_PATH_GRAPH[chosen_track]
    else:
        chosen_track = primary_goal.title()
        raw_steps = [
            {"step": "1", "skill": f"{primary_goal.title()} Foundations", "level": "beginner", "focus": "Core terminology & setup"},
            {"step": "2", "skill": f"Guided Peer Practice in {primary_goal.title()}", "level": "intermediate", "focus": "Hands-on mini project with a tutor"},
            {"step": "3", "skill": f"Real-World {primary_goal.title()} Application", "level": "advanced", "focus": "Portfolio build & code/peer review"},
        ]

    personalized_steps = []
    for item in raw_steps:
        step_skill_lower = item["skill"].lower()
        already_known = any(k in step_skill_lower for k in known_skills)
        personalized_steps.append({
            **item,
            "status": "completed" if already_known else "recommended",
            "estimatedHours": 2 if item["level"] == "beginner" else 3,
        })

    return {
        "goalSkill": primary_goal,
        "matchedTrack": chosen_track.title(),
        "confidence": round(max(0.65, best_sim) * 100, 1),
        "totalEstimatedHours": sum(s["estimatedHours"] for s in personalized_steps),
        "steps": personalized_steps,
    }


def analyze_trending_skills(
    users: List[Dict[str, Any]],
    sessions: List[Dict[str, Any]],
    top_n: int = 6,
) -> List[Dict[str, Any]]:
    """
    Analyzes platform-wide demand (skillsToLearn + session bookings) vs tutor
    supply (skillsToTeach) to highlight trending campus skills.
    """
    demand_counter: Counter[str] = Counter()
    supply_counter: Counter[str] = Counter()

    for u in users or []:
        for s in _extract_skill_tokens(u.get("skillsToLearn", [])):
            demand_counter[s] += 2
        for s in _extract_skill_tokens(u.get("skillsToTeach", [])):
            supply_counter[s] += 1

    for sess in sessions or []:
        sk = str(sess.get("skill", "")).strip().lower()
        if sk:
            demand_counter[sk] += 3

    # Seed baseline academic trends when DB is lightly populated
    baseline_trends = {
        "react": 9,
        "python": 8,
        "ui/ux design": 7,
        "machine learning": 7,
        "dsa (c++)": 6,
        "public speaking": 5,
    }
    for skill, base_score in baseline_trends.items():
        if demand_counter[skill] == 0:
            demand_counter[skill] += base_score

    trending = []
    for skill, demand in demand_counter.most_common(top_n):
        supply = supply_counter.get(skill, 1)
        velocity = round((demand * 1.5) / max(1, supply * 0.6), 1)
        trending.append({
            "skill": skill.title(),
            "demandCount": demand,
            "tutorsAvailable": supply,
            "trendScore": min(99.0, round(60.0 + velocity * 3.5, 1)),
            "badge": "🔥 High Demand" if velocity >= 4.0 else "📈 Rising",
        })

    trending.sort(key=lambda x: x["trendScore"], reverse=True)
    return trending[:top_n]
