import { createServerSupabaseClient } from '@/lib/supabase-config';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient(request);

    // Supabase 세션 확인
    const {
      data: { session },
    } = await supabase.auth.getSession();
    let user = null;
    if (session?.access_token) {
      const { data, error } = await supabase.auth.getUser(session.access_token);
      if (!error) {
        user = data.user;
      }
    }
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userAId = searchParams.get('userAId');
    const userBId = searchParams.get('userBId');
    const status = searchParams.get('status')?.split(',') || [];

    if (!userAId || !userBId) {
      return NextResponse.json({ error: 'Missing userAId or userBId parameter' }, { status: 400 });
    }

    // 현재 사용자가 두 사용자 중 하나인지 확인
    if (user.id !== userAId && user.id !== userBId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // ToDo: 쿼리 최적화 필요
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .or(`sender_id.eq.${userAId},sender_id.eq.${userBId}`)
      .or(`receiver_id.eq.${userAId},receiver_id.eq.${userBId}`)
      .in('status', status);

    if (error) {
      console.error('Error fetching requests:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // 두 사용자 간의 요청만 필터링
    const filteredRequests = (data || []).filter((req) => {
      if (!req.sender_id || !req.receiver_id || !req.status) {
        return false;
      }

      const isBetweenUsers =
        (req.sender_id === userAId && req.receiver_id === userBId) ||
        (req.sender_id === userBId && req.receiver_id === userAId);

      if (!isBetweenUsers) {
        return false;
      }

      return status.length === 0 || status.includes(req.status);
    });

    // 클라이언트 호환성을 위한 데이터 변환
    const transformedRequests = filteredRequests.map((req) => ({
      id: req.id,
      senderID: req.sender_id,
      receiverID: req.receiver_id,
      message: req.message,
      status: req.status,
      createdAt: req.created_at,
    }));

    return NextResponse.json({ requests: transformedRequests });
  } catch (error) {
    console.error('Error fetching requests between users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
