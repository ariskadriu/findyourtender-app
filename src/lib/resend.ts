import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: 'FindYourTender <noreply@findyourtender.com>',
    to,
    subject: 'Mirë se vini në FindYourTender! 🎉',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #F5F7FA; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <h1 style="color: #1A3A6B; font-size: 28px; margin-bottom: 8px;">
            FindYour<span style="color: #F0A500;">Tender</span>
          </h1>
          <p style="color: #6B7280; font-size: 14px; margin-bottom: 32px;">Gjej. Krahaso. Shko.</p>
          <h2 style="color: #1A3A6B; font-size: 22px;">Mirë se vini, ${name}! 👋</h2>
          <p style="color: #374151; line-height: 1.6;">
            Llogaria juaj është krijuar me sukses. Jeni gati të gjeni tenderët më të mirë në Kosovë!
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" 
             style="display: inline-block; background: #F0A500; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 24px;">
            Fillo Abonimi
          </a>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
          <p style="color: #9CA3AF; font-size: 12px;">FindYourTender · Prishtinë, Kosovë</p>
        </div>
      </div>
    `,
  });
}

export async function sendPaymentConfirmationEmail(to: string, name: string) {
  await resend.emails.send({
    from: 'FindYourTender <noreply@findyourtender.com>',
    to,
    subject: 'Pagesa u konfirmua — Aksesi juaj është aktiv! ✅',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #F5F7FA; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <h1 style="color: #1A3A6B; font-size: 28px; margin-bottom: 8px;">
            FindYour<span style="color: #F0A500;">Tender</span>
          </h1>
          <h2 style="color: #1A3A6B; font-size: 22px;">Pagesa u konfirmua! 🎉</h2>
          <p style="color: #374151; line-height: 1.6;">
            Faleminderit, ${name}! Abonimi juaj mujor €10 është aktiv. Tani keni qasje të plotë në të gjithë tenderët e Kosovës.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/tenders" 
             style="display: inline-block; background: #1A3A6B; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 24px;">
            Shiko Tenderat →
          </a>
        </div>
      </div>
    `,
  });
}

export async function sendPaymentFailedEmail(to: string, name: string) {
  await resend.emails.send({
    from: 'FindYourTender <noreply@findyourtender.com>',
    to,
    subject: 'Pagesa dështoi — Rinovoni abonimin tuaj',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #F5F7FA; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px;">
          <h1 style="color: #1A3A6B; font-size: 28px;">FindYour<span style="color: #F0A500;">Tender</span></h1>
          <h2 style="color: #DC2626; font-size: 22px;">Pagesa dështoi ⚠️</h2>
          <p style="color: #374151; line-height: 1.6;">
            ${name}, pagesa juaj mujore nuk u procesua. Ju lutemi përditësoni metodën e pagesës.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" 
             style="display: inline-block; background: #DC2626; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 24px;">
            Rinovoni Abonimin
          </a>
        </div>
      </div>
    `,
  });
}

export async function sendContactEmail(from: string, name: string, message: string) {
  await resend.emails.send({
    from: 'FindYourTender Contact <noreply@findyourtender.com>',
    to: process.env.ADMIN_EMAIL || 'info@findyourtender.com',
    subject: `Mesazh i ri nga ${name}`,
    html: `
      <p><strong>Emri:</strong> ${name}</p>
      <p><strong>Email:</strong> ${from}</p>
      <p><strong>Mesazhi:</strong></p>
      <p>${message}</p>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, link: string) {
  await resend.emails.send({
    from: 'FindOurTender <noreply@findyourtender.com>',
    to,
    subject: 'Rivendosja e fjalëkalimit tuaj 🔐',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #F5F7FA; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <h1 style="color: #1A3A6B; font-size: 28px; margin-bottom: 8px;">
            FindYour<span style="color: #F0A500;">Tender</span>
          </h1>
          <h2 style="color: #1A3A6B; font-size: 20px; border-bottom: 2px solid #F0A500; padding-bottom: 8px; display: inline-block;">Rivendosja e Fjalëkalimit</h2>
          <p style="color: #374151; line-height: 1.6; margin-top: 24px;">
            Kemi marrë një kërkesë për të rivendosur fjalëkalimin tuaj. Klikoni butonin më poshtë për të zgjedhur një fjalëkalim të ri.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${link}" 
               style="display: inline-block; background: #1A3A6B; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(26,58,107,0.2);">
              Rivendos Fjalëkalimin →
            </a>
          </div>
          <p style="color: #6B7280; font-size: 13px;">
            Nëse nuk e keni kërkuar këtë, ju lutemi injoroni këtë email. Ky link do të skadojë së shpejti.
          </p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
          <p style="color: #9CA3AF; font-size: 11px; text-align: center;">© 2024 FindYourTender. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </div>
    `,
  });
}

