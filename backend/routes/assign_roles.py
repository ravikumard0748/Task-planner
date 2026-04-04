from flask import Blueprint, request, jsonify
from llm_engine import ask_llm_json

assign_roles_bp = Blueprint("assign_roles", __name__)


@assign_roles_bp.route("/api/assign-roles", methods=["POST"])
def assign_roles():
    data = request.get_json(silent=True) or {}
    goal = data.get("goal")
    team_members = data.get("team_members", [])

    if not goal:
        return jsonify({"error": "Missing required field: goal"}), 400
    if not isinstance(team_members, list) or not team_members:
        return jsonify({"error": "Missing or invalid required field: team_members"}), 400

    system_prompt = """You are a multi-agent coordinator. Assign roles and tasks
    to team members based on their skills. Return ONLY JSON with: assignments
    (array of {agent_name, role, assigned_tasks (array), skills_used (array),
    workload_percentage}), collaboration_points (array)."""

    user_message = (
        f"Project goal: {goal}. Team members and skills: {team_members}. "
        "Assign the best role and workload split."
    )

    try:
        result = ask_llm_json(system_prompt, user_message)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
