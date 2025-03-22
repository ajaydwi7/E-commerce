import React from 'react';
import Packages from '@/components/GlobalComponents/Packages/Packages';

const PackagesECommerce = () => {
  const tabNames = ['Product Retouching', 'Jewelry Retouching', 'Ghost Mannequin', 'Composite Retouching'];

  const tabsContent = [
    {
      images: [
        [
          new URL('@/assets/images/Product-eComm-SHP-Raw-1.jpg', import.meta.url).href,
          new URL('@/assets/images/Product-eComm-SHP-Corrected-1.jpg', import.meta.url).href
        ],
        [
          new URL('@/assets/images/Product-eComm-SHP-Raw-2.jpg', import.meta.url).href,
          new URL('@/assets/images/Product-eComm-SHP-Corrected-2.png', import.meta.url).href
        ],
        [
          new URL('@/assets/images/Product-eComm-SHP-Raw-3.jpg', import.meta.url).href,
          new URL('@/assets/images/Product-eComm-SHP-Corrected-3.png', import.meta.url).href
        ]
      ],
      title: 'Product Retouching',
      description: 'Make your product image presentable for advertisements and E- commerce sites.',
      price: '$1.50 – $4.00/Image',
      addToCartBtn: '/services/commercial/products-apparel-footwear-furniture/',
      moreBtn: '/services/commercial/products-apparel-footwear-furniture/',
      features: [
        { name: 'Color Correction', included: true },
        { name: 'Background Fixing and Replacement', included: true },
        { name: 'Dust Removal', included: true },
        { name: 'Unwanted Object Removal', included: true },
        { name: 'Creasing, Stains or Scratches fixing', included: true },
        { name: 'Removing Dark Spots and Flaws', included: true },
        { name: 'Adding Natural/Drop Shadow/Reflection', included: true }
      ]
    },
    {
      images: [
        [new URL('@images/Jewelery-SHP-Raw-1.jpg', import.meta.url).href,
        new URL('@images/Jewelery-SHP-Corrected-1.jpg', import.meta.url).href],
        [new URL('@images/Jewelery-SHP-Raw-2.jpg', import.meta.url).href,
        new URL('@images/Jewelery-SHP-Corrected-2.jpg', import.meta.url).href]
      ],
      title: 'Jewelry Retouching',
      description: 'Jewelry is expensive. Hence we preserve the rich look.',
      price: '$4.00/Image',
      addToCartBtn: "/services/commercial/jewelry/",
      moreBtn: "/services/commercial/jewelry/",
      features: [
        { name: 'Digital Polish of Metal, Diamond or Gemstone', included: true },
        { name: 'Correction or Straightening of irregular Chains (if required)', included: true },
        { name: 'Lighting Correction', included: true },
        { name: 'Cropping & Straightening', included: true },
        { name: 'Clipping Path', included: true },
        { name: 'Background Change/Removal', included: true },
        { name: 'Unwanted Reflection Removal', included: true },
        { name: 'Unwanted Dust Removal', included: true },
        { name: 'Spots & Blemishes Removal', included: true },
        { name: 'Adding Natural or Drop Shadow/Reflection', included: true }
      ]
    },
    {
      images: [
        [new URL('@images/Ghost-Mannequin-SHP-Raw-1.jpg', import.meta.url).href,
        new URL('@images/Ghost-Mannequin-SHP-Corrected-1.jpg', import.meta.url).href]
      ],
      title: 'Ghost Mannequin',
      description: 'Mannequin is removed cleanly, so that the apparel looks attractive.',
      price: '$4.00/Image',
      addToCartBtn: "/services/commercial/ghost-mannequin/",
      moreBtn: "/services/commercial/ghost-mannequin/",
      features: [
        { name: 'Color Correction', included: true },
        { name: 'Background Fixing or Replacement', included: true },
        { name: 'Dust Removal', included: true },
        { name: 'Unwanted Object Removal', included: true },
        { name: 'Creasing, Stains or Scratches fixing', included: true },
        { name: 'Adding Natural/Drop Shadow/Reflection', included: true },
      ]
    },
    {
      images: [
        [new URL('@images/Image-Coming-Soon.jpg', import.meta.url).href,
        new URL('@images/Image-Coming-Soon.jpg', import.meta.url).href],

      ],
      title: 'Composite Retouching',
      description: 'Manipulate an image as per your marketing/ advertisement need.',
      price: '$0.00/Image',
      addToCartBtn: "/services/commercial/photo-composite/",
      moreBtn: "/services/commercial/photo-composite/",
      features: [
        { name: 'Composite retouching are used in all forms of photography. They can be a cost-effective way to create images for advertising campaigns, portraits, etc.', included: true }
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

export default PackagesECommerce;
