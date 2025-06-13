// 文件路径: src/app/api/submit/route.ts

import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

interface FileData {
    name: string;
    type: string;
    content: string; // Base64 encoded content
}

// 定义我们期望从前端接收的数据类型
interface SubmissionPayload {
    content: string;
    fileData: FileData | null;
    userId: string;
}

export async function POST(request: Request) {
    try {
        const { content, fileData, userId } = (await request.json()) as SubmissionPayload;

        if (!content) {
            return NextResponse.json({ message: '错误：内容不能为空。' }, { status: 400 });
        }
        if (!userId) {
            return NextResponse.json({ message: '错误：缺少用户信息。' }, { status: 400 });
        }

        // 创建一个唯一ID和时间戳
        const submissionId = `submission_${Date.now()}`;
        const timestamp = new Date().toISOString();

        const dataToStore = {
            id: submissionId,
            userId,
            content,
            file: fileData, // 存储整个文件对象
            createdAt: timestamp,
        };

        // 将稿件数据存储到Vercel KV中
        // 'submissions' 是一个列表的键名，我们将新的稿件推入这个列表
        await kv.lpush('submissions', JSON.stringify(dataToStore));

        return NextResponse.json({ message: '稿件提交成功！' }, { status: 200 });

    } catch (error) {
        console.error('API错误:', error);
        
        const errorMessage = error instanceof Error ? error.message : '服务器内部错误';
        return NextResponse.json({ message: '提交失败，请稍后再试。', details: errorMessage }, { status: 500 });
    }
}
