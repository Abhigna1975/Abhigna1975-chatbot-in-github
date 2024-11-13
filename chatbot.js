const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.GH_TOKEN });
const eventPayload = require(process.env.GITHUB_EVENT_PATH);

async function main() {
  const { action, issue, repository } = eventPayload;

  if (action === 'opened') {
    let responseMessage;

    // Check for keywords in the issue title or body
    if (issue.title.includes("bug") || issue.body.includes("bug")) {
      responseMessage = `Hi @${issue.user.login}, it looks like you've reported a bug. We'll investigate this issue shortly.`;
    } else if (issue.title.includes("feature") || issue.body.includes("feature")) {
      responseMessage = `Hi @${issue.user.login}, thanks for suggesting a new feature! We'll review your suggestion.`;
    } else {
      responseMessage = `Hi @${issue.user.login}, thanks for your issue submission! We'll get back to you soon.`;
    }

    // Respond to the issue
    await octokit.issues.createComment({
      owner: repository.owner.login,
      repo: repository.name,
      issue_number: issue.number,
      body: responseMessage
    });
  }
}

main().catch(console.error);
