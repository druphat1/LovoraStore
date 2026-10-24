// Single source of truth for store contact details.
// Name, address, phone and GSTIN come from the shop-front photo supplied with the
// references. Hours, email and WhatsApp availability are assumptions — edit them
// here and every page updates.
export const STORE = {
  name: 'Lovely Gift Center',
  tagline: 'Curated Joy & Toys',
  legalName: 'M/S R.K. Traders',
  gstin: '03ABXPK7044G1ZG',
  since: 2018,
  address: {
    line1: 'Lovely Gift Centre, Super Bazar',
    city: 'Pathankot',
    state: 'Punjab',
    pin: '145001',
  },
  phoneDisplay: '+91 98880 78357',
  phoneHref: 'tel:+919888078357',
  whatsappNumber: '919888078357',
  email: 'support@lovelygiftcenter.com',
  hours: '10:00 AM – 9:30 PM',
  hoursShort: '10 AM - 9:30 PM',
  mapsQuery: 'Lovely Gift Centre Super Bazar Pathankot Punjab',
  freeShippingThreshold: 499,
  deliveryFee: 49,
};

export const FULL_ADDRESS = `${STORE.address.line1}, ${STORE.address.city}, ${STORE.address.state} ${STORE.address.pin}`;

export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.mapsQuery)}`;
export const MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(STORE.mapsQuery)}&z=16&output=embed`;
