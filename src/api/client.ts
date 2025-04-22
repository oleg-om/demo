import { IError } from "@/interfaces/error";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  query?: URLSearchParams,
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);

  if (query) {
    url.search = query.toString();
  }

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorData: IError = {
      status: res.status,
      statusText: res.statusText,
      message: "Request Error",
    };

    try {
      const contentType = res.headers.get("Content-Type") || "";

      if (contentType.includes("application/json")) {
        const json = await res.json();
        errorData = {
          ...errorData,
          ...json,
        };
      } else {
        const text = await res.text();
        errorData.message = text;
      }
    } catch (err) {
      console.warn("Error parsing error response", err);
    }

    // Выкидываем всю ошибку, а не только message
    throw errorData;
  }

  return res.json();
}
