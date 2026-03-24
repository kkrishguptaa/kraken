const LOOPS_API_KEY = process.env.LOOPS_API_KEY;

export async function createLoopContact(
  email: string,
  firstName?: string,
  tags: string[] = [],
) {
  if (!LOOPS_API_KEY) return;

  await fetch("https://app.loops.so/api/v1/contacts/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      firstName,
      userGroup: "Kraken News",
      source: "Kraken News App",
      subscribed: true,
      tags,
    }),
  });
}

export async function updateLoopContact(email: string, tags: string[]) {
  if (!LOOPS_API_KEY) return;

  await fetch("https://app.loops.so/api/v1/contacts/update", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      tags,
    }),
  });
}

export async function sendTransactionalEmail(
  email: string,
  transactionalId: string,
  dataVariables: Record<string, string | number | boolean>,
) {
  if (!LOOPS_API_KEY) return;

  await fetch("https://app.loops.so/api/v1/transactional", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      transactionalId,
      dataVariables,
    }),
  });
}

export async function sendIssueBroadcast(
  publicationName: string,
  issueTitle: string,
  editionNumber: number,
  content: string,
  tag: string,
) {
  if (!LOOPS_API_KEY) return;

  // In Loops, you can send an event to trigger a campaign/transactional email for a segment
  await fetch("https://app.loops.so/api/v1/events/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventName: "issue_published",
      mailingList: tag, // Segment by tag
      dataVariables: {
        publicationName,
        issueTitle,
        editionNumber,
        content,
      },
    }),
  });
}
