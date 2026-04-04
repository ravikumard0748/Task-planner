from flask import Blueprint, request, jsonify
from llm_engine import ask_llm_json

execute_bp = Blueprint("execute", __name__)


@execute_bp.route("/api/execute-task", methods=["POST"])
def execute_task():
    data = request.get_json(silent=True) or {}
    task_description = data.get("task_description")

    if not task_description:
        return jsonify({"error": "Missing required field: task_description"}), 400

    system_prompt = """You are an autonomous AI agent. For the given task, think
    step by step using ReAct reasoning (Reason -> Act -> Observe). Return ONLY JSON
    with: reasoning_steps (array of {step, thought, action, observation}),
    tools_required (array), estimated_completion, risk_factors (array)."""

    user_message = f"Build a step-by-step execution plan for this task: '{task_description}'"

    try:
        result = ask_llm_json(system_prompt, user_message)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
