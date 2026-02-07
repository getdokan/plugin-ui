import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./input-otp";

const meta = {
  title: "UI/InputOTP",
  component: InputOTP,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof InputOTP>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputOTPGroup>
      <InputOTP maxLength={6}>
        {({ slots }) =>
          slots.map((slot, i) => (
            <React.Fragment key={slot.index}>
              <InputOTPSlot index={slot.index}>{slot.char}</InputOTPSlot>
              {i < slots.length - 1 && <InputOTPSeparator />}
            </React.Fragment>
          ))
        }
      </InputOTP>
    </InputOTPGroup>
  ),
};
