from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.messages import HumanMessage, SystemMessage
import json
import re

HF_API_KEY = "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"

llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    huggingfacehub_api_token=HF_API_KEY,
    task="conversational",
    max_new_tokens=512,
    temperature=0.7,
)

chat = ChatHuggingFace(llm=llm)


def ask_llm(system_prompt: str, user_message: str) -> str:
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_message),
    ]
    response = chat.invoke(messages)
    return response.content


def _strip_code_fences(text: str) -> str:
    cleaned = text.strip()
    cleaned = cleaned.replace("```json", "").replace("```", "").strip()
    return cleaned


def _extract_json_candidate(text: str) -> str:
    cleaned = _strip_code_fences(text)

    start_candidates = [index for index in [cleaned.find("{"), cleaned.find("[")] if index != -1]
    if not start_candidates:
        return cleaned

    start_index = min(start_candidates)
    end_index = max(cleaned.rfind("}"), cleaned.rfind("]"))
    if end_index == -1 or end_index < start_index:
        return cleaned[start_index:]

    return cleaned[start_index : end_index + 1]


def _remove_trailing_commas(text: str) -> str:
    return re.sub(r",(\s*[}\]])", r"\1", text)


def _repair_decode_error(candidate: str, error: json.JSONDecodeError) -> str | None:
    message = error.msg.lower()
    position = error.pos

    if "expecting ',' delimiter" in message:
        if position < len(candidate) and candidate[position] != ",":
            return candidate[:position] + "," + candidate[position:]

    if "expecting property name enclosed in double quotes" in message:
        return _remove_trailing_commas(candidate)

    if "unterminated string starting at" in message:
        return candidate[:position] + '"' + candidate[position:]

    if "extra data" in message:
        return _extract_json_candidate(candidate)

    return None


def _parse_json(text: str):
    candidate = _extract_json_candidate(text)
    candidate = _remove_trailing_commas(candidate)

    for _ in range(8):
        try:
            return json.loads(candidate)
        except json.JSONDecodeError as error:
            repaired = _repair_decode_error(candidate, error)
            if repaired is None or repaired == candidate:
                raise
            candidate = repaired

    return json.loads(candidate)


def _repair_json_with_llm(raw_text: str) -> str:
    repair_prompt = (
        "Convert the following text into STRICT valid JSON only. "
        "Do not add markdown, explanations, or code fences. "
        "Preserve the intended structure and fix any syntax issues.\n\n"
        f"TEXT:\n{raw_text}"
    )
    return ask_llm("You are a strict JSON repair assistant.", repair_prompt)


def ask_llm_json(system_prompt: str, user_message: str) -> dict:
    raw = ask_llm(system_prompt, user_message)
    try:
        return _parse_json(raw)
    except Exception:
        repaired_raw = _repair_json_with_llm(raw)
        return _parse_json(repaired_raw)
