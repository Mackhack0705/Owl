export async function fetchIssues(owner: string, repo: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?sort=created&direction=desc&per_page=10`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      },
      cache: "no-store"
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch issues")
  }

  return response.json()
}