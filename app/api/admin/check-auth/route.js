import { authorized } from '@/lib/auth';

export async function GET(req) {
  const isAuth = await authorized(req);
  return Response.json({ authorized: isAuth });
}
