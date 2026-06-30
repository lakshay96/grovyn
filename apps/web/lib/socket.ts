import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === 'undefined') return null;
  if (!socket) {
    const token = localStorage.getItem('grovyn_token') ?? undefined;
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
      timeout: 5000,
      transports: ['websocket', 'polling'],
      auth: { token },
    });
    socket.on('connect_error', () => {});
  }
  return socket;
}
