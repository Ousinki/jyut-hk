import { NextRequest, NextResponse } from 'next/server';
import { sendFeedbackEmail, FeedbackAttachment } from '@/lib/mailer';

// CORS response helper
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let message = '';
    let email = '';
    let source = 'Chrome 擴展 & 官網門戶';
    let version = '1.5.8';
    let subject = '';
    const attachments: FeedbackAttachment[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      message = (formData.get('message') as string) || (formData.get('content') as string) || '';
      email = (formData.get('email') as string) || '';
      source = (formData.get('source') as string) || (formData.get('from_name') as string) || source;
      version = (formData.get('version') as string) || version;
      subject = (formData.get('subject') as string) || '';

      const fileKeys = ['attachment', 'attachment_2', 'attachment_3', 'file', 'image', 'screenshot'];
      for (const key of fileKeys) {
        const file = formData.get(key);
        if (file && typeof file === 'object' && 'arrayBuffer' in file) {
          const blob = file as File;
          const buffer = Buffer.from(await blob.arrayBuffer());
          attachments.push({
            filename: blob.name || `screenshot_${attachments.length + 1}.png`,
            content: buffer,
            contentType: blob.type || 'image/png',
          });
        }
      }
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      message = body.message || body.content || body.description || '';
      email = body.email || '';
      source = body.source || body.from_name || source;
      version = body.version || version;
      subject = body.subject || '';
    }

    if (!message.trim()) {
      return NextResponse.json(
        { success: false, message: '反饋內容不能為空' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Combine subject into message if present
    const finalMessage = subject ? `【主題】：${subject}\n\n${message}` : message;

    const result = await sendFeedbackEmail({
      email,
      message: finalMessage,
      attachments,
      source,
      version,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error: unknown) {
    console.error('Feedback API error:', error);
    const errMessage = error instanceof Error ? error.message : '伺服器內部錯誤';
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 500, headers: corsHeaders() }
    );
  }
}
