import { Injectable } from '@angular/core';

export interface VehicleDecalInfo {
  id: string;
  make: string;
  model: string;
  plate: string;
  year?: number;
  color?: string;
  driverName?: string;
  stateProvince?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QrDecalService {

  triggerBlobDownload(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  generateAndDownloadCanvasQr(veh: VehicleDecalInfo, tagId: string, scanUrl: string): Promise<void> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve();
        return;
      }

      // Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 1200);
      bgGrad.addColorStop(0, '#0a0f1d');
      bgGrad.addColorStop(0.5, '#071224');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 1200);

      // Card Container
      const rx = 60, ry = 60, rw = 1080, rh = 1080, rad = 36;
      ctx.fillStyle = '#0b172d';
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, rad);
      ctx.fill();

      // Border Glow
      ctx.lineWidth = 4;
      const borderGrad = ctx.createLinearGradient(rx, ry, rx + rw, ry + rh);
      borderGrad.addColorStop(0, '#3b82f6');
      borderGrad.addColorStop(0.5, '#06b6d4');
      borderGrad.addColorStop(1, '#6366f1');
      ctx.strokeStyle = borderGrad;
      ctx.stroke();

      // Palette
      const textGold = '#fbbf24';
      const textCyan = '#38bdf8';
      const whiteColor = '#ffffff';
      const textMuted = '#94a3b8';
      const darkNavy = '#020617';

      // Header Banner
      const headerGrad = ctx.createLinearGradient(rx, ry, rx + rw, ry);
      headerGrad.addColorStop(0, '#1e3a8a');
      headerGrad.addColorStop(0.5, '#0369a1');
      headerGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = headerGrad;
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, 120, [rad, rad, 0, 0]);
      ctx.fill();

      // Header Text
      ctx.fillStyle = textGold;
      ctx.font = '900 38px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('TRAFFTAG', rx + 40, ry + 72);

      ctx.fillStyle = whiteColor;
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillText('• VEHICLE IDENTIFICATION DECAL', rx + 265, ry + 70);

      ctx.fillStyle = textMuted;
      ctx.font = 'bold 15px Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('OFFICIAL EMERGENCY & RECOVERY TAG', rx + rw - 40, ry + 70);

      // QR Code Block
      const qrBoxX = rx + 50;
      const qrBoxY = ry + 160;
      const qrBoxSize = 460;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 24);
      ctx.fill();

      // QR Image
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.onload = () => {
        ctx.drawImage(qrImg, qrBoxX + 30, qrBoxY + 30, qrBoxSize - 60, qrBoxSize - 60);

        // Sub text below QR
        ctx.fillStyle = darkNavy;
        ctx.font = '900 22px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN FOR VEHICLE OWNER ALERT', qrBoxX + qrBoxSize / 2, qrBoxY + qrBoxSize - 20);

        // Details Panel (Right side)
        const infoX = rx + 540;

        // Row 1: Alphanumeric Serial
        const alphaNum = tagId.toUpperCase();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(infoX, ry + 160, 480, 80, 16);
        ctx.fill();

        ctx.fillStyle = textCyan;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('TAG SERIAL NUMBER', infoX + 20, ry + 195);

        ctx.fillStyle = textGold;
        ctx.font = '900 28px monospace';
        ctx.fillText(alphaNum, infoX + 20, ry + 228);

        // Row 2: Linked Vehicle & Plate
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(infoX, ry + 260, 480, 140, 16);
        ctx.fill();

        ctx.fillStyle = textMuted;
        ctx.font = 'bold 14px Arial';
        ctx.fillText('LINKED VEHICLE', infoX + 20, ry + 295);

        ctx.fillStyle = whiteColor;
        ctx.font = 'bold 26px Arial';
        ctx.fillText(`${veh.make} ${veh.model}`.toUpperCase(), infoX + 20, ry + 332);

        ctx.fillStyle = textCyan;
        ctx.font = 'bold 20px monospace';
        ctx.fillText(`PLATE: ${veh.plate}`, infoX + 20, ry + 372);

        // Footer Banner
        const footY = ry + rh - 100;
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(rx + 40, footY, rw - 80, 70, 16);
        ctx.fill();

        ctx.fillStyle = whiteColor;
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`PROTECTED BY TRAFFTAG RECOVERY SYSTEM • SCAN URL: ${scanUrl}`, rx + rw / 2, footY + 42);

        // Trigger Download
        canvas.toBlob((blob) => {
          if (blob) {
            this.triggerBlobDownload(blob, `${veh.make}_${veh.model}_${veh.plate}_QR_Decal.png`);
          }
          resolve();
        }, 'image/png');
      };

      qrImg.onerror = () => {
        // Fallback without dynamic QR image
        ctx.fillStyle = darkNavy;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(tagId, qrBoxX + qrBoxSize / 2, qrBoxY + qrBoxSize / 2);

        canvas.toBlob((blob) => {
          if (blob) {
            this.triggerBlobDownload(blob, `${veh.make}_${veh.model}_${veh.plate}_QR_Decal.png`);
          }
          resolve();
        }, 'image/png');
      };

      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(scanUrl)}`;
    });
  }
}
