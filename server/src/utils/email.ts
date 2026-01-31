import { LoopsClient } from 'loops';

const LOOPS_API_KEY = Deno.env.get('LOOPS_API_KEY');
const loops = LOOPS_API_KEY ? new LoopsClient(LOOPS_API_KEY) : null;

const EMAIL_TEMPLATES = {
  WELCOME: Deno.env.get('LOOPS_WELCOME_EMAIL_ID') || '',
};

interface SendEmailOptions {
  to: string;
  templateId: string;
  dataVariables?: Record<string, string | number>;
  addToAudience?: boolean;
}

interface CreateContactOptions {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!loops) {
    console.log('📧 Loops not configured - skipping email to:', options.to);
    return false;
  }

  if (!options.templateId) {
    console.warn('📧 No template ID provided for email to:', options.to);
    return false;
  }

  try {
    await loops.sendTransactionalEmail({
      transactionalId: options.templateId,
      email: options.to,
      dataVariables: options.dataVariables,
      addToAudience: options.addToAudience,
    });
    console.log('✅ Email sent to:', options.to);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}

export async function createOrUpdateContact(options: CreateContactOptions): Promise<boolean> {
  if (!loops) {
    console.log('📧 Loops not configured - skipping contact creation for:', options.email);
    return false;
  }

  const properties = {
    firstName: options.firstName || null,
    lastName: options.lastName || null,
    source: options.source || 'App Signup',
  };

  try {
    await loops.createContact({ email: options.email, ...properties });
    console.log('✅ Contact added to Loops:', options.email);
    return true;
  } catch (_createError) {
    try {
      await loops.updateContact({ email: options.email, ...properties });
      console.log('✅ Contact updated in Loops:', options.email);
      return true;
    } catch (updateError) {
      console.error('❌ Failed to create/update contact:', updateError);
      return false;
    }
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const firstName = name ? name.split(' ')[0] : '';

  await createOrUpdateContact({
    email,
    firstName,
    lastName: name ? name.split(' ').slice(1).join(' ') : '',
    source: 'App Signup',
  });

  return sendEmail({
    to: email,
    templateId: EMAIL_TEMPLATES.WELCOME,
    dataVariables: {
      firstName: firstName || 'there',
    },
  });
}

export function isEmailConfigured(): boolean {
  return !!loops;
}
