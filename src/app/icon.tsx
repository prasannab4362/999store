import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111318",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        {/* Simplified V2 Brand Interlocking circles representation */}
        <div
          style={{
            position: "absolute",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            border: "2px solid #315CFF",
            left: "4px",
            bottom: "4px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            border: "2px solid #D4C3A3",
            right: "4px",
            bottom: "4px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            border: "2px solid #FFFFFF",
            top: "4px",
            left: "9px",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
