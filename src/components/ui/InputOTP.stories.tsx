import type { Meta } from "@storybook/react";
import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./input-otp";

const meta = {
  title: "UI/InputOTP",
  component: InputOTP,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof InputOTP>;

export default meta;

export const Default = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};
