const BASE_URL = import.meta.env.VITE_API_URL;

// Global config for auth token
let authToken = null;

async function fetchClient(endpoint, { method = "GET", body, headers = {}, timeout = 10000, ...otherOptions } = {}) {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...otherOptions, // Include any other fetch options like credentials, mode, cache, etc.
  };

  // Add auth token if available
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  // Handle different body types
  if (body) {
    if (body instanceof FormData) {
      // Remove Content-Type for FormData (browser sets it)
      delete config.headers["Content-Type"];
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
    }
  }

  try {
    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    config.signal = controller.signal;

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    clearTimeout(timeoutId);

    // Handle non-200 status
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `Error ${response.status}`);
      error.status = response.status;
      throw error;
    }

    // Smart response parsing
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    console.error("Fetch error:", error.message);
    throw error;
  }
}

// Helper to set auth token
function setAuthToken(token) {
  authToken = token;
}

// Helper to clear auth token
function clearAuthToken() {
  authToken = null;
}

// Helper for file uploads
function uploadFile(endpoint, file, additionalData = {}) {
  const formData = new FormData();
  formData.append("file", file);
  
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return fetchAPI.post(endpoint, formData);
}

// Shortcut helpers
export const fetchAPI = {
  get: (endpoint, options = {}) => fetchClient(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) => fetchClient(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options = {}) => fetchClient(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options = {}) => fetchClient(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options = {}) => fetchClient(endpoint, { ...options, method: "DELETE" }),
  
  // Auth helpers
  setAuth: setAuthToken,
  clearAuth: clearAuthToken,
  
  // File upload helper
  upload: uploadFile,
};

// Usage examples:
// const users = await api.get('/users');
// const user = await api.post('/users', { name: 'John' });
// api.setAuth('your-jwt-token');
// await api.upload('/files', fileInput.files[0], { description: 'Avatar' });

// With options:
// await api.get('/users', { timeout: 5000, headers: { 'Custom': 'value' } });
// await api.post('/users', { name: 'John' }, { timeout: 15000 });
// await api.delete('/users/1', { headers: { 'X-Confirm': 'true' } });

// With fetch options:
// await api.get('/users', { credentials: 'include', mode: 'cors' });
// await api.post('/login', { email, password }, { credentials: 'include' });
// await api.get('/data', { cache: 'no-cache', credentials: 'same-origin' });