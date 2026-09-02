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

  // Format HTML content with JYUT.HK branding
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  // Inline SVG Bauhinia flower logo (matches site favicon)
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="36" height="36" style="vertical-align: middle;"><defs><g id="p"><path d="M 492.936 125.196 a 27.917 27.917 0 0 0 -14.902 41.792 a 45.171 45.171 0 0 1 -20.29 66.204 a 38.651 38.651 0 0 0 -10.816 64.313 A 90.342 90.342 0 0 1 492.936 125.196 Z"/></g></defs><g transform="translate(256,256) scale(1.38) translate(-450,-300)"><g fill="#B42929"><use href="#p" transform="rotate(0 450 300)"/><use href="#p" transform="rotate(72 450 300)"/><use href="#p" transform="rotate(144 450 300)"/><use href="#p" transform="rotate(216 450 300)"/><use href="#p" transform="rotate(288 450 300)"/></g></g></svg>`;

  const escapedMessage = data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang HK', 'PingFang TC', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif; max-width: 640px; margin: 0 auto; background: #f8fafc;">

      <!-- Header with gradient banner -->
      <div style="background: linear-gradient(135deg, #8A1C1C 0%, #B42929 50%, #D83131 100%); padding: 28px 32px; border-radius: 16px 16px 0 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td style="vertical-align: middle; width: 44px;">
            <div style="background: rgba(255,255,255,0.15); border-radius: 10px; padding: 4px; display: inline-block;">
              ${logoSvg}
            </div>
          </td>
          <td style="vertical-align: middle; padding-left: 14px;">
            <div style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">JYUT.HK</div>
            <div style="color: rgba(255,255,255,0.8); font-size: 13px; margin-top: 2px;">粵語學習空間 · 用戶反饋通知</div>
          </td>
        </tr></table>
      </div>

      <!-- Main content card -->
      <div style="background: #ffffff; padding: 28px 32px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">

        <!-- Timestamp badge -->
        <div style="margin-bottom: 24px;">
          <span style="background: #fdf2f2; color: #8A1C1C; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; letter-spacing: 0.3px;">📬 收到新反饋</span>
          <span style="color: #94a3b8; font-size: 12px; margin-left: 10px;">${timestamp}</span>
        </div>

        <!-- Info grid -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
          <tr>
            <td style="padding: 12px 16px; background: #fdf2f2; border-radius: 10px; width: 50%; vertical-align: top;">
              <div style="color: #8A1C1C; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">📧 用戶郵箱</div>
              <div style="color: #1e293b; font-size: 14px; font-weight: 500; word-break: break-all;">${data.email ? `<a href="mailto:${data.email}" style="color: #B42929; text-decoration: none;">${data.email}</a>` : '<span style="color: #94a3b8;">（用戶未填寫）</span>'}</div>
            </td>
            <td style="width: 12px;"></td>
            <td style="padding: 12px 16px; background: #f8fafc; border-radius: 10px; width: 50%; vertical-align: top; border: 1px solid #f1f5f9;">
              <div style="color: #475569; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">📦 來源版本</div>
              <div style="color: #1e293b; font-size: 14px; font-weight: 500;">${data.source || 'Chrome 擴展 & 官網門戶'}</div>
              <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">v${data.version || '1.5.8'}</div>
            </td>
          </tr>
        </table>

        <!-- Feedback content -->
        <div style="margin-bottom: 24px;">
          <div style="color: #334155; font-size: 13px; font-weight: 600; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #fdf2f2;">💬 反饋內容</div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #B42929; padding: 16px 20px; border-radius: 0 10px 10px 0; font-size: 14px; color: #1e293b; line-height: 1.75; white-space: pre-wrap;">${escapedMessage}</div>
        </div>

        ${data.attachments && data.attachments.length > 0 ? `
        <!-- Attachments notice -->
        <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 12px 16px; border-radius: 10px; margin-bottom: 8px;">
          <span style="font-size: 14px;">📎</span>
          <strong style="color: #92400e; font-size: 13px; margin-left: 4px;">附帶截圖 (${data.attachments.length} 張)</strong>
          <span style="color: #b45309; font-size: 12px; margin-left: 6px;">請查閱郵件附件</span>
        </div>
        ` : ''}
      </div>

      <!-- Footer -->
      <div style="background: #1e293b; padding: 20px 32px; border-radius: 0 0 16px 16px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td style="vertical-align: middle;">
            <div style="color: rgba(255,255,255,0.6); font-size: 12px;">此郵件由 <a href="https://jyut.hk" style="color: #f87171; text-decoration: none; font-weight: 600;">jyut.hk</a> 反饋系統自動發送</div>
            <div style="color: rgba(255,255,255,0.35); font-size: 11px; margin-top: 4px;">粵語懸浮詞典 · Cantonese Hover Dictionary</div>
          </td>
          <td style="text-align: right; vertical-align: middle;">
            <a href="https://jyut.hk" style="background: rgba(255,255,255,0.1); color: #f1f5f9; font-size: 12px; padding: 6px 16px; border-radius: 6px; text-decoration: none; font-weight: 500;">前往官網 →</a>
          </td>
        </tr></table>
      </div>
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
