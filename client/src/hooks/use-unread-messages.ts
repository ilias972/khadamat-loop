import { useState } from 'react';

// Hook simulé pour la démo. À connecter à la vraie logique plus tard.
export function useUnreadMessages() {
  // TODO: Remplacer par la vraie logique (ex: via context, socket, ou firebase)
  const [hasUnread] = useState(false); // Simule qu'il n'y a PAS de messages non lus
  return hasUnread;
} 