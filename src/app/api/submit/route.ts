import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { content, fileUrl, userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: '用户ID是必需的' }, { status: 400 });
        }
        if (!content && !fileUrl) {
            return NextResponse.json({ message: '内容和文件不能都为空' }, { status: 400 });
        }
        
        const submissionId = `submission:${userId}:${Date.now()}`;
        
        const submissionData = {
            content,
            fileUrl,
            userId,
            createdAt: new Date().toISOString(),
        };

        await kv.set(submissionId, JSON.stringify(submissionData));

        return NextResponse.json({ message: '稿件提交成功！' }, { status: 200 });

    } catch (error) {
        console.error('提交失败:', error);
        return NextResponse.json({ message: '服务器内部错误' }, { status: 500 });
    }
}
