type BookingCtx = { day: string; providerName?: string; clientName?: string };
export function template(type: string, lang: 'fr'|'ar' = 'fr', ctx: BookingCtx) {
  const L = {
    fr: {
      BOOKING_REQUEST:              (c:BookingCtx)=>`Khadamat: Nouvelle réservation le ${c.day}. Connectez-vous pour confirmer.`,
      BOOKING_CONFIRMED:            (c:BookingCtx)=>`Khadamat: Réservation acceptée pour le ${c.day}. Fixez l’horaire via la messagerie.`,
      BOOKING_REJECTED:             ()=>`Khadamat: Réservation refusée.`,
      BOOKING_RESCHEDULE_PROPOSED:  (c:BookingCtx)=>`Khadamat: Nouveau jour proposé: ${c.day}.`,
      BOOKING_RESCHEDULE_ACCEPTED:  (c:BookingCtx)=>`Khadamat: Nouveau jour accepté: ${c.day}.`,
      BOOKING_CANCELLED:            ()=>`Khadamat: Réservation annulée.`,
      SUBSCRIPTION_ACTIVATED:       ()=>`Khadamat: Abonnement Club Pro activé. Merci!`
    },
    ar: {
      BOOKING_REQUEST:              (c:BookingCtx)=>`خدمات: حجز جديد يوم ${c.day}. الرجاء التأكيد.`,
      BOOKING_CONFIRMED:            (c:BookingCtx)=>`خدمات: تم قبول الحجز ليوم ${c.day}. حدّدوا الساعة عبر الرسائل.`,
      BOOKING_REJECTED:             ()=>`خدمات: تم رفض الحجز.`,
      BOOKING_RESCHEDULE_PROPOSED:  (c:BookingCtx)=>`خدمات: اقتراح تاريخ جديد: ${c.day}.`,
      BOOKING_RESCHEDULE_ACCEPTED:  (c:BookingCtx)=>`خدمات: تم قبول التاريخ الجديد: ${c.day}.`,
      BOOKING_CANCELLED:            ()=>`خدمات: تم إلغاء الحجز.`,
      SUBSCRIPTION_ACTIVATED:       ()=>`خدمات: تفعيل اشتراك كلوب برو. شكراً!`
    }
  } as const;
  const t = (L[lang] as any)[type];
  return t ? t(ctx) : `Khadamat: mise à jour de votre réservation.`;
}
