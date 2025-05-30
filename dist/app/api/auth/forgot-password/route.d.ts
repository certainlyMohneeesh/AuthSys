import { NextResponse } from "next/server";
export declare function POST(req: Request): Promise<NextResponse<{
    message: string;
}>>;
