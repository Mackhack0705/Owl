export async function findLinkedPr(
  owner: string,
  repo: string,
  issueNumber: number
) {
  const response = await fetch(
    `https://api.github.com/search/issues?q=repo:${owner}/${repo}+is:pr+${issueNumber}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      }
    }
  )

  const data = await response.json()

  return data.items?.[0] || null
}