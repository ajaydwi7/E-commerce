import React from 'react';
import Packages from '@/components/GlobalComponents/Packages/Packages';

const PackagesWeddingEvents = () => {
  const tabNames = ['Perfect Color Balance', 'Perfect Color Balance + Culling'];

  const tabsContent = [
    {
      images: [
        [
          new URL('@/assets/images/Wedding-Events-SHP-Raw-1.jpg', import.meta.url).href,
          new URL('@/assets/images/Wedding-Events-SHP-Corrected-1.jpg', import.meta.url).href
        ],
        [
          new URL('@/assets/images/Wedding-Events-SHP-Raw-2.jpg', import.meta.url).href,
          new URL('@/assets/images/Wedding-Events-SHP-Corrected-2.jpg', import.meta.url).href
        ],
        [
          new URL('@/assets/images/Wedding-Events-SHP-Raw-3.jpg', import.meta.url).href,
          new URL('@/assets/images/Wedding-Events-SHP-Corrected-3.jpg', import.meta.url).href
        ]
      ],
      title: 'Perfect Color Balance',
      description: 'Presets which maintainperfect color balancein your images.',
      price: '$0.12/Image',
      addToCartBtn: '/services/wedding/perfect-color-balance/',
      moreBtn: '/services/wedding/perfect-color-balance/',
      features: [
        { name: 'Exposure Correction', included: true },
        { name: 'Contrast', included: true },
        { name: 'Temperature', included: true },
        { name: 'Shadow & Highlight Recovery', included: true },
        { name: 'Defringe / Camera Profile Enabling', included: true },
        { name: 'Hue', included: true },
        { name: 'Tint Adjustment', included: true },
        { name: 'Noise Reduction', included: true },
        { name: 'Sharpening', included: true },
        { name: 'Vibrancy', included: true },
        { name: 'Clarity', included: true },
        { name: 'Presets', included: true },
        { name: 'Lightroom Catalog or XMPt', included: true },
        { name: 'Image Culling', included: false },
        { name: 'Inputs: JPEG or RAW', included: true }
      ]
    },
    {
      images: [
        [new URL('@images/Wedding-Events-Culling-SHP-Raw-1.jpg', import.meta.url).href,
        new URL('@images/Wedding-Events-Culling-SHP-Corrected-1.jpg', import.meta.url).href],
        [new URL('@images/Wedding-Events-Culling-SHP-Raw-2.jpg', import.meta.url).href,
        new URL('@images/Wedding-Events-Culling-SHP-Corrected-2.jpg', import.meta.url).href],
        [new URL('@images/Wedding-Events-Culling-SHP-Raw-3.jpg', import.meta.url).href,
        new URL('@images/Wedding-Events-Culling-SHP-Corrected-3.jpg', import.meta.url).href]
      ],
      title: 'Perfect Color Balance + Culling',
      description: 'Time consuming task made easy with our culling service along with color correction.',
      price: '$0.08 – $0.11/Image',
      addToCartBtn: '/services/wedding/perfect-color-balance-culling/',
      moreBtn: '/services/wedding/perfect-color-balance-culling/',
      features: [
        { name: 'Exposure Correction', included: true },
        { name: 'Contrast', included: true },
        { name: 'Temperature', included: true },
        { name: 'Shadow & Highlight Recovery', included: true },
        { name: 'Defringe / Camera Profile Enabling', included: true },
        { name: 'Hue', included: true },
        { name: 'Tint Adjustment', included: true },
        { name: 'Noise Reduction', included: true },
        { name: 'Sharpening', included: true },
        { name: 'Vibrancy', included: true },
        { name: 'Clarity', included: true },
        { name: 'Presets', included: true },
        { name: 'Lightroom Catalog or XMP', included: true },
        { name: 'Image Culling', included: true },
        { name: 'Inputs: JPEG or RAW', included: true }
      ]
    }
    // Additional content here...
  ];

  return (
    <Packages
      tabNames={tabNames}
      tabsContent={tabsContent}
      title="Packages We Offer...."
    />
  );
};

export default PackagesWeddingEvents;
