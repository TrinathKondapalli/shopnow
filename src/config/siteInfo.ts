// DEMO VALUES — replace with client details before launch

export const SITE_INFO = {
  domain: 'https://shopnow-orpin-nine.vercel.app',

  contact: {
    phone: '+91 90000 00000',
    phoneHref: 'tel:+919000000000',
    whatsapp: '+91 90000 00000',
    whatsappUrl: 'https://wa.me/919000000000',
    email: 'support@shopnow-demo.com',
    emailHref: 'mailto:support@shopnow-demo.com',
    address: 'SHOPNOW Fashion Pvt. Ltd., 2nd Floor, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
    hours: 'Mon–Sat, 10 AM – 7 PM',
  },

  policies: {
    privacyUrl: '/privacy-policy',
    termsUrl: '/terms',
    shippingUrl: '/shipping-policy',
    returnsUrl: '/returns',
    notice: 'This policy is being updated. For questions, contact support@shopnow-demo.com.',
  },

  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/',
  },

  delivery: {
    message: 'Ships in 1–2 days · Delivered in 3–7 working days',
    badge: '3–7 Working Days',
    pincodeValid: (pincode: string) => `Delivery in 3–7 working days to ${pincode}`,
    pincodeInvalid: 'Enter a valid 6-digit pincode',
  },

  affiliate: {
    signupUrl: '/affiliate#join',
    termsUrl: '/affiliate-terms',
    termsNotice: 'Terms are being finalised. Contact support@shopnow-demo.com.',
    commissionRate: '10%',
    commissionCondition: '10% on every successful sale (order delivered and not returned)',
    milestones: [
      { id: 'saree', reward: '1 Saree', condition: 'After 5 successful sales', window: 'within 90 days of joining' },
      { id: 'silver', reward: '5g Silver', condition: 'After 15 successful sales', window: 'within 90 days of joining' },
      { id: 'gold', reward: '0.5g Gold', condition: 'After 30 successful sales', window: 'within 90 days of joining' },
    ],
    faqs: [
      {
        q: 'Who can join?',
        a: 'Anyone in India aged 18+ with a social media account, blog or WhatsApp community.',
      },
      {
        q: 'How do I earn?',
        a: 'Share your unique link. You earn 10% on every order placed through it that is delivered and not returned.',
      },
      {
        q: 'When do I get paid?',
        a: 'Commission is paid monthly by bank transfer or UPI, for orders completed in the previous month.',
      },
      {
        q: 'How do the gold, silver and saree rewards work?',
        a: 'Reach the number of successful sales within 90 days of joining. Rewards are delivered within 30 days of reaching the milestone.',
      },
      {
        q: 'Is there a joining fee?',
        a: 'No. Joining is free.',
      },
    ],
  },
} as const;
