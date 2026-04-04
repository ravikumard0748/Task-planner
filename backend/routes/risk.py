from flask import Blueprint, request, jsonify
from llm_engine import ask_llm_json

risk_bp = Blueprint("risk", __name__)


@risk_bp.route("/api/analyze-risk", methods=["POST"])
def analyze_risk():
    data = request.get_json(silent=True) or {}
    plan = data.get("plan")
    timeline = data.get("timeline")
    resources = data.get("resources")

    if plan is None:
        return jsonify({"error": "Missing required field: plan"}), 400
    if timeline is None:
        return jsonify({"error": "Missing required field: timeline"}), 400
    if resources is None:
        return jsonify({"error": "Missing required field: resources"}), 400

    system_prompt = """You are an AI risk analyst. Analyze the project plan and
    identify potential risks. Return ONLY JSON with: risks (array of {risk_id,
    risk_name, probability (High/Medium/Low), impact (High/Medium/Low),
    mitigation_strategy, contingency_plan}), overall_risk_score (0-100)."""

    user_message = (
        f"Plan: {plan}. Timeline: {timeline}. Resources: {resources}. "
        "Produce a risk analysis report."
    )

    try:
        result = ask_llm_json(system_prompt, user_message)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
