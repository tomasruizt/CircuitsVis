import React from "react";

interface ImageAttentionPatternProps {
  /**
   * The source image URL or base64 string
   */
  image: string;

  /**
   * Attention values matrix [dest_pos x src_pos]
   */
  attention: number[][];

  /**
   * Grid dimensions for the image [rows, cols]
   */
  gridDimensions: [number, number];

  /**
   * Currently selected token index in the zoomed view
   */
  selectedToken: number;

  /**
   * Maximum attention value for normalization
   * @default 1
   */
  maxValue?: number;

  /**
   * Minimum attention value for normalization
   * @default 0
   */
  minValue?: number;

  /**
   * Starting index of image tokens in the sequence
   * @default 0
   */
  imageTokensStart?: number;

  /**
   * Callback when a grid element is clicked
   */
  onTokenClick?: (tokenIdx: number) => void;
}

export function ImageAttentionPattern({
  image,
  attention,
  gridDimensions,
  selectedToken,
  maxValue = 1,
  minValue = 0,
  imageTokensStart = 0,
  onTokenClick
}: ImageAttentionPatternProps) {
  const [rows, cols] = gridDimensions;
  const [imageAspectRatio, setImageAspectRatio] = React.useState(1);
  const [hoveredValue, setHoveredValue] = React.useState<{
    value: number;
    x: number;
    y: number;
    destIdx: number;
  } | null>(null);

  // Load image to get its dimensions
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageAspectRatio(img.width / img.height);
    };
    img.src = image;
  }, [image]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: imageAspectRatio
      }}
    >
      {Array.from({ length: rows * cols }).map((_, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const actualIdx = idx + imageTokensStart; // Adjust index for image token position
        const attentionValue = attention[selectedToken][actualIdx];
        const opacity = (attentionValue - minValue) / (maxValue - minValue);

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              top: `${(row / rows) * 100}%`,
              left: `${(col / cols) * 100}%`,
              width: `${100 / cols}%`,
              height: `${100 / rows}%`,
              cursor: onTokenClick ? "pointer" : "default"
            }}
            onClick={() => onTokenClick?.(actualIdx)} // Pass adjusted index
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoveredValue({
                value: attentionValue,
                x: rect.left + rect.width / 2,
                y: rect.top,
                destIdx: actualIdx // Use adjusted index
              });
            }}
            onMouseLeave={() => setHoveredValue(null)}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${image})`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                backgroundPosition: `${-col * 100}% ${-row * 100}%`,
                opacity
              }}
            />
          </div>
        );
      })}
      {hoveredValue && (
        <div
          style={{
            position: "fixed",
            left: hoveredValue.x,
            top: hoveredValue.y - 30,
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            pointerEvents: "none",
            zIndex: 1000,
            whiteSpace: "pre-line"
          }}
        >
          {`Src: ${
            hoveredValue.destIdx
          }\nDest: ${selectedToken}\nVal: ${parseFloat(
            hoveredValue.value.toFixed(5)
          )}`}
        </div>
      )}
    </div>
  );
}
