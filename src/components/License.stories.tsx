import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { License, type LicenseStatus } from "./license";
import React, { useState } from "react";

const DefaultHeaderImage = () => (
  <svg
            width="122"
            height="83"
            viewBox="0 0 122 83"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                y="13.7734"
                width="112.215"
                height="68.6155"
                rx="4.58333"
                fill="#EFEAFF"
            />
            <path
                d="M0 18.3568C0 15.8255 2.05203 13.7734 4.58333 13.7734H17.5738C20.1051 13.7734 22.1571 15.8255 22.1571 18.3568V77.8089C22.1571 80.3384 20.1065 82.3889 17.5771 82.3889H4.57999C2.05053 82.3889 0 80.3384 0 77.8089V18.3568Z"
                fill="#DFD7FA"
            />
            <rect
                x="38.5977"
                y="36.6445"
                width="45.7437"
                height="4.28847"
                rx="2.14423"
                fill="white"
            />
            <rect
                x="38.5977"
                y="45.2188"
                width="45.7437"
                height="4.28847"
                rx="2.14423"
                fill="white"
            />
            <rect
                x="38.5977"
                y="53.7969"
                width="45.7437"
                height="4.28847"
                rx="2.14423"
                fill="white"
            />
            <rect
                x="38.5977"
                y="62.375"
                width="45.7437"
                height="4.28847"
                rx="2.14423"
                fill="white"
            />
            <path
                d="M98 53.6712C98 51.5638 99.7084 49.8555 101.816 49.8555H118.184C120.292 49.8555 122 51.5638 122 53.6712V68.4034C122 70.5107 120.292 72.2191 118.184 72.2191H101.816C99.7084 72.2191 98 70.5107 98 68.4034V53.6712Z"
                fill="#7047EB"
            />
            <path
                d="M114.976 61.4473C114.976 64.5562 112.8 66.1107 110.213 67.0123C110.078 67.0582 109.93 67.056 109.796 67.0061C107.204 66.1107 105.027 64.5562 105.027 61.4473V57.0948C105.027 56.9299 105.093 56.7718 105.209 56.6552C105.326 56.5386 105.484 56.4731 105.649 56.4731C106.893 56.4731 108.447 55.7269 109.529 54.7818C109.661 54.6693 109.828 54.6074 110.002 54.6074C110.175 54.6074 110.342 54.6693 110.474 54.7818C111.562 55.7331 113.111 56.4731 114.354 56.4731C114.519 56.4731 114.677 56.5386 114.794 56.6552C114.91 56.7718 114.976 56.9299 114.976 57.0948V61.4473Z"
                stroke="white"
                strokeWidth="1.09051"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect
                x="35.3672"
                width="24"
                height="22.8837"
                rx="3.90447"
                fill="#7047EB"
            />
            <g clipPath="url(#clip0_5284_103333)">
                <path
                    d="M50.5517 8.99219C50.7274 8.99219 50.8698 8.84976 50.8698 8.67406C50.8698 8.49837 50.7274 8.35594 50.5517 8.35594C50.376 8.35594 50.2336 8.49837 50.2336 8.67406C50.2336 8.84976 50.376 8.99219 50.5517 8.99219Z"
                    fill="black"
                />
                <path
                    d="M41.699 14.9818C41.4604 15.2204 41.3262 15.544 41.3262 15.8814V17.2634C41.3262 17.4321 41.3932 17.5939 41.5125 17.7132C41.6318 17.8326 41.7937 17.8996 41.9624 17.8996H43.8711C44.0399 17.8996 44.2017 17.8326 44.321 17.7132C44.4404 17.5939 44.5074 17.4321 44.5074 17.2634V16.6271C44.5074 16.4584 44.5744 16.2965 44.6937 16.1772C44.8131 16.0579 44.9749 15.9909 45.1436 15.9909H45.7799C45.9486 15.9909 46.1105 15.9238 46.2298 15.8045C46.3491 15.6852 46.4161 15.5234 46.4161 15.3546V14.7184C46.4161 14.5496 46.4832 14.3878 46.6025 14.2685C46.7218 14.1492 46.8836 14.0821 47.0524 14.0821H47.1618C47.4993 14.0821 47.8229 13.9479 48.0614 13.7093L48.5793 13.1914C49.4636 13.4994 50.4263 13.4983 51.3098 13.1881C52.1933 12.8779 52.9454 12.277 53.443 11.4838C53.9407 10.6906 54.1544 9.75197 54.0492 8.82151C53.944 7.89104 53.5262 7.02381 52.8641 6.36168C52.202 5.69955 51.3347 5.28173 50.4043 5.17656C49.4738 5.0714 48.5352 5.28511 47.742 5.78275C46.9488 6.28038 46.3479 7.03247 46.0377 7.91599C45.7275 8.79951 45.7263 9.76215 46.0344 10.6464L41.699 14.9818Z"
                    stroke="white"
                    strokeWidth="1.11587"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M50.5517 8.99219C50.7274 8.99219 50.8698 8.84976 50.8698 8.67406C50.8698 8.49837 50.7274 8.35594 50.5517 8.35594C50.376 8.35594 50.2336 8.49837 50.2336 8.67406C50.2336 8.84976 50.376 8.99219 50.5517 8.99219Z"
                    stroke="white"
                    strokeWidth="1.11587"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_5284_103333">
                    <rect
                        width="15.2698"
                        height="15.2698"
                        fill="white"
                        transform="translate(40.0547 3.90234)"
                    />
                </clipPath>
            </defs>
        </svg>
);

