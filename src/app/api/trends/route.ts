import { NextRequest, NextResponse } from 'next/server';

const SIMULATION_API = "http://localhost:8000/api/trends";

export async function GET(req: NextRequest) {
    try {
        const res = await fetch(SIMULATION_API, { next: { revalidate: 60 } });
        if (!res.ok) {
            // Fallback if simulation is offline
            return NextResponse.json({
                data: [
                    { tag: "#SystemOffline", volume: "low" },
                    { tag: "#CheckConnection", volume: "low" }
                ]
            });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Trends Fetch Error:", error);
        return NextResponse.json({ data: [] }, { status: 500 });
    }
}
