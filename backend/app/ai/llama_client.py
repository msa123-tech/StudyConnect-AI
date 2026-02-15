"""Async Ollama client for local LLaMA."""
import re

import httpx

from app.config import OLLAMA_BASE_URL, OLLAMA_MODEL


class OllamaUnavailableError(Exception):
    """Raised when Ollama is unreachable or returns an error."""
    pass


def strip_think_tags(text: str) -> str:
    """Remove <think>...</think> blocks so only the final answer is shown."""
    if not text:
        return text
    # Match <think>...</think> with any content (non-greedy), including newlines
    cleaned = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL | re.IGNORECASE)
    return cleaned.strip()


async def generate(prompt: str, stream: bool = False) -> str:
    """Send prompt to Ollama, return generated text. Non-blocking.
    Raises OllamaUnavailableError if Ollama is down or model fails.
    """
    url = f"{OLLAMA_BASE_URL.rstrip('/')}/api/generate"
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": stream,
    }
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
    except httpx.ConnectError as e:
        raise OllamaUnavailableError(
            f"Ollama is not reachable at {OLLAMA_BASE_URL}. Is it running?"
        ) from e
    except httpx.TimeoutException as e:
        raise OllamaUnavailableError("Ollama request timed out.") from e
    except httpx.HTTPStatusError as e:
        msg = str(e.response.text) if e.response else str(e)
        if e.response and e.response.status_code == 404:
            raise OllamaUnavailableError(
                f"Model '{OLLAMA_MODEL}' not found. Pull it with: ollama pull {OLLAMA_MODEL}"
            ) from e
        raise OllamaUnavailableError(f"Ollama error: {msg}") from e
    raw = data.get("response", "").strip()
    return strip_think_tags(raw)
