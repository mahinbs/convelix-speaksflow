
export const integrations = [
  {
    id: 'facebook',
    name: 'Facebook Lead Ads',
    description: 'Import leads directly from Facebook and Instagram advertising campaigns',
    icon: '📘',
    setupInstructions: 'Go to your Facebook Business Manager, navigate to Lead Ads, and add this webhook URL to receive leads automatically.'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Cloud API',
    description: 'Receive leads from WhatsApp Business and send follow-up messages',
    icon: '💬',
    setupInstructions: 'Configure your WhatsApp Business API webhook to send messages to this endpoint.'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Lead Gen',
    description: 'Sync leads from LinkedIn advertising and Sales Navigator',
    icon: '💼',
    setupInstructions: 'In LinkedIn Campaign Manager, set up Lead Gen Forms and configure the webhook integration.'
  },
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    description: 'Import leads from Google Sheets spreadsheets automatically',
    icon: '📊',
    setupInstructions: 'Use Google Apps Script or Zapier to send new rows from your sheet to this webhook.'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect with 5000+ apps through Zapier workflows',
    icon: '⚡',
    setupInstructions: 'In Zapier, create a new Zap and use "Webhooks by Zapier" as the action app with this URL.'
  },
  {
    id: 'google_forms',
    name: 'Google Forms',
    description: 'Automatically import responses from Google Forms',
    icon: '📝',
    setupInstructions: 'Use Google Apps Script to send form responses to this webhook URL.'
  },
  {
    id: 'typeform',
    name: 'Typeform',
    description: 'Import leads from Typeform responses',
    icon: '📋',
    setupInstructions: 'In your Typeform settings, add a webhook integration pointing to this URL.'
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    description: 'Advanced automation platform for complex workflows',
    icon: '🔄',
    setupInstructions: 'Create a new scenario in Make and use the HTTP module to send data to this webhook.'
  }
];
