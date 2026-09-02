import nodemailer from 'nodemailer';

export interface FeedbackAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export interface FeedbackData {
  email?: string;
  message: string;
  source?: string;
  version?: string;
  attachments?: FeedbackAttachment[];
}

export async function sendFeedbackEmail(data: FeedbackData): Promise<{ success: boolean; message: string }> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.SMTP_TO || 'support@ousin.cn';
  const from = process.env.SMTP_FROM || user || 'contact@jyut.hk';

  // Format HTML content with JYUT.HK branding (pure SVG icons, no emoji, bulletproof email layout)
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const escapedMessage = data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Clean inline SVG icons (100% email client compatible)
  const iconMail = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; display:inline-block; margin-right:5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
  const iconPackage = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; display:inline-block; margin-right:5px;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>`;
  const iconClock = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; display:inline-block; margin-right:4px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  const iconChat = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px; display:inline-block; margin-right:6px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
  const iconPaperclip = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; display:inline-block; margin-right:5px;"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`;
  const iconExternal = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px; display:inline-block; margin-left:3px;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
  const iconInbox = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; display:inline-block; margin-right:4px;"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`;

  const html = `
    <div style="background-color: #f1f5f9; padding: 24px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang HK', 'PingFang TC', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif;">
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="max-width: 580px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
        
        <!-- Header: Clean Deep Burgundy Header -->
        <tr>
          <td style="background-color: #8A1C1C; padding: 18px 24px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="vertical-align: middle; width: 36px;">
                  <img src="https://jyut.hk/icon128.png" width="32" height="32" alt="JYUT.HK" style="display: block; width: 32px; height: 32px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2);" />
                </td>
                <td style="vertical-align: middle; padding-left: 12px;">
                  <span style="color: #ffffff; font-size: 17px; font-weight: 700; letter-spacing: 0.5px;">JYUT.HK</span>
                  <span style="color: rgba(255,255,255,0.65); font-size: 13px; margin-left: 8px;">粵語學習空間</span>
                </td>
                <td style="vertical-align: middle; text-align: right;">
                  <span style="background-color: rgba(255,255,255,0.15); color: #ffffff; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 500; letter-spacing: 0.3px;">反饋通知</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Main Body -->
        <tr>
          <td style="padding: 24px;">
            
            <!-- Meta Bar: Status & Time -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
              <tr>
                <td style="vertical-align: middle;">
                  <span style="display: inline-block; background-color: #fdf2f2; color: #8A1C1C; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; border: 1px solid #fee2e2;">
                    ${iconInbox}新反饋工單
                  </span>
                </td>
                <td style="vertical-align: middle; text-align: right; color: #64748b; font-size: 12px;">
                  ${iconClock}${timestamp}
                </td>
              </tr>
            </table>

            <!-- User Info Grid (2 Columns) -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
              <tr>
                <td style="padding: 12px 14px; background-color: #fdf2f2; border: 1px solid #fee2e2; border-radius: 8px; width: 48%; vertical-align: top;">
                  <div style="color: #8A1C1C; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                    ${iconMail}用戶聯絡郵箱
                  </div>
                  <div style="font-size: 13px; font-weight: 500; color: #1e293b; word-break: break-all;">
                    ${data.email ? `<a href="mailto:${data.email}" style="color: #8A1C1C; text-decoration: none; font-weight: 600;">${data.email}</a>` : '<span style="color: #94a3b8; font-style: italic;">未填寫聯絡方式</span>'}
                  </div>
                </td>
                <td style="width: 4%;"></td>
                <td style="padding: 12px 14px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; width: 48%; vertical-align: top;">
                  <div style="color: #475569; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                    ${iconPackage}客戶端來源
                  </div>
                  <div style="font-size: 13px; font-weight: 600; color: #1e293b;">
                    ${data.source || 'Chrome 擴展 & 官網'}
                    <span style="font-size: 11px; font-weight: normal; color: #64748b; background-color: #e2e8f0; padding: 1px 5px; border-radius: 3px; margin-left: 4px;">v${data.version || '1.5.8'}</span>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Feedback Message Content -->
            <div style="margin-bottom: 20px;">
              <div style="color: #1e293b; font-size: 13px; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center;">
                ${iconChat}反饋詳細內容
              </div>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #8A1C1C; padding: 14px 16px; border-radius: 0 8px 8px 0; font-size: 14px; color: #1e293b; line-height: 1.75; white-space: pre-wrap; word-break: break-word;">${escapedMessage}</div>
            </div>

            ${data.attachments && data.attachments.length > 0 ? `
            <!-- Attachments Notice -->
            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px;">
              <span style="color: #92400e; font-size: 13px; font-weight: 600;">
                ${iconPaperclip}附帶截圖附件 (${data.attachments.length} 張)
              </span>
              <span style="color: #b45309; font-size: 12px; margin-left: 6px;">
                請於郵件附件中直接預覽或下載
              </span>
            </div>
            ` : ''}

            <!-- Quick Reply Hint -->
            <div style="border-top: 1px dashed #e2e8f0; padding-top: 14px; color: #64748b; font-size: 12px; line-height: 1.5;">
              ${data.email ? '提示：直接點擊郵件客戶端的「回覆」按鈕即可向該用戶發送解答。' : '提示：該用戶為匿名提交，未提供回覆郵箱。'}
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 24px; text-align: center;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="text-align: left; color: #94a3b8; font-size: 11px;">
                  © JYUT.HK · 粵語懸浮詞典
                </td>
                <td style="text-align: right;">
                  <a href="https://jyut.hk" style="color: #64748b; font-size: 11px; text-decoration: none; font-weight: 500;">
                    訪問官方網站${iconExternal}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </div>
  `;

  // If SMTP is configured, send real email
  if (host && user && pass) {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailAttachments = (data.attachments || []).map((att) => ({
      filename: att.filename,
      content: att.content,
      contentType: att.contentType,
    }));

    const sender = user || from;

    await transporter.sendMail({
      from: `"JYUT.HK 粵語學習空間" <${sender}>`,
      to,
      replyTo: data.email || undefined,
      subject: `[用户反馈] ${data.email ? data.email + ' : ' : ''}${data.message.slice(0, 30)}...`,
      html,
      attachments: mailAttachments,
    });

    return { success: true, message: '反馈邮件已成功投递！' };
  } else {
    // Development fallback
    console.log('[Feedback Mailer Dev Mode] Simulated sending feedback:');
    console.log({ email: data.email, message: data.message, attachmentsCount: data.attachments?.length || 0 });
    return { success: true, message: '（开发模拟）反馈已记录成功！' };
  }
}
