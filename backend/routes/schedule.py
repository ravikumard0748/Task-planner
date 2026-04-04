from flask import Blueprint, request, jsonify
from llm_engine import ask_llm_json

schedule_bp = Blueprint("schedule", __name__)


@schedule_bp.route("/api/schedule-tasks", methods=["POST"])
def schedule_tasks():
    data = request.get_json(silent=True) or {}
    tasks = data.get("tasks", [])
    hours_per_day = data.get("hours_per_day")
    start_date = data.get("start_date")

    if not isinstance(tasks, list) or not tasks:
        return jsonify({"error": "Missing or invalid required field: tasks"}), 400
    if hours_per_day is None:
        return jsonify({"error": "Missing required field: hours_per_day"}), 400
    if not start_date:
        return jsonify({"error": "Missing required field: start_date"}), 400

    system_prompt = """You are an expert project scheduler. Given the tasks and
    constraints, generate a realistic day-by-day schedule. Return ONLY JSON with:
    schedule (array of {date, tasks_for_day (array of task names), total_hours}),
    critical_path (array of most important tasks), buffer_days (integer)."""

    user_message = (
        "Create a schedule for these tasks: "
        f"{tasks}. Available hours per day: {hours_per_day}. Start date: {start_date}."
    )

    try:
        result = ask_llm_json(system_prompt, user_message)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
