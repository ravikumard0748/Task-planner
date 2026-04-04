from flask import Blueprint, request, jsonify
from llm_engine import ask_llm_json

decompose_bp = Blueprint("decompose", __name__)


@decompose_bp.route("/api/decompose-goal", methods=["POST"])
def decompose_goal():
    data = request.get_json(silent=True) or {}
    goal = data.get("goal")

    if not goal:
        return jsonify({"error": "Missing required field: goal"}), 400

    system_prompt = """You are an autonomous AI planner. Break down the given
    high-level goal into actionable sub-tasks. Return ONLY a valid JSON array.
    Each object must have: task_id (string), task_name (string),
    description (string), priority (High/Medium/Low),
    depends_on (array of task_ids), estimated_hours (integer), category (string)."""

    user_message = f"Decompose this goal into sub-tasks: '{goal}'"

    try:
        result = ask_llm_json(system_prompt, user_message)
        tasks = result if isinstance(result, list) else result.get("tasks", result)
        return jsonify({"tasks": tasks})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
