import { Helmet } from "react-helmet-async";
import React from "react";

const SEO = ({
  title = "Professional Editing Services | Photo Retouching Services | SnappEditt",
  description = "SnappEditt offers expert Photo Post-Production Services to ensure you get perfect-picture photos at cost-effective rates. We are currently serving a wide range of clients all around the globe. View the list of photo retouching services ⟾ and order online!",
  keywords = "photo editing, retouching, ecommerce editing, background removal",
  canonical = window.location.href
}) => {
  return (
    <Helmet>
      {/* Basic Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Social Media Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;