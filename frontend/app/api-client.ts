const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Something went wrong while loading data.");
  }
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text || res.statusText;
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.message === "string") {
        message = parsed.message;
      }
    } catch {
      // ignore JSON parse errors
    }
    const lower = message.toLowerCase();
    if (lower.includes("unique constraint") && lower.includes("slug")) {
      message = "This slug is already in use. Please choose another one.";
    }
    throw new Error(message || "Request failed.");
  }

  return res.json();
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text || res.statusText;
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.message === "string") {
        message = parsed.message;
      }
    } catch {
      // ignore JSON parse errors
    }
    const lower = message.toLowerCase();
    if (lower.includes("unique constraint") && lower.includes("slug")) {
      message = "This slug is already in use. Please choose another one.";
    }
    throw new Error(message || "Request failed.");
  }

  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text || res.statusText;
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.message === "string") {
        message = parsed.message;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message || "Request failed.");
  }
}

export async function apiPostVoid(path: string, body?: unknown): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: body
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text || res.statusText;
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.message === "string") {
        message = parsed.message;
      }
    } catch {
      // ignore JSON parse errors
    }
    const lower = message.toLowerCase();
    if (lower.includes("unique constraint") && lower.includes("slug")) {
      message = "This slug is already in use. Please choose another one.";
    }
    throw new Error(message || "Request failed.");
  }
}


