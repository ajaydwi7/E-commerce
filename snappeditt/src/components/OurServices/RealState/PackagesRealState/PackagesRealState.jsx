import React from 'react';
import Packages from '@/components/GlobalComponents/Packages/Packages';

const RealEstatePackages = () => {
  const tabNames = ['Basic', 'HDR Basic', 'HDR Pro', 'Manual Blending', 'Architecture', 'Custom'];
  const tabsContent = [
    {
      images: [
        [
          new URL('@/assets/images/Real-Estate-Single_exposure-Raw-1.jpg', import.meta.url).href,
          new URL('@/assets/images/Real-Estate-Single_exposure-Corrected-1.jpg', import.meta.url).href
        ],
        [
          new URL('@/assets/images/Real-Estate-Single_exposure-Raw-2.jpg', import.meta.url).href,
          new URL('@/assets/images/Real-Estate-Single_exposure-Corrected-2.jpg', import.meta.url).href
        ],
        [
          new URL('@/assets/images/Real-Estate-Single_exposure-Raw-3.jpg', import.meta.url).href,
          new URL('@/assets/images/Real-Estate-Single_exposure-Corrected-3.jpg', import.meta.url).href
        ]
      ],
      title: 'Single Exposure',
      description: 'Get your single exposure perfectly color corrected.',
      price: '$0.45/Image',
      addToCartBtn: '/services/real-estate/single-exposure',
      moreBtn: '/services/real-estate/single-exposure',
      features: [
        { name: 'No HDR Blending', included: false },
        { name: 'Color Correction', included: true },
        { name: 'Lense Correction', included: true },
        { name: 'Perspective Correction', included: true },
        { name: 'Color Cast Removal - Minimal', included: true },
        { name: 'Sharpening', included: true },
        { name: 'Output: JPEG, TIFF, PSD', included: true }
      ]
    },
    {
      images: [
        [new URL('@images/Real-Estate-HDR-Basic-Raw-1.jpg', import.meta.url).href,
        new URL('@images/Real-Estate-HDR-Basic-Corrected-1.jpg', import.meta.url).href],
        [new URL('@images/Real-Estate-HDR-Basic-Raw-2.jpg', import.meta.url).href,
        new URL('@images/Real-Estate-HDR-Basic-Corrected-2.jpg', import.meta.url).href]
      ],
      title: 'HDR Basic',
      description: 'Perfect HDR with balanced color correction.',
      price: '$0.60/Image',
      addToCartBtn: '/services/real-estate/hdr-basic',
      moreBtn: '/services/real-estate/hdr-basic',
      features: [
        { name: 'HDR Blending', included: true },
        { name: 'Color Correction', included: true },
        { name: 'Lense Correction', included: true },
        { name: 'Perspective Correction', included: true },
        { name: 'Color Cast Removal', included: true },
        { name: 'Sharpening', included: true },
        { name: 'Output: JPEG, TIFF, PSD', included: true }
      ]
    },
    {
      images: [
        [new URL('@/assets/images/Real-Estate-HDR-Pre-Raw-1.jpg', import.meta.url).href,
        new URL('@/assets/images/Real-Estate-HDR-Pre-Corrected-1.jpg', import.meta.url).href],

        [new URL('@/assets/images/Real-Estate-HDR-Pre-Raw-2.jpg', import.meta.url).href,
        new URL('@/assets/images/Real-Estate-HDR-Pre-Corrected-2.jpg', import.meta.url).href],

        [new URL('@/assets/images/Real-Estate-HDR-Pre-Raw-3.jpg', import.meta.url).href,
        new URL('@/assets/images/Real-Estate-HDR-Pre-Corrected-3.jpg', import.meta.url).href],
      ],
      title: 'HDR Premium',
      description: 'Perfect HDR with balanced color correction.',
      price: '$1.10/Image',
      addToCartBtn: '/services/real-estate/hdr-premium',
      moreBtn: '/services/real-estate/hdr-premium',
      features: [
        { name: 'HDR Blending', included: true },
        { name: 'Color Correction', included: true },
        { name: 'Lense Correction', included: true },
        { name: 'Perspective Correction', included: true },
        { name: 'Color Cast Removal', included: true },
        { name: 'Sharpening', included: true },
        { name: 'Output: JPEG, TIFF, PSD', included: true }
      ]
    },

    {
      images: [
        [new URL('@/assets/images/Real-Estate-Manual_Blending-Raw-1.jpg', import.meta.url).href,
        new URL('@/assets/images/Real-Estate-Manual_Blending-Corrected-1.jpg', import.meta.url).href],

        [new URL('@/assets/images/Real-Estate-Manual_Blending-Raw-2.jpg', import.meta.url).href,
        new URL('@/assets/images/Real-Estate-Manual_Blending-Corrected-2.jpg', import.meta.url).href],
        [new URL('@/assets/images/Real-Estate-Manual_Blending-Raw-3.jpg', import.meta.url).href,
        new URL('@/assets/images/Real-Estate-Manual_Blending-Corrected-3.jpg', import.meta.url).href]
      ],
      title: 'Manual Blending',
      description: 'Perfect HDR with balanced color correction.',
      price: '$2.25/Image',
      addToCartBtn: '/services/real-estate/manual-blending',
      moreBtn: '/services/real-estate/manual-blending',
      features: [
        { name: 'HDR Blending', included: true },
        { name: 'Color Correction', included: true },
        { name: 'Lense Correction', included: true },
        { name: 'Perspective Correction', included: true },
        { name: 'Color Cast Removal', included: true },
        { name: 'Sharpening', included: true },
        { name: 'Output: JPEG, TIFF, PSD', included: true }
      ]
    },

    {
      images: [
        [new URL('@/assets/images/Real-Estate-Architechture_Retouching-Raw-1.jpg', import.meta.url).href,
        new URL('@/assets/images/Real-Estate-Architechture_Retouching-Corrected-1.jpg', import.meta.url).href],
        [new URL('@/assets/images/Real-Estate-Architechture_Retouching-Raw-2.jpg', import.meta.url).href,
        new URL('@/assets/images/Real-Estate-Architechture_Retouching-Corrected-2.jpg', import.meta.url).href],
        [new URL('@/assets/images/Real-Estate-Architechture_Retouching-Raw-3.jpg', import.meta.url).href,
        new URL('@/assets/images/Real-Estate-Architechture_Retouching-Corrected-3.jpg', import.meta.url).href]

      ],
      title: 'Architecture Retouching',
      description: 'Perfect HDR with balanced color correction.',
      price: '$3.75/Image',
      addToCartBtn: '/services/real-estate/architecture-retouch',
      moreBtn: '/services/real-estate/srchitecture-retouching',
      features: [
        { name: 'HDR Blending', included: true },
        { name: 'Color Correction', included: true },
        { name: 'Lense Correction', included: true },
        { name: 'Perspective Correction', included: true },
        { name: 'Color Cast Removal', included: true },
        { name: 'Sharpening', included: true },
        { name: 'Output: JPEG, TIFF, PSD', included: true }
      ]
    },

    {
      images: [[new URL('@/assets/images/Real-Estate-Custom_Retouch_Raw.jpg', import.meta.url).href,
      new URL('@/assets/images/Real-Estate-Custom_Retouch_Corrected.jpg', import.meta.url).href]],
      title: 'Custom Retouch​',
      description: 'Perfect HDR with balanced color correction.',
      price: '$0.00/Image',
      addToCartBtn: '/services/real-estate/custom-retouch',
      moreBtn: '/services/real-estate/custom-retouch',
      features: [
        { name: 'HDR Blending', included: true },
        { name: 'Color Correction', included: true },
        { name: 'Lense Correction', included: true },
        { name: 'Perspective Correction', included: true },
        { name: 'Color Cast Removal', included: true },
        { name: 'Sharpening', included: true },
        { name: 'Output: JPEG, TIFF, PSD', included: true }
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

export default RealEstatePackages;
