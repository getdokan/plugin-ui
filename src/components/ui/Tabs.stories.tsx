import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-100">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for tab 1.</TabsContent>
      <TabsContent value="tab2">Content for tab 2.</TabsContent>
      <TabsContent value="tab3">Content for tab 3.</TabsContent>
    </Tabs>
  ),
};

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="a" className="w-100">
      <TabsList variant="line">
        <TabsTrigger value="a">Account</TabsTrigger>
        <TabsTrigger value="b">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Account settings.</TabsContent>
      <TabsContent value="b">Password settings.</TabsContent>
    </Tabs>
  ),
};

export const ActiveWhiteBackground: Story = {
  render: () => (
    <div className="rounded-lg">
      <Tabs defaultValue="tab1" className="w-100">
        <TabsList activeColor="white">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content for tab 1.</TabsContent>
        <TabsContent value="tab2">Content for tab 2.</TabsContent>
        <TabsContent value="tab3">Content for tab 3.</TabsContent>
      </Tabs>
    </div>
  ),
};
