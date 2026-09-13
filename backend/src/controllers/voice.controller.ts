import type { Request, Response } from 'express';
import { AccessToken } from 'livekit-server-sdk';
import { v4 as uuidv4 } from 'uuid';

export const getVoiceToken = async (req: Request, res: Response) => {
  try {
    const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;

    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return res.status(500).json({ error: 'LiveKit credentials are not configured on the server.' });
    }

    // In a real app with auth, you would use req.user.businessId
    // Since this is a hackathon, we can use the businessId from the query params or default to biz-001
    const roomName = (req.query.room as string) || 'samvaya-voice-room';
    
    // Generate a participant identity (usually tied to user session)
    const participantName = `User-${uuidv4().substring(0, 4)}`;

    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: participantName,
      name: participantName,
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    res.json({ token, url: process.env.LIVEKIT_URL });
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    res.status(500).json({ error: 'Failed to generate voice session token' });
  }
};