const meta = {
  title: "Components/License",
  component: License,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    onActivate: fn(),
    onDeactivate: fn(),
    onRefresh: fn(),
    onLicenseKeyChange: fn(),
  },
  argTypes: {
    licenseKey: { control: "text" },
    loading: { control: "boolean" },
    error: { control: "text" },
    pluginName: { control: "text" },
    hookNamespace: { control: "text" },
  },
} satisfies Meta<typeof License>;

export default meta;

type Story = StoryObj<typeof meta>;

// --- Inactive state (no license) ---

export const Inactive: Story = {
  args: {
    licenseKey: "",
    status: null,
    loading: false,
    error: "",
    pluginName: "MyPlugin Pro",
    headerImage: <DefaultHeaderImage />,
  },
};

export const InactiveWithKey: Story = {
  args: {
    licenseKey: "abc123-def456-ghi789-jkl012",
    status: null,
    loading: false,
    error: "",
    pluginName: "MyPlugin Pro",
    headerImage: <DefaultHeaderImage />,
  },
};

// --- Active state ---

const activeStatus: LicenseStatus = {
  is_valid: true,
  expiry_days: 120,
  data: {
    key: "abc123-def456-ghi789-jkl012-mno345",
    remaining: 3,
    activation_limit: 5,
  },
};

export const Active: Story = {
  args: {
    licenseKey: "abc123-def456-ghi789-jkl012-mno345",
    status: activeStatus,
    loading: false,
    error: "",
    pluginName: "MyPlugin Pro",
    headerImage: <DefaultHeaderImage />,
  },
};

// --- Active with perpetual license ---

const perpetualStatus: LicenseStatus = {
  is_valid: true,
  expiry_days: 0,
  data: {
    key: "abc123-def456-ghi789-jkl012-mno345",
    remaining: 10,
    activation_limit: 25,
  },
};

export const ActivePerpetual: Story = {
  args: {
    licenseKey: "abc123-def456-ghi789-jkl012-mno345",
    status: perpetualStatus,
    loading: false,
    error: "",
    pluginName: "MyPlugin Pro",
    headerImage: <DefaultHeaderImage />,
  },
};

// --- Loading state ---

export const Loading: Story = {
  args: {
    licenseKey: "",
    status: null,
    loading: true,
    error: "",
    pluginName: "MyPlugin Pro",
    headerImage: <DefaultHeaderImage />,
  },
};

// --- Error state ---

export const WithError: Story = {
  args: {
    licenseKey: "invalid-key",
    status: null,
    loading: false,
    error: "The license key you entered is invalid. Please check and try again.",
    pluginName: "MyPlugin Pro",
    headerImage: <DefaultHeaderImage />,
  },
};

// --- Without header image ---

export const WithoutHeaderImage: Story = {
  args: {
    licenseKey: "",
    status: null,
    loading: false,
    error: "",
    pluginName: "wePos",
  },
};

// --- Custom labels ---

export const CustomLabels: Story = {
  args: {
    licenseKey: "",
    status: null,
    loading: false,
    error: "",
    pluginName: "Starter Plugin",
    headerImage: <DefaultHeaderImage />,
    labels: {
      title: "Activation",
      activationTitle: "Product Activation",
      activateButton: "Activate Now",
      licenseKeyPlaceholder: "Paste your license key...",
    },
  },
};

// --- Interactive playground ---

const InteractiveTemplate = () => {
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<LicenseStatus | null>(null);
  const handleActivate = async () => {
    setLoading(true);
    setError("");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (licenseKey === "invalid") {
      setError("Invalid license key. Please try again.");
      setLoading(false);
      return;
    }

    setStatus({
      is_valid: true,
      expiry_days: 365,
      data: {
        key: licenseKey,
        remaining: 4,
        activation_limit: 5,
      },
    });
    setLoading(false);
  };

  const handleDeactivate = async (closeDialog: () => void) => {
    setLoading(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus(null);
    setLicenseKey("");
    setLoading(false);
    closeDialog();
  };

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
  };

  return (
    <License
      licenseKey={licenseKey}
      onLicenseKeyChange={setLicenseKey}
      status={status}
      loading={loading}
      error={error}
      onActivate={handleActivate}
      onDeactivate={handleDeactivate}
      onRefresh={handleRefresh}
      pluginName="Demo Plugin"
      hookNamespace="demo_plugin"
      headerImage={<DefaultHeaderImage />}
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveTemplate />,
  args: {
    licenseKey: "",
    status: null,
    loading: false,
    error: "",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A fully interactive demo with simulated API calls. Type any key to activate (type 'invalid' to see error state).",
      },
    },
  },
};
