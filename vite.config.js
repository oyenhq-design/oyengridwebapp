import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      {
        name: 'api-invite-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            console.log('Vite middleware incoming:', req.url, 'method:', req.method);
            if (req.url.startsWith('/api/invite') && req.method === 'POST') {
              console.log('Server received /api/invite request');
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                console.log('Request body read completed. Length:', body.length);
                try {
                  if (!body) {
                    throw new Error('Empty request body');
                  }
                  const data = JSON.parse(body);
                  console.log('Parsed request body data:', data);
                  const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY || 're_ggTsAgcx_HjbWjvBcWKqAFoWcdYFpCC3k';
                  if (!apiKey) {
                    console.error('RESEND_API_KEY is missing');
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'RESEND_API_KEY environment variable is not configured' }));
                    return;
                  }

                  console.log('Sending email via Resend API to:', data.email);
                  const resendResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${apiKey}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      from: 'OYEN GRID <onboarding@resend.dev>',
                      to: data.email,
                      subject: `Invitation to join ${data.orgName || 'OYEN GRID'}`,
                      html: `
                        <div style="font-family: sans-serif; background-color: #090a0f; color: #fff; padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); max-width: 500px; margin: 0 auto;">
                          <h2 style="color: #D4AF37; margin-top: 0;">You've been invited!</h2>
                          <p style="color: rgba(255,255,255,0.85); font-size: 0.95rem; line-height: 1.5;">
                            You have been invited to join <strong>${data.orgName || 'OYEN GRID'}</strong> as a <strong>${data.role}</strong>.
                          </p>
                          <div style="margin: 2rem 0; text-align: center;">
                            <a href="${data.inviteLink}" style="background: linear-gradient(135deg, #D4AF37 0%, #C49A2A 100%); color: #000; text-decoration: none; padding: 0.8rem 1.8rem; border-radius: 8px; font-weight: 700; display: inline-block; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(212,175,55,0.25);">
                              Accept Invitation
                            </a>
                          </div>
                          <p style="color: rgba(255,255,255,0.4); font-size: 0.8rem; line-height: 1.4; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; margin-top: 1.5rem;">
                            Organization Code: <strong>${data.orgId}</strong><br/>
                            Invitation Code: <strong>${data.inviteCode}</strong><br/>
                            If you cannot click the button above, copy and paste this link in your browser:<br/>
                            <a href="${data.inviteLink}" style="color: #D4AF37; text-decoration: underline; word-break: break-all;">${data.inviteLink}</a>
                          </p>
                        </div>
                      `
                    })
                  });

                  const resendResult = await resendResponse.json();
                  console.log('Resend API response status:', resendResponse.status, resendResult);
                  if (resendResponse.ok) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true, messageId: resendResult.id }));
                  } else {
                    res.statusCode = resendResponse.status;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: resendResult.message || 'Resend delivery failed' }));
                  }
                } catch (err) {
                  console.error('Server middleware error:', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ]
  };
});
