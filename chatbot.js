const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

// Load event data
const eventPayload = require(process.env.GITHUB_EVENT_PATH);

async function main() {
  const { action, issue, repository } = eventPayload;

  if (action === 'opened') {
    // Respond to new issues
    await octokit.issues.createComment({
      owner: repository.owner.login,
      repo: repository.name,
      issue_number: issue.number,
      body: `Hi @${issue.user.login}! Thank you for your issue. I'm here to help!`
    });
  }

  // Additional actions can be added here for more complex responses
}

main().catch(console.error);
