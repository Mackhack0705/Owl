import {
  NextRequest,
  NextResponse
} from "next/server"

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json()

    const githubUrl = body.url

    const split = githubUrl
      .replace(
        "https://github.com/",
        ""
      )
      .split("/")

    const owner = split[0]
    const repo = split[1]

    if (!owner || !repo) {
      return NextResponse.json(
        {
          error:
            "Invalid GitHub URL"
        },
        { status: 400 }
      )
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/labels`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept:
            "application/vnd.github+json"
        }
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Failed to fetch labels"
        },
        { status: 500 }
      )
    }

    const labels =
      await response.json()

    return NextResponse.json(
      labels
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          "Something went wrong"
      },
      { status: 500 }
    )
  }
}