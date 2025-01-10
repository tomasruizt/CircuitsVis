import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { AttentionPatterns } from "./AttentionPatterns";
import {
    mockAttention,
    mockShortAttention,
    mockShortPrompt,
    mockTokens
} from "./mocks/attention";

export default {
  title: "Attention/AttentionPatterns",
  component: AttentionPatterns,
  parameters: {
    layout: "padded"
  },
  argTypes: {
    tokens: { control: "object" },
    attention: { control: "object" },
    headLabels: { control: "object" }
  }
} as ComponentMeta<typeof AttentionPatterns>;

const Template: ComponentStory<typeof AttentionPatterns> = (args) => (
  <AttentionPatterns {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tokens: mockTokens,
  attention: mockAttention,
  headLabels: ["Head 0", "Head 1", "Head 2", "Head 3"]
};

export const ShortPrompt = Template.bind({});
ShortPrompt.args = {
  tokens: mockShortPrompt,
  attention: [mockShortAttention, mockShortAttention], // Duplicating to show multiple heads
  headLabels: ["Head A", "Head B"]
};

export const NoLabels = Template.bind({});
NoLabels.args = {
  tokens: mockTokens,
  attention: mockAttention,
  headLabels: undefined
};
