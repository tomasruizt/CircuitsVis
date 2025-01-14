import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { AttentionHeads } from "./AttentionHeads";
import { mockImageData } from "./mocks/attention";

export default {
  component: AttentionHeads,
  argTypes: {
    negativeColor: { control: "color" },
    positiveColor: { control: "color" },
    visualizationImage: {
      control: "text",
      description: "URL or base64 string of the visualization image"
    }
  }
} as ComponentMeta<typeof AttentionHeads>;

const Template: ComponentStory<typeof AttentionHeads> = (args) => (
  <AttentionHeads {...args} />
);

export const InductionHeadsLayer: ComponentStory<typeof AttentionHeads> =
  Template.bind({});
InductionHeadsLayer.args = {
  tokens: mockImageData.tokens,
  attention: mockImageData.attention,
  visualizationImage:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Huskiesatrest.jpg/2560px-Huskiesatrest.jpg",
  imageGridDimensions: mockImageData.image_grid_dimensions,
  minValue: mockImageData.attention_min,
  maxValue: mockImageData.attention_max,
  maskUpperTri: false
};
