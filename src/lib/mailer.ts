import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';

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
  const to = process.env.SMTP_TO || user || 'contact@jyut.hk';
  const from = process.env.SMTP_FROM || user || 'contact@jyut.hk';

  // Format HTML content with JYUT.HK branding (exact classic layout)
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });


  const escapedMessage = data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang HK', 'PingFang TC', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif; max-width: 640px; margin: 0 auto; background: #f8fafc;">

      <!-- Header: pre-rendered PNG image embedded via CID -->
      <div style="border-radius: 16px 16px 0 0; overflow: hidden;">
        <img src="cid:emailheader" width="640" alt="JYUT.HK 邮箱系统" style="display: block; width: 100%; height: auto; border: 0;" />
      </div>

      <!-- Main content card -->
      <div style="background: #ffffff; padding: 28px 32px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">

        <!-- Info lines -->
        <div style="margin-bottom: 20px; font-size: 14px; color: #334155; line-height: 2;">
          <div><span style="color: #64748b;">用戶郵箱：</span>${data.email ? `<a href="mailto:${data.email}" style="color: #B42929; text-decoration: none;">${data.email}</a>` : '<span style="color: #94a3b8;">（用戶未填寫）</span>'}</div>
          <div><span style="color: #64748b;">來源版本：</span>${data.source || 'Chrome 擴展 & 官網門戶'} v${data.version || '1.5.8'}</div>
          <div><span style="color: #64748b;">時間：</span>${timestamp}</div>
        </div>

        <!-- Feedback content -->
        <div style="margin-bottom: 24px;">
          <div style="color: #334155; font-size: 13px; font-weight: 600; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #fdf2f2;">反饋內容</div>
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
      <div style="background: #1e293b; padding: 20px; border-radius: 0 0 16px 16px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td style="vertical-align: middle;">
            <div style="color: rgba(255,255,255,0.6); font-size: 12px;">此郵件由 <span style="font-family: Cinzel, 'Times New Roman', Georgia, serif; font-weight: 700; color: rgba(255,255,255,0.8);">JYUT</span><span style="font-family: Cinzel, 'Times New Roman', Georgia, serif; font-weight: 700; color: #F59E0B;">.HK</span> 反饋系統發送</div>
            <div style="color: rgba(255,255,255,0.35); font-size: 11px; margin-top: 4px;">粵語懸浮詞典 Jyutping Hover Dictionary</div>
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
      from: `"JYUT.HK 粵語官網" <${sender}>`,
      to,
      replyTo: data.email || undefined,
      subject: `[用户反馈] ${data.email ? data.email + ' : ' : ''}${data.message.slice(0, 30)}...`,
      html,
      attachments: [
        // CID-embedded header image
        {
          filename: 'email-header.png',
          content: readFileSync(join(process.cwd(), 'public', 'email-header.png')),
          cid: 'emailheader',
        },
        ...mailAttachments,
      ],
    });

    return { success: true, message: '反馈邮件已成功投递！' };
  } else {
    // Development fallback
    console.log('[Feedback Mailer Dev Mode] Simulated sending feedback:');
    console.log({ email: data.email, message: data.message, attachmentsCount: data.attachments?.length || 0 });
    return { success: true, message: '（开发模拟）反馈已记录成功！' };
  }
}
