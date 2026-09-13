// ==============================================================================
// DigiLocker Controller
// HTTP endpoints for DigiLocker initiate, mock consent, callback, document pull
// ==============================================================================

import type { Request, Response } from 'express';
import { DigiLockerService } from '../services/digilocker.service.js';

export class DigiLockerController {
  /**
   * 1. POST /api/v2/digilocker/initiate
   */
  static async initiate(req: Request, res: Response) {
    try {
      const userId = (req.body?.userId as string) || (req.headers['x-user-id'] as string) || 'biz-001';
      const documentType = req.body?.documentType;
      const platform = req.body?.platform;
      const redirectUrl = req.body?.redirectUrl;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required to initiate KYC verification',
        });
      }

      const clientIp = (req.ip || req.socket.remoteAddress) ?? undefined;
      const userAgent = (req.headers['user-agent'] as string) ?? undefined;

      const result = await DigiLockerService.initiateVerification({
        userId,
        documentType,
        platform,
        redirectUrl,
        clientIp,
        userAgent,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('[DigiLocker Controller] Initiation error:', error.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to initiate DigiLocker session. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mock consent UI (sandbox) — Approve / Decline without Setu
   * GET /api/v2/digilocker/mock-consent
   */
  static async mockConsent(req: Request, res: Response) {
    const query = req.query as Record<string, string | undefined>;
    const requestId = query.requestId || '';
    const state = query.state || '';
    const documentType = query.documentType || 'PAN';
    const action = query.action;

    if (!requestId || !state) {
      return res.status(400).send('Missing requestId or state');
    }

    // Auto-complete when user clicks Approve / Decline
    if (action === 'approve' || action === 'decline') {
      const callback = new URL(
        process.env.DIGILOCKER_REDIRECT_URL ||
          'http://localhost:5000/api/v2/digilocker/callback'
      );
      callback.searchParams.set('requestId', requestId);
      callback.searchParams.set('state', state);
      callback.searchParams.set('status', action === 'approve' ? 'success' : 'denied');
      if (action === 'decline') {
        callback.searchParams.set('error_reason', 'user_declined');
      }
      return res.redirect(302, callback.toString());
    }

    const approveUrl = `?requestId=${encodeURIComponent(requestId)}&state=${encodeURIComponent(state)}&documentType=${encodeURIComponent(documentType)}&action=approve`;
    const declineUrl = `?requestId=${encodeURIComponent(requestId)}&state=${encodeURIComponent(state)}&documentType=${encodeURIComponent(documentType)}&action=decline`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DigiLocker Consent (Sandbox)</title>
  <style>
    :root { color-scheme: light; font-family: "Segoe UI", system-ui, sans-serif; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f3f6f1; color: #14201a; }
    .card { width: min(420px, 92vw); background: #fff; border: 1px solid #d7e0d4; border-radius: 20px; padding: 28px; box-shadow: 0 18px 40px rgba(20,32,26,.08); }
    .badge { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #4d7c0f; background: #ecfccb; padding: 6px 10px; border-radius: 999px; }
    h1 { margin: 14px 0 8px; font-size: 1.4rem; }
    p { margin: 0 0 18px; color: #4b5a52; line-height: 1.5; font-size: .95rem; }
    .meta { background: #f7faf6; border-radius: 12px; padding: 12px 14px; font-size: .82rem; color: #33443c; margin-bottom: 20px; word-break: break-all; }
    .actions { display: grid; gap: 10px; }
    a { text-decoration: none; text-align: center; border-radius: 12px; padding: 12px 14px; font-weight: 700; }
    .approve { background: #65a30d; color: #fff; }
    .decline { background: #fff; color: #7f1d1d; border: 1px solid #fecaca; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Sandbox DigiLocker</span>
    <h1>Share ${documentType} with Samvaya?</h1>
    <p>This is the local DigiLocker consent simulator. Approve to complete KYC without Setu credentials.</p>
    <div class="meta"><strong>Request</strong><br/>${requestId}</div>
    <div class="actions">
      <a class="approve" href="${approveUrl}">Approve &amp; share document</a>
      <a class="decline" href="${declineUrl}">Decline</a>
    </div>
  </div>
</body>
</html>`);
  }

  /**
   * 2. GET /api/v2/digilocker/callback
   */
  static async callback(req: Request, res: Response) {
    try {
      const query = req.query as Record<string, string | undefined>;
      const requestId = query.requestId;
      const id = query.id;
      const state = query.state;
      const status = query.status;
      const code = query.code ?? undefined;
      const success = query.success;
      const errCode = query.errCode;
      const errorReason = (query.error_reason || query.error_description || query.errMessage) ?? undefined;

      if (!requestId && !id) {
        return res.status(400).json({
          success: false,
          error: 'Missing required callback parameters: requestId or id',
        });
      }

      const { redirectTarget } = await DigiLockerService.handleCallback({
        requestId,
        id,
        state,
        status,
        code,
        success,
        errCode,
        errorReason,
      });

      return res.redirect(302, redirectTarget);
    } catch (error: any) {
      console.error('[DigiLocker Controller] Callback error:', error.message);
      const failureUrl =
        process.env.DIGILOCKER_FRONTEND_FAILURE_URL ||
        'http://localhost:5173/business?kyc=failed';
      const sep = failureUrl.includes('?') ? '&' : '?';
      return res.redirect(
        302,
        `${failureUrl}${sep}error=${encodeURIComponent(error.message)}`
      );
    }
  }

  /**
   * 3. GET /api/v2/digilocker/documents/:requestId
   */
  static async getDocuments(req: Request, res: Response) {
    try {
      const requestId = req.params.requestId;

      if (!requestId) {
        return res.status(400).json({
          success: false,
          error: 'Request ID is required',
        });
      }

      const verifiedDoc = await DigiLockerService.fetchVerifiedDocuments(requestId);

      return res.status(200).json({
        success: true,
        data: verifiedDoc,
      });
    } catch (error: any) {
      console.error('[DigiLocker Controller] Document fetch error:', error.message);
      return res.status(error.message.includes('not found') ? 404 : 400).json({
        success: false,
        error: error.message || 'Unable to retrieve verified documents.',
      });
    }
  }

  /**
   * 4. POST /api/v2/digilocker/revoke
   */
  static async revoke(req: Request, res: Response) {
    try {
      const requestId = req.body?.requestId;

      if (!requestId) {
        return res.status(400).json({
          success: false,
          error: 'Request ID is required for token revocation',
        });
      }

      const result = await DigiLockerService.revokeToken(requestId);

      return res.status(200).json({
        success: true,
        message: 'DigiLocker access token revoked successfully',
        data: result,
      });
    } catch (error: any) {
      console.error('[DigiLocker Controller] Revoke error:', error.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to revoke token',
      });
    }
  }

  /**
   * 5. GET /api/v2/digilocker/status/:requestId
   */
  static async getStatus(req: Request, res: Response) {
    try {
      const requestId = req.params.requestId;
      if (!requestId) {
        return res.status(400).json({ success: false, error: 'Request ID is required' });
      }

      const verification = DigiLockerService.getVerificationStatus(requestId);

      if (!verification) {
        return res.status(404).json({
          success: false,
          error: 'Verification request not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          requestId: verification.requestId,
          userId: verification.userId,
          documentType: verification.documentType,
          status: verification.verificationStatus,
          panNumberMasked: verification.panNumberMasked,
          digitalSignatureValid: verification.digitalSignatureValid,
          consentTimestamp: verification.consentTimestamp,
          updatedAt: verification.updatedAt,
          mode: DigiLockerService.getMode(),
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch status',
      });
    }
  }

  /**
   * 6. GET /api/v2/digilocker/user/:userId
   */
  static async getUserVerifications(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID is required' });
      }

      const verifications = DigiLockerService.getUserVerifications(userId);

      return res.status(200).json({
        success: true,
        data: verifications,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch user verifications',
      });
    }
  }
}
