export const NOTIFICATION_TEMPLATES = {
  'booking.requested': {
    fr: {
      subject: 'Nouvelle réservation',
      text: 'Un client a demandé une prestation pour le {{day}}.',
      sms: 'Khadamat: Nouvelle réservation le {{day}}. Connectez-vous pour confirmer.'
    },
    ar: {
      subject: 'حجز جديد',
      text: 'طلب زبون خدمة ليوم {{day}}.',
      sms: 'خدمات: حجز جديد يوم {{day}}. الرجاء التأكيد.'
    }
  },
  'booking.confirmed': {
    fr: {
      subject: 'Réservation acceptée',
      text: 'Votre réservation pour le {{day}} est confirmée.',
      sms: 'Khadamat: Réservation acceptée pour le {{day}}.'
    },
    ar: {
      subject: 'تم قبول الحجز',
      text: 'تم تأكيد حجزك ليوم {{day}}.',
      sms: 'خدمات: تم قبول الحجز ليوم {{day}}.'
    }
  },
  'booking.rejected': {
    fr: {
      subject: 'Réservation refusée',
      text: 'Le prestataire a refusé la réservation.',
      sms: 'Khadamat: Réservation refusée.'
    },
    ar: {
      subject: 'تم رفض الحجز',
      text: 'قام مقدم الخدمة برفض الحجز.',
      sms: 'خدمات: تم رفض الحجز.'
    }
  },
  'booking.rescheduled.proposed': {
    fr: {
      subject: 'Proposition de nouvelle date',
      text: 'Le prestataire propose le {{day}}.',
      sms: 'Khadamat: Nouvelle date proposée: {{day}}.'
    },
    ar: {
      subject: 'اقتراح تاريخ جديد',
      text: 'يقترح مقدم الخدمة تاريخ {{day}}.',
      sms: 'خدمات: اقتراح تاريخ جديد: {{day}}.'
    }
  },
  'booking.rescheduled.accepted': {
    fr: {
      subject: 'Nouvelle date acceptée',
      text: 'La nouvelle date {{day}} est confirmée.',
      sms: 'Khadamat: Date {{day}} acceptée.'
    },
    ar: {
      subject: 'تم قبول التاريخ الجديد',
      text: 'تم تأكيد التاريخ الجديد {{day}}.',
      sms: 'خدمات: تم قبول التاريخ {{day}}.'
    }
  },
  'booking.cancelled': {
    fr: {
      subject: 'Réservation annulée',
      text: 'La réservation a été annulée.',
      sms: 'Khadamat: Réservation annulée.'
    },
    ar: {
      subject: 'تم إلغاء الحجز',
      text: 'تم إلغاء الحجز.',
      sms: 'خدمات: تم إلغاء الحجز.'
    }
  },
  'message.received': {
    fr: {
      subject: 'Nouveau message',
      text: 'Vous avez reçu un nouveau message.',
      sms: 'Khadamat: Nouveau message.'
    },
    ar: {
      subject: 'رسالة جديدة',
      text: 'لقد تلقيت رسالة جديدة.',
      sms: 'خدمات: رسالة جديدة.'
    }
  },
  'subscription.activated': {
    fr: {
      subject: 'Abonnement activé',
      text: 'Votre abonnement est maintenant actif.',
      sms: 'Khadamat: Abonnement activé.'
    },
    ar: {
      subject: 'تم تفعيل الاشتراك',
      text: 'أصبح اشتراكك فعالاً الآن.',
      sms: 'خدمات: تم تفعيل الاشتراك.'
    }
  },
  'subscription.renewed': {
    fr: {
      subject: 'Abonnement renouvelé',
      text: 'Votre abonnement a été renouvelé.',
      sms: 'Khadamat: Abonnement renouvelé.'
    },
    ar: {
      subject: 'تم تجديد الاشتراك',
      text: 'تم تجديد اشتراكك.',
      sms: 'خدمات: تم تجديد الاشتراك.'
    }
  },
  'subscription.cancelled': {
    fr: {
      subject: 'Abonnement annulé',
      text: 'Votre abonnement a été annulé.',
      sms: 'Khadamat: Abonnement annulé.'
    },
    ar: {
      subject: 'تم إلغاء الاشتراك',
      text: 'تم إلغاء اشتراكك.',
      sms: 'خدمات: تم إلغاء الاشتراك.'
    }
  }
} as const;

export type NotificationEvent = keyof typeof NOTIFICATION_TEMPLATES;

export function getNotificationTemplate(event: NotificationEvent, lang: 'fr' | 'ar', ctx: Record<string, any>) {
  const tmpl = NOTIFICATION_TEMPLATES[event][lang];
  const repl = (s?: string) =>
    s?.replace(/\{\{(\w+)\}\}/g, (_m, k) => (ctx[k] ?? '')) || '';
  return {
    subject: repl(tmpl.subject),
    text: repl(tmpl.text),
    sms: repl(tmpl.sms),
  };
}
