import { STORE } from '../config/store';

export const whatsappLink = (text = '') =>
  `https://wa.me/${STORE.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const openWhatsApp = (text: string) => window.open(whatsappLink(text), '_blank', 'noopener,noreferrer');
