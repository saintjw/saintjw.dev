import { ImageResponse } from "next/og";

const SIZES = ["192", "512"];

export function generateStaticParams() {
  return SIZES.map((size) => ({ size }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size: raw } = await params;
  const size = SIZES.includes(raw) ? Number(raw) : 512;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#b39ddb",
          color: "white",
          fontSize: size * 0.34,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        1/n
      </div>
    ),
    { width: size, height: size }
  );
}
