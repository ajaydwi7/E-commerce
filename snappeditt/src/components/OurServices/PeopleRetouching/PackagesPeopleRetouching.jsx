import React from 'react';
import Packages from '@/components/GlobalComponents/Packages/Packages';

const PackagesPeopleRetouching = () => {
  const tabNames = ['Portrait Retouch', 'Corporate Headshots', 'Pregnancy Retouch', 'Baby Retouching', 'School Retouching', 'Sports Retouching', 'Fashion Retouching'];

  const tabsContent = [
    {
      images: [
        [
          new URL('@/assets/images/Portrait-SHP-Raw-1.jpg', import.meta.url).href,
          new URL('@/assets/images/Portrait-SHP-Corrected-1-scaled.jpg', import.meta.url).href
        ],
        [
          new URL('@/assets/images/Portrait-SHP-Raw-2-scaled.jpg', import.meta.url).href,
          new URL('@/assets/images/Portrait-SHP-Corrected-2.jpg', import.meta.url).href
        ]
      ],
      title: 'Portrait Retouching',
      description: 'Portraits needs to be professional.So, we keep it natural by taking care of skin tone and stray hair.',
      price: '$2.25/Image',
      addToCartBtn: '/services/people/portrait-headshots-studio',
      moreBtn: '/services/people/portrait-headshots-studio',
      features: [
        { name: 'Basic Retouching', included: true },
        { name: 'Blemish Removal', included: true },
        { name: 'Stray Hair Removals', included: true },
        { name: 'Teeth Whitening', included: true },
        { name: 'Basic Skin Retouching', included: true },
        { name: 'Dark Circle Remova', included: true },
        { name: 'Background Removal', included: true },
        { name: 'Custom Requirements', included: true }
      ]
    },
    {
      images: [
        [new URL('@images/Corporate-SPH-Raw-1-scaled.jpg', import.meta.url).href,
        new URL('@images/Corporate-SPH-Corrected-1-scaled.jpg', import.meta.url).href],
        [new URL('@images/Corporate-SPH-Raw-2-scaled.jpg', import.meta.url).href,
        new URL('@images/Corporate-SPH-Corrected-2-scaled.jpg', import.meta.url).href],
        [new URL('@images/Corporate-SPH-Raw-3-scaled.jpg', import.meta.url).href,
        new URL('@images/Corporate-SPH-Corrected-3-scaled.jpg', import.meta.url).href]
      ],
      title: 'Corporate Headshots',
      description: 'We mainly focus to make a headshot image ready for corporate use.',
      price: '$2.00/Image',
      addToCartBtn: '/services/people/corporate-professional-headshots/',
      moreBtn: '/services/people/corporate-professional-headshots/',
      features: [
        { name: 'Basic Retouching', included: true },
        { name: 'Basic Blemish Removal', included: true },
        { name: 'Stray Hair Removal', included: true },
        { name: 'Teeth Whitening', included: true },
        { name: 'Basic Skin Retouching', included: true },
        { name: 'Dark Circle Removal', included: true },
        { name: 'Background Removal', included: true },
        { name: 'Custom Requirement', included: true }
      ]
    },
    {
      images: [
        [new URL('@images/Pregnacy-SHP-Raw-1.jpg', import.meta.url).href,
        new URL('@images/Pregnacy-SHP-Corrected-1.jpg', import.meta.url).href],
        [new URL('@images/Pregnacy-SHP-Raw-2.jpg', import.meta.url).href,
        new URL('@images/Pregnacy-SHP-Corrected-2.jpg', import.meta.url).href]
      ],
      title: 'Pregnancy Retouching',
      description: 'We maintain your elegant style through gentle edit.',
      price: '$1.50/Image',
      addToCartBtn: '/services/people/maternity-pregnancy-retouch/',
      moreBtn: '/services/people/maternity-pregnancy-retouch/',
      features: [
        { name: 'Color Correction', included: true },
        { name: 'Skin Retouching', included: true },
        { name: 'Creases Removal', included: true },
        { name: 'Teeth & Eyes Whitening', included: true },
        { name: 'Shadow and Distraction Remova', included: true },
        { name: 'Custom Requirement', included: true },
      ]
    },
    {
      images: [
        [new URL('@images/Baby-SPH-Raw-3.jpg', import.meta.url).href,
        new URL('@images/Baby-SPH-Corrected-3.jpg', import.meta.url).href],
        [new URL('@images/Baby-SPH-Raw-2.jpg', import.meta.url).href,
        new URL('@images/Baby-SPH-Corrected-2.jpg', import.meta.url).href]
      ],
      title: 'Baby Retouching',
      description: 'It is difficult to shoot babies. Hence we make sure that they glow in the images.',
      price: '$1.50/Image',
      addToCartBtn: '/services/people/new-born/',
      moreBtn: '/services/people/new-born/',
      features: [
        { name: 'Basic Retouching and Clean-up', included: true },
        { name: 'Sharpening and Basic Color Correction (if required)', included: true },
        { name: 'Dead Skin Removal', included: true },
        { name: 'Skin Softening', included: true },
        { name: 'Reduction of Redness on Hands & Feet', included: true }
      ]
    },
    {
      images: [
        [new URL('@images/Real-Estate-HDR-Basic-Raw-1.jpg', import.meta.url).href,
        new URL('@images/Real-Estate-HDR-Basic-Corrected-1.jpg', import.meta.url).href],
        [new URL('@images/Real-Estate-HDR-Basic-Raw-2.jpg', import.meta.url).href,
        new URL('@images/Real-Estate-HDR-Basic-Corrected-2.jpg', import.meta.url).href]
      ],
      title: 'School Retouching',
      description: 'Basics of editing gives us the best result for student images.',
      price: '$1.25/Image',
      addToCartBtn: '/services/people/school/',
      moreBtn: '/services/people/school/',
      features: [
        { name: 'Basic Retouching', included: true },
        { name: 'Color Correction', included: true },
        { name: 'Straightening', included: true },
        { name: 'Crease Removal from Uniform', included: true },
        { name: 'Whitening of Teeth & Eyes', included: true },
      ]
    },
    {
      images: [
        [new URL('@images/Real-Estate-HDR-Basic-Raw-1.jpg', import.meta.url).href,
        new URL('@images/Real-Estate-HDR-Basic-Corrected-1.jpg', import.meta.url).href],
        [new URL('@images/Real-Estate-HDR-Basic-Raw-2.jpg', import.meta.url).href,
        new URL('@images/Real-Estate-HDR-Basic-Corrected-2.jpg', import.meta.url).href]
      ],
      title: 'Sports Retouching',
      description: 'We can help you to complete your banners.',
      price: '$1.25/Image',
      addToCartBtn: '/services/people/sports/',
      moreBtn: '/services/people/sports/',
      features: [
        { name: 'Color Correction', included: true },
        { name: 'Straightening', included: true },
        { name: 'Crease Removal from Jersey', included: true },
        { name: 'Teeth & Eye Whitening', included: true }
      ]
    },
    {
      images: [
        [new URL('@images/Fashion-SHP-Raw-2.jpg', import.meta.url).href,
        new URL('@images/Fashion-SHP-Corrected-2.jpg', import.meta.url).href],
        [new URL('@images/Fashion-SHP-Raw-1.jpg', import.meta.url).href,
        new URL('@images/Fashion-SHP-Corrected-1.jpg', import.meta.url).href]
      ],
      title: 'Fashion – Glamour Retouching',
      description: 'High end work as per your custom instructions.',
      price: '$10.00/Image',
      addToCartBtn: '/services/people/fashion-glamour/',
      moreBtn: '/services/people/fashion-glamour/',
      features: [
        { name: 'Facial Alterations', included: true },
        { name: 'Color Enhancements', included: true },
        { name: 'Shadow & Distraction Removal', included: true },
        { name: 'Body & Skin area Sculpting', included: true },
        { name: 'Wrinkle Removal', included: true },
        { name: 'Scars Removal', included: true },
        { name: 'Blemishes Removal', included: true },
        { name: 'Photo Composition', included: true }
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

export default PackagesPeopleRetouching;
