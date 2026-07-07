interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY as string | undefined;

  if (!apiKey) {
    console.log(`[Email] No Resend API key configured. Logging email:`);
    console.log(`  To: ${payload.to}`);
    console.log(`  Subject: ${payload.subject}`);
    console.log(`  Body: ${payload.body.substring(0, 200)}...`);
    return { ok: true, id: 'mock-' + Date.now() };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'recruitai@yourplatform.com',
        to: payload.to,
        subject: payload.subject,
        text: payload.body,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: err };
    }

    const data = await res.json();
    return { ok: true, id: data.id };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function sendCredentialsEmail(to: string, companyId: string, rollNumber: string) {
  return sendEmail({
    to,
    subject: 'Your Assessment Credentials — RecruitAI',
    body: `Hi,

You have been shortlisted for the next stage.

To access your secure proctored assessment, visit:
${import.meta.env.VITE_APP_URL || 'http://localhost:3000'}/test

Enter the following credentials:
  Company ID: ${companyId}
  Joint Roll Number: ${rollNumber}

This link is single-use. Do not share your credentials.

Best regards,
RecruitAI Team`,
  });
}

export async function sendResultNotificationEmail(to: string, companyId: string, rollNumber: string) {
  return sendEmail({
    to,
    subject: 'Your Assessment Results Are Ready — RecruitAI',
    body: `Hi,

Your technical assessment results have been compiled and are now available for review.

Visit the main portal to view your scores:
${import.meta.env.VITE_APP_URL || 'http://localhost:3000'}

Use your credentials:
  Company ID: ${companyId}
  Joint Roll Number: ${rollNumber}

Best regards,
RecruitAI Team`,
  });
}
