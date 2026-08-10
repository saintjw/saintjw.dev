import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #f4effc 0%, #e8defc 50%, #d3e6fb 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 32,
            color: "#b39ddb",
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#b39ddb",
              color: "white",
            }}
          >
            s.
          </div>
          saintjw.dev
        </div>
        <div
          style={{
            fontSize: 60,
            color: "#3f3a52",
            fontWeight: 800,
            lineHeight: 1.25,
          }}
        >
          Portfolio · Blog · Mini Games
        </div>
      </div>
    ),
    { ...size }
  );
}
