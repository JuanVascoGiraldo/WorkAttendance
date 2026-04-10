import configuration from "../../configuration";

const buildTimestampHeader = () => ({
  TIMESTAMP: new Date().toISOString(),
});

const buildUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${configuration.backendHost}${normalizedPath}`;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const request = async (method, path, body = undefined, options = {}) => {
  const response = await fetch(buildUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...buildTimestampHeader(),
      ...(options.headers || {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(payload?.message || payload?.detail || "Request failed");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

const httpClient = {
  get: (path, options) => request("GET", path, undefined, options),
  post: (path, body, options) => request("POST", path, body, options),
  put: (path, body, options) => request("PUT", path, body, options),
  patch: (path, body, options) => request("PATCH", path, body, options),
  delete: (path, body, options) => request("DELETE", path, body, options),
};

export default httpClient;
