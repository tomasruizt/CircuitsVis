import React from "react";
import { Col, Container, Row } from "react-grid-system";
import { AttentionPattern } from "./AttentionPattern";
import { useHoverLock, UseHoverLockState } from "./components/useHoverLock";
import { ImageAttentionPattern } from "./ImageAttentionPattern";

/**
 * Attention head color
 *
 * @param idx Head index
 * @param numberOfHeads Number of heads
 * @param alpha Opaqueness (0% = fully transparent, 100% = fully opaque)
 */
export function attentionHeadColor(
  idx: number,
  numberOfHeads: number,
  alpha: string = "100%"
): string {
  const hue = Math.round((idx / numberOfHeads) * 360);

  return `hsla(${hue}, 70%, 50%,  ${alpha})`;
}

/**
 * Attention Heads Selector
 */
export function AttentionHeadsSelector({
  attention,
  attentionHeadNames,
  focused,
  maxValue,
  minValue,
  onClick,
  onMouseEnter,
  onMouseLeave,
  imageGridDimensions,
  imageTokensStart = 0,
  visualizationImage,
  selectedToken
}: AttentionHeadsProps & {
  attentionHeadNames: string[];
  selectedToken: number;
} & UseHoverLockState) {
  return (
    <Row style={{ marginBottom: 15 }}>
      {attention.map((headAttention, idx) => {
        const isFocused = focused === idx;

        return (
          <Col lg={1} md={2} xs={3} style={{ margin: 0, padding: 0 }} key={idx}>
            <div
              style={{ padding: 3 }}
              onClick={() => onClick(idx)}
              onMouseEnter={() => onMouseEnter(idx)}
              onMouseLeave={onMouseLeave}
            >
              <div
                style={{
                  position: "relative",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: attentionHeadColor(idx, attention.length),
                  boxShadow: isFocused
                    ? `0px 0px 4px 3px ${attentionHeadColor(
                        idx,
                        attention.length,
                        "60%"
                      )}`
                    : undefined
                }}
              >
                <h4
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    zIndex: 100,
                    margin: 0,
                    padding: 1,
                    background: attentionHeadColor(idx, attention.length),
                    color: "white"
                  }}
                >
                  {attentionHeadNames[idx]}
                </h4>

                {visualizationImage && (
                  <ImageAttentionPattern
                    image={visualizationImage}
                    attention={headAttention}
                    gridDimensions={imageGridDimensions}
                    selectedToken={selectedToken}
                    maxValue={maxValue}
                    minValue={minValue}
                    imageTokensStart={imageTokensStart}
                  />
                )}
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
}

/**
 * Attention patterns from destination to source tokens, for a group of heads.
 *
 * Displays a small heatmap for each attention head. When one is selected, it is
 * then shown in full size.
 */
export function AttentionHeads({
  attention,
  attentionHeadNames,
  maxValue,
  minValue,
  negativeColor,
  positiveColor,
  maskUpperTri = true,
  tokens,
  visualizationImage,
  imageGridDimensions = [0, 0],
  imageTokensStart = 0
}: AttentionHeadsProps) {
  // Attention head focussed state
  const { focused, onClick, onMouseEnter, onMouseLeave } = useHoverLock(0);
  // Initialize with the last token index
  const [selectedToken, setSelectedToken] = React.useState(tokens.length - 1);

  // Calculate image token range
  const [rows, cols] = imageGridDimensions;
  const imageTokenCount = rows * cols;
  const imageTokensEnd = imageTokensStart + imageTokenCount;

  // Get text tokens by excluding the image token range
  const textTokens = [
    ...tokens.slice(0, imageTokensStart),
    ...tokens.slice(imageTokensEnd)
  ];

  // Update attention patterns to exclude image tokens
  const textAttention = attention.map((head) => {
    const destWithoutImage = [
      ...head.slice(0, imageTokensStart),
      ...head.slice(imageTokensEnd)
    ];
    return destWithoutImage.map((row) => [
      ...row.slice(0, imageTokensStart),
      ...row.slice(imageTokensEnd)
    ]);
  });

  const headNames =
    attentionHeadNames || attention.map((_, idx) => `Head ${idx}`);

  // Update the token click handler to account for the image token offset
  const handleTextTokenClick = (idx: number) => {
    const actualIdx = idx >= imageTokensStart ? idx + imageTokenCount : idx;
    setSelectedToken(actualIdx);
  };

  return (
    <Container>
      <h3 style={{ marginBottom: 15 }}>
        Head Selector (hover to view, click to lock)
      </h3>

      <AttentionHeadsSelector
        attention={attention}
        attentionHeadNames={headNames}
        focused={focused}
        maxValue={maxValue}
        minValue={minValue}
        negativeColor={negativeColor}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        positiveColor={positiveColor}
        maskUpperTri={maskUpperTri}
        tokens={tokens}
        imageGridDimensions={imageGridDimensions}
        imageTokensStart={imageTokensStart}
        visualizationImage={visualizationImage}
        selectedToken={selectedToken}
      />

      <p style={{ marginBottom: 20, textAlign: "center" }}>
        Click any element in either grid below to select the
        &quot;destination&quot; token for attention. The image grid shows image
        &quot;source&quot; tokens, while the text grid shows text
        &quot;source&quot; tokens.
      </p>

      <Row>
        <Col xs={6}>
          <h3 style={{ marginBottom: 10 }}>
            {`Attention for Destination token idx=${selectedToken}: "${tokens[selectedToken]}"`}
          </h3>
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {visualizationImage && (
              <ImageAttentionPattern
                image={visualizationImage}
                attention={attention[focused]}
                gridDimensions={imageGridDimensions}
                selectedToken={selectedToken}
                maxValue={maxValue}
                minValue={minValue}
                onTokenClick={setSelectedToken}
                imageTokensStart={imageTokensStart}
              />
            )}
          </div>
        </Col>
        <Col xs={6}>
          <h3 style={{ marginBottom: 10 }}>{headNames[focused]} Zoomed</h3>
          <div style={{ position: "relative" }}>
            <h2
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 1000,
                margin: 6,
                padding: "5px 10px",
                background: attentionHeadColor(focused, attention.length),
                color: "white"
              }}
            >
              {headNames[focused]}
            </h2>
            <div>
              <AttentionPattern
                attention={textAttention[focused]}
                maxValue={maxValue}
                minValue={minValue}
                negativeColor={negativeColor}
                positiveColor={positiveColor}
                zoomed={true}
                maskUpperTri={maskUpperTri}
                tokens={textTokens}
                onTokenClick={handleTextTokenClick}
              />
            </div>
          </div>
        </Col>
      </Row>

      <Row></Row>
    </Container>
  );
}

export interface AttentionHeadsProps {
  /**
   * Attention heads activations
   *
   * Of the shape [ heads x dest_pos x src_pos ]
   */
  attention: number[][][];

  /**
   * Names for each attention head
   *
   * Useful if e.g. you want to label the heads with the layer they are from.
   */
  attentionHeadNames?: string[];

  /**
   * Maximum value
   *
   * Used to determine how dark the token color is when positive (i.e. based on
   * how close it is to the maximum value).
   *
   * @default Math.max(...values)
   */
  maxValue?: number;

  /**
   * Minimum value
   *
   * Used to determine how dark the token color is when negative (i.e. based on
   * how close it is to the minimum value).
   *
   * @default Math.min(...values)
   */
  minValue?: number;

  /**
   * Negative color
   *
   * Color to use for negative values. This can be any valid CSS color string.
   *
   * Be mindful of color blindness if not using the default here.
   *
   * @default red
   *
   * @example rgb(255, 0, 0)
   *
   * @example #ff0000
   */
  negativeColor?: string;

  /**
   * Positive color
   *
   * Color to use for positive values. This can be any valid CSS color string.
   *
   * Be mindful of color blindness if not using the default here.
   *
   * @default blue
   *
   * @example rgb(0, 0, 255)
   *
   * @example #0000ff
   */
  positiveColor?: string;

  /**
   * Mask upper triangular
   *
   * Whether or not to mask the upper triangular portion of the attention patterns.
   *
   * Should be true for causal attention, false for bidirectional attention.
   *
   * @default true
   */
  maskUpperTri?: boolean;

  /**
   * Show axis labels
   */
  showAxisLabels?: boolean;

  /**
   * List of tokens
   *
   * Must be the same length as the list of values.
   */
  tokens: string[];

  /**
   * URL or base64 string for the visualization image
   * Can be a remote URL, local asset path, or base64 encoded image
   *
   * @example "https://example.com/image.jpg"
   * @example "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
   */
  visualizationImage?: string;

  /**
   * Grid dimensions for the image visualization [rows, cols]
   * Only the first rows×cols tokens will be used for the image visualization
   * @example [4, 4] for a 4×4 grid
   */
  imageGridDimensions?: [number, number];

  /**
   * Starting index of the contiguous image tokens in the sequence
   * @default 0
   */
  imageTokensStart?: number;
}
