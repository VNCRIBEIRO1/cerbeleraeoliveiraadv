'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP || '5518996101884';
  const message = encodeURIComponent(
    'Olá! Gostaria de informações sobre os serviços do escritório Cerbelera & Oliveira Advogados.'
  );

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors group"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      aria-label="Contato via WhatsApp"
      title="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />

      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25" />

      {/* Tooltip */}
      <span className="absolute right-full mr-3 bg-white text-secondary-700 text-sm px-4 py-2 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Fale pelo WhatsApp
      </span>
    </motion.a>
  );
}
