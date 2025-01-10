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
}

export function ImageAttentionPattern({
  image,
  attention,
  gridDimensions,
  selectedToken,
  maxValue = 1,
  minValue = 0
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
        const attentionValue = attention[selectedToken][idx];
        const opacity = (attentionValue - minValue) / (maxValue - minValue);

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              top: `${(row / rows) * 100}%`,
              left: `${(col / cols) * 100}%`,
              width: `${100 / cols}%`,
              height: `${100 / rows}%`
            }}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoveredValue({
                value: attentionValue,
                x: rect.left + rect.width / 2,
                y: rect.top,
                destIdx: idx
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
            <div
              style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "2px 6px",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: "bold",
                zIndex: 1
              }}
            >
              {idx}
            </div>
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
          }\nDest: ${selectedToken}\nVal: ${hoveredValue.value.toFixed(3)}`}
        </div>
      )}
    </div>
  );
}
