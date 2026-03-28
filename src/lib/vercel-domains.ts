type VercelDomainVerification = {
  type?: string;
  domain?: string;
  value?: string;
  reason?: string;
};

type VercelDomainResponse = {
  name?: string;
  verified?: boolean;
  verification?: VercelDomainVerification[];
  error?: {
    message?: string;
  };
};

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function getVercelContext() {
  return {
    token: getEnv("VERCEL_API_TOKEN"),
    projectId: getEnv("VERCEL_PROJECT_ID"),
    teamId: getEnv("VERCEL_TEAM_ID"),
  };
}

async function parseJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function addProjectDomain(domain: string) {
  const { token, projectId, teamId } = getVercelContext();

  const response = await fetch(
    `https://api.vercel.com/v10/projects/${projectId}/domains?teamId=${teamId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain }),
    },
  );

  const payload = await parseJson<VercelDomainResponse>(response);

  if (!response.ok) {
    const errorMessage = payload?.error?.message || "Failed to add domain on Vercel";
    throw new Error(errorMessage);
  }

  return {
    name: payload?.name || domain,
    verified: Boolean(payload?.verified),
    verification: payload?.verification || [],
  };
}

export async function verifyProjectDomain(domain: string) {
  const { token, projectId, teamId } = getVercelContext();

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}/verify?teamId=${teamId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const payload = await parseJson<VercelDomainResponse>(response);

  if (!response.ok) {
    const errorMessage = payload?.error?.message || "Failed to verify domain on Vercel";
    throw new Error(errorMessage);
  }

  return {
    verified: Boolean(payload?.verified),
    verification: payload?.verification || [],
  };
}

export async function removeProjectDomain(domain: string) {
  const { token, projectId, teamId } = getVercelContext();

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}?teamId=${teamId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const payload = await parseJson<VercelDomainResponse>(response);
    const errorMessage = payload?.error?.message || "Failed to remove domain from Vercel";
    throw new Error(errorMessage);
  }
}
