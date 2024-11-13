const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.GH_TOKEN });
const eventPayload = require(process.env.GITHUB_EVENT_PATH);

async function respondToIssue(issue, repository) {
  let responseMessage;

  console.log(`Received issue #${issue.number}: "${issue.title}"`);

  // Check for keywords in the issue title or body
  if (issue.title.includes("bug") || issue.body.includes("bug")) {
    responseMessage = `Hi @${issue.user.login}, it looks like you've reported a bug. We'll investigate this issue shortly.`;
    console.log("Responding to a bug report.");
  } else if (issue.title.includes("feature") || issue.body.includes("feature")) {
    responseMessage = `Hi @${issue.user.login}, thanks for suggesting a new feature! We'll review your suggestion.`;
    console.log("Responding to a feature request.");
  } else {
    responseMessage = `Hi @${issue.user.login}, thanks for your issue submission! We'll get back to you soon.`;
    console.log("General response to issue.");
  }

  // Respond to the issue
  await octokit.issues.createComment({
    owner: repository.owner.login,
    repo: repository.name,
    issue_number: issue.number,
    body: responseMessage
  });
  console.log(`Commented on issue #${issue.number}`);
}

async function createNewIssue(owner, repo) {
  const title = "Automated Issue";
  const body = "This is an issue created automatically by the GitHub bot.";

  console.log("Attempting to create a new issue.");

  try {
    const newIssue = await octokit.issues.create({
      owner,
      repo,
      title,
      body
    });
    console.log(`Created new issue: ${newIssue.data.html_url}`);
  } catch (error) {
    console.error(`Error creating issue: ${error}`);
  }
}

async function main() {
  const { action, issue, repository } = eventPayload;

  if (action === 'opened') {
    // Respond to issues based on keywords
    await respondToIssue(issue, repository);
  }

  // Automatically create a new issue under certain conditions
  if (/* your condition here */) {
    await createNewIssue(repository.owner.login, repository.name);
  }
}

main().catch(console.error);
