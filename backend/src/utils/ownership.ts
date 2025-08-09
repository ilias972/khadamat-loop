export function assertParticipant(userId: number, a: number, b: number) {
  if (userId !== a && userId !== b) {
    const err: any = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
}

