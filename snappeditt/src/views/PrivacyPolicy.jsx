import React from 'react';
import SEO from '@/components/SEO/SEO';
const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <SEO
        title="Privacy Policy | SnappEditt"
        description="This Privacy Policy outlines how SnappEditt collects, uses, and protects your personal information. We are committed to safeguarding your privacy and ensuring the security of your data."
        keywords="privacy policy, data protection, personal information, SnappEditt"
      />
      <header className="mb-8">
        <h1 className="text-4xl font-semibold font-cursive text-black text-center mb-4">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: 15/03/2024</p>
      </header>

      <main className="space-y-8">
        <section>
          <h2 className="text-xl font-medium font-secondry text-primaryRed mb-4">Collection and Use of Personal Information</h2>
          <p className="text-gray-700 mb-4">
            Our company does not rent, sell, or share personal information about you with other people or non-affiliated companies except to provide products or services you’ve requested, when we have your permission. We collect personal information that you provide to us such as name, address, contact information, passwords and security data, and payment information. All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information. Some information – such as IP address and/or browser and device characteristics – is collected automatically when you visit our Service. WHAT DO WE USE YOUR DATA FOR ? The main reason to gather your certain personal information is for providing great services to our customers in an efficient manner. With this information, we are able to deliver personalized user access for the best use of our services to our website features along with offers newsletters and new updates in the system. Part of the data is collected to ensure the proper functioning of the website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium font-secondry text-primaryRed mb-4">Data Protection</h2>
          <p className="text-gray-700 mb-4">
            The operators of this website take the protection of your personal data very seriously. We treat your personal data as confidential and in accordance with the statutory data protection regulations and this privacy policy. Please note that data transmitted via the internet (e.g. via email communication) may be subject to security breaches. Complete protection of your data from third-party access is not possible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium font-secondry text-primaryRed mb-4">Public Information</h2>
          <p className="text-gray-700 mb-4">
            The photos and pictures that you submit here and the processed output of the same are NOT accessible to anyone else other than you unless you explicitly consent to. You should carefully consider while sharing the pictures on any of the online platforms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium font-secondry text-primaryRed mb-4">Your Responsibility</h2>
          <p className="text-gray-700 mb-4">
            Do not divulge your account number or password to any third party. You are responsible for maintaining the confidentiality of your account number and password. You are responsible for all uses of your account, whether or not actually or expressly authorized by you. We cannot be held responsible for any activity in your account which results from your failure to keep your own password secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium font-secondry text-primaryRed mb-4">What are your privacy Rights ?</h2>
          <p className="text-gray-700 mb-4">
            You always have the right to request information about your stored data, its origin, its recipients, and the purpose of its collection at no charge. You also have the right to request that it be corrected, blocked, or deleted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium font-secondry text-primaryRed mb-4">Changes & Updates</h2>
          <p className="text-gray-700 mb-4">As this Privacy Policy may be updated from time to time, we will revise and display the effective date at the top of this web page. You should periodically review it to keep abreast of our plans and procedures to protect the personal information that we collect. Your continued use of the Snappeditt services constitutes your agreement to this Privacy Policy and any updates.</p>
        </section>

        <section>
          <h2 className="text-xl font-medium font-secondry text-primaryRed mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions or comments about this Privacy Policy, the practices of this Site, or your dealings with us, you can contact is sending email to: <a href="mailto: sales@snappeditt.com" className="text-blue-600 hover:underline">
              sales@snappeditt.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium font-secondry text-primaryRed mb-4">How can you contact us about this policy</h2>
          <p className="text-gray-700 mb-4">
            You can send us questions via the contact form, we will collect the data entered on the form, including the contact details you provide, to answer your question and any follow-up questions. We do not share this information without your permission. We will retain the data you provide on the contact form until you request its deletion, revoke your consent for its storage, or the purpose for its storage no longer pertains (e.g. after fulfilling your request). Any mandatory statutory provisions, especially those regarding mandatory data retention periods, remain unaffected by this provision.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium font-secondry text-primaryRed mb-4">Cookies</h2>
          <p className="text-gray-700 mb-4">
            Some of our web pages use cookies. Cookies do not harm your computer and do not contain any viruses. Cookies help make our website more user-friendly, efficient, and secure. Cookies are small text files that are stored on your computer and saved by your browser. Most of the cookies we use are so-called “session cookies.” They are automatically deleted after your visit. Other cookies remain in your device’s memory until you delete them. These cookies make it possible to recognize your browser when you next visit the site. You can configure your browser to inform you about the use of cookies so that you can decide on a case-by-case basis whether to accept or reject a cookie. Alternatively, your browser can be configured to automatically accept cookies under certain conditions or to always reject them, or to automatically delete cookies when closing your browser. Disabling cookies may limit the functionality of this website.
          </p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;