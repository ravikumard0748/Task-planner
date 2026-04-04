from flask import Blueprint, request, jsonify
from llm_engine import ask_llm_json

replan_bp = Blueprint("replan", __name__)


@replan_bp.route("/api/replan", methods=["POST"])
def replan():
    data = request.get_json(silent=True) or {}
    original_plan = data.get("original_plan")
    completed_tasks = data.get("completed_tasks", [])
    blockers = data.get("blockers", [])

    if original_plan is None:
        return jsonify({"error": "Missing required field: original_plan"}), 400
    if not isinstance(completed_tasks, list):
        return jsonify({"error": "Invalid field: completed_tasks must be an array"}), 400
    if not isinstance(blockers, list):
        return jsonify({"error": "Invalid field: blockers must be an array"}), 400

    system_prompt = """You are an adaptive AI re-planner. Analyze the original plan,
    completed tasks, and blockers. Return ONLY JSON with: completed_percentage,
    delayed_tasks (array), revised_schedule (array of {task, new_date}),
    blocker_solutions (array of {blocker, suggested_fix}), overall_status."""

    user_message = (
        "Original plan: "
        f"{original_plan}. Completed tasks: {completed_tasks}. Blockers: {blockers}."
    )

    try:
        result = ask_llm_json(system_prompt, user_message)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
