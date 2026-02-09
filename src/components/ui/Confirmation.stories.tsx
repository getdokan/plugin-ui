import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Modal, ModalTitle, Button, Notice } from "./index";
import { Minus, Info } from "lucide-react";
import { cn } from "@/lib/utils";

function LeaveWithUnsavedChangesDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Leave page</Button>
      <Modal open={open} onClose={() => setOpen(false)} className="border-0">
        <div className="flex flex-row items-center gap-3 px-8 pt-8 pb-4 text-left">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              "bg-violet-50 text-violet-600",
            )}
            aria-hidden
          >
            <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.413333" y="0.413333" width="54.1733" height="54.1733" rx="27.0867" fill="#EFEAFF" stroke="#EFEAFF" stroke-width="0.826667"/>
              <path d="M33.823 32.5947V22.4138C33.823 21.4667 32.9774 20.655 31.8951 20.655C31.6245 20.655 31.3877 20.6888 31.1848 20.7903V20.1476C31.1848 19.2005 30.3392 18.3888 29.2568 18.3888C28.8171 18.3888 28.445 18.5241 28.1406 18.727C27.8024 18.3211 27.2274 18.0505 26.6186 18.0505C25.7391 18.0505 25.0288 18.5917 24.7921 19.302C24.5553 19.2005 24.2847 19.1329 23.9803 19.1329C22.9318 19.1329 22.0524 19.9108 22.0524 20.8917V28.5359L21.3421 27.6565C20.6318 26.7094 19.2788 26.405 18.2641 26.9462C17.7567 27.2168 17.4185 27.6903 17.2832 28.2315C17.1479 28.8065 17.2832 29.3815 17.6553 29.855C18.2641 30.6668 18.9067 31.5124 19.5156 32.3241L20.6318 33.8124C20.8009 34.0153 20.9362 34.2521 21.1053 34.455C21.5788 35.1315 22.0862 35.808 22.7627 36.383C24.048 37.4654 25.8068 37.8712 27.4642 37.8712C28.2759 37.8712 29.0539 37.7698 29.7642 37.6345C33.823 36.7889 33.823 33.7447 33.823 32.5947ZM29.5274 36.5183C27.7686 36.8904 25.1303 36.8565 23.5406 35.5374C22.9994 35.0639 22.5597 34.455 22.0862 33.8124C21.9171 33.5756 21.7479 33.3389 21.5788 33.1359L20.4626 31.6477C19.8538 30.8359 19.2112 29.9903 18.6023 29.1785C18.4332 28.9756 18.3994 28.7388 18.4332 28.5021C18.467 28.2991 18.6023 28.13 18.8053 27.9947C19.3126 27.7241 20.0229 27.8932 20.3612 28.3668C20.3612 28.3668 20.3612 28.4006 20.395 28.4006L22.1877 30.5315C22.3568 30.7344 22.5935 30.8021 22.8303 30.7006C23.0671 30.5991 23.2362 30.3962 23.2362 30.1594V20.9256C23.2362 20.6211 23.5744 20.3506 23.9803 20.3506C24.3524 20.3506 24.6906 20.5873 24.6906 20.8917V21.027V21.0608V26.7771C24.6906 27.1153 24.9612 27.3859 25.2994 27.3859C25.6377 27.3859 25.9083 27.1153 25.9083 26.7771V20.9256C25.9083 20.8917 25.9083 20.8917 25.9083 20.8579V19.8432C25.9083 19.5388 26.2465 19.2682 26.6524 19.2682C27.0583 19.2682 27.3965 19.5388 27.3965 19.8432V20.1814V26.9124V27.0476C27.3965 27.3859 27.6671 27.6565 28.0053 27.6565C28.3436 27.6565 28.6142 27.3859 28.6142 27.0476V26.9124V20.1476C28.6142 19.8432 28.9524 19.5726 29.3583 19.5726C29.7642 19.5726 30.1024 19.8432 30.1024 20.1476V22.3123V22.38V23.2932V23.327V27.6565C30.1024 27.9947 30.373 28.2653 30.7112 28.2653C31.0495 28.2653 31.3201 27.9947 31.3201 27.6565V22.38C31.3539 22.0756 31.6583 21.8388 32.0304 21.8388C32.4362 21.8388 32.7745 22.1094 32.7745 22.4138V32.4933V32.6286C32.6392 33.7447 32.6392 35.8418 29.5274 36.5183Z" fill="#7047EB"/>
            </svg>

          </div>
          <ModalTitle className="text-lg font-semibold leading-none tracking-tight text-foreground">
            Are you sure you want to leave?
          </ModalTitle>
        </div>
        <p className="px-8 py-4 text-muted-foreground">
          You have unsaved changes.
        </p>
        <div className="flex flex-row justify-end gap-2 px-8 py-5">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Stay in page
          </Button>
          <Button onClick={() => setOpen(false)}>Leave</Button>
        </div>
      </Modal>
    </>
  );
}

function CancelSubscriptionDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Cancel subscription
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} className="border-0">
        <div className="flex flex-row items-start gap-3 px-8 pt-8 pb-4 text-left">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              "bg-destructive text-destructive-foreground",
            )}
            aria-hidden
          >
            <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.413333" y="0.413333" width="54.1733" height="54.1733" rx="27.0867" fill="#FFF7F8" stroke="#F4E4E6" stroke-width="0.826667"/>
              <g clip-path="url(#clip0_10924_10835)">
              <path d="M23.0161 27.9214H31.1392" stroke="#E64B5F" stroke-width="1.488" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M27.0777 38.075C32.6855 38.075 37.2315 33.529 37.2315 27.9212C37.2315 22.3134 32.6855 17.7673 27.0777 17.7673C21.4699 17.7673 16.9238 22.3134 16.9238 27.9212C16.9238 33.529 21.4699 38.075 27.0777 38.075Z" stroke="#E64B5F" stroke-width="1.488" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
              <clipPath id="clip0_10924_10835">
              <rect width="27.0769" height="27.0769" fill="white" transform="translate(13.5391 14.3828)"/>
              </clipPath>
              </defs>
            </svg>
          </div>
          <ModalTitle>
            Are you sure you want to cancel the subscription plan?
          </ModalTitle>
        </div>
        <Notice
          variant="info"
          className="m-6"
          borderColor="#8b5cf6"
          bgColor="#f5f3ff"
        >
          <Info className="size-4" aria-hidden />
          <p className="text-sm text-foreground">
            Next billing date is <strong>25th March 2024</strong> and reassign
            is not possible for recurring subscription
          </p>
        </Notice>
        <div className="flex flex-row justify-end gap-2 px-8 py-5">
          <Button variant="outline" onClick={() => setOpen(false)}>
            No
          </Button>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Yes, Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}

function DiscardDraftDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Cancel subscription
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} className="border-0">
        <div className="flex flex-row items-start gap-3 px-8 pt-8 pb-4 text-left">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              "bg-destructive text-destructive-foreground",
            )}
            aria-hidden
          >
            <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.413333" y="0.413333" width="54.1733" height="54.1733" rx="27.0867" fill="#FFF7F8" stroke="#F4E4E6" stroke-width="0.826667"/>
              <g clip-path="url(#clip0_10924_10835)">
              <path d="M23.0161 27.9214H31.1392" stroke="#E64B5F" stroke-width="1.488" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M27.0777 38.075C32.6855 38.075 37.2315 33.529 37.2315 27.9212C37.2315 22.3134 32.6855 17.7673 27.0777 17.7673C21.4699 17.7673 16.9238 22.3134 16.9238 27.9212C16.9238 33.529 21.4699 38.075 27.0777 38.075Z" stroke="#E64B5F" stroke-width="1.488" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
              <clipPath id="clip0_10924_10835">
              <rect width="27.0769" height="27.0769" fill="white" transform="translate(13.5391 14.3828)"/>
              </clipPath>
              </defs>
            </svg>
          </div>
          <ModalTitle>
            Are you sure you want to cancel the subscription plan?
          </ModalTitle>
        </div>
        <div className="flex flex-row justify-end gap-2 px-8 py-5">
          <Button variant="outline" onClick={() => setOpen(false)}>
            No
          </Button>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Yes, Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}

const meta = {
  title: "UI/Confirmation",
  component: Modal,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { open: false, onClose: () => {} },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LeaveWithUnsavedChanges: Story = {
  render: () => <LeaveWithUnsavedChangesDemo />,
};

export const CancelSubscription: Story = {
  render: () => <CancelSubscriptionDemo />,
};

export const DiscardDraft: Story = {
  render: () => <DiscardDraftDemo />,
};
