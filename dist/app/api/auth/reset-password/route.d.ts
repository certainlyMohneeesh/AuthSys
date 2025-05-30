import { NextResponse } from "next/server";
export declare function POST(request: Request): Promise<NextResponse<{
    message: string;
}>>;
