import React from 'react';
import Packages from '@/components/GlobalComponents/Packages/Packages';

const PackagesClippingPathExtraction = () => {
  const tabNames = ['Clipping Path', 'Extraction'];

  const tabsContent = [
    {
      images: [
        [
          new URL('@/assets/images/Clipping-Path-SHP-RAW-1-scaled.jpg', import.meta.url).href,
          new URL('@/assets/images/Clipping-Path-SHP-Corrected-1.jpg', import.meta.url).href
        ],
        [
          new URL('@/assets/images/Clipping-Path-SHP-RAW-2.jpg', import.meta.url).href,
          new URL('@/assets/images/Clipping-Path-SHP-Corrected-2.jpg', import.meta.url).href
        ]
      ],
      title: 'Clipping Path',
      description: 'Get transparent background or changed background as per your need.',
      price: '$1.50 – $5.00/Image',
      addToCartBtn: '/services/clipping-path-extraction/clipping-path/',
      moreBtn: '/services/clipping-path-extraction/clipping-path/',
      features: [
        { name: 'Background Replacement using Fast Cut-Out', included: true },
        { name: 'Adding Transparent or White Background', included: true },
        { name: 'Color Correction (if-required)', included: true },
        { name: 'Adding Natural/Drop Shadow/Reflection', included: true }
      ]
    },
    {
      images: [
        [new URL('@images/Extraction-SH-Raw-1.jpg', import.meta.url).href,
        new URL('@images/Extraction-SH-Corrected-1.jpg', import.meta.url).href],
        [new URL('@images/Extraction-SH-Raw-2.jpg', import.meta.url).href,
        new URL('@images/Extraction-SH-Correted-2.jpg', import.meta.url).href],
        [new URL('@images/Sports-2-RAW-scaled.jpg', import.meta.url).href,
        new URL('@images/Sports-3-Done-scaled.jpg', import.meta.url).href]
      ],
      title: 'Extraction',
      description: 'You get the path, so that you can replace the background as per your requirement.',
      price: '$0.50 – $4.50/Image',

      addToCartBtn: '/services/clipping-path-extraction/extraction/',
      moreBtn: '/services/clipping-path-extraction/extraction/',
      features: [
        { name: 'Background Replacement using Creating Path', included: true },
        { name: 'Adding Transparent or White Background', included: true },
        { name: 'Color Correction (if-required)', included: true },
        { name: 'Cropping & Straightening', included: true },
        { name: 'Adding Natural/Drop Shadow/Reflection', included: true }
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

export default PackagesClippingPathExtraction;
