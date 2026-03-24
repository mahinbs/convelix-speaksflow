
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  formType: string;
}

const getSubjectLine = (formType: string): string => {
  switch (formType) {
    case 'demo':
      return '🎯 New Demo Request - Convelix';
    case 'pricing':
      return '💰 Custom Pricing Inquiry - Convelix';
    case 'consultation':
      return '🤝 Free Consultation Request - Convelix';
    case 'expert':
      return '👨‍💼 Expert Consultation Request - Convelix';
    default:
      return '📧 New Contact Form Submission - Convelix';
  }
};

const getFormTypeLabel = (formType: string): string => {
  switch (formType) {
    case 'demo':
      return 'Demo Request';
    case 'pricing':
      return 'Pricing Inquiry';
    case 'consultation':
      return 'Free Consultation';
    case 'expert':
      return 'Expert Consultation';
    default:
      return 'General Inquiry';
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, message, formType }: ContactFormData = await req.json();

    console.log('Processing contact form submission:', { name, email, formType });

    // Send notification email to support team
    const supportEmailResponse = await resend.emails.send({
      from: "Convelix Contact Form <onboarding@resend.dev>",
      to: ["support@Convelix.com"],
      subject: getSubjectLine(formType),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New ${getFormTypeLabel(formType)} Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #475569; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          </div>

          <div style="background-color: #fefefe; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <h3 style="color: #475569; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Form Type:</strong> ${getFormTypeLabel(formType)}
            </p>
            <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">
              Submitted via Convelix landing page
            </p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Convelix Support <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting Convelix! We'll be in touch soon.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            Thank you for reaching out!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>We've received your ${getFormTypeLabel(formType).toLowerCase()} and our team will get back to you within 24 hours.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #475569; margin-top: 0;">What's Next?</h3>
            <ul style="color: #64748b; line-height: 1.8;">
              <li>Our team will review your request</li>
              <li>We'll reach out to schedule a time that works for you</li>
              <li>Come prepared with any specific questions about your lead qualification needs</li>
            </ul>
          </div>

          <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Need immediate assistance?</strong>
            </p>
            <p style="margin: 10px 0 0 0; color: #64748b;">
              Email us directly at <a href="mailto:support@Convelix.com" style="color: #3b82f6;">support@Convelix.com</a>
            </p>
          </div>

          <p>Best regards,<br>
          The Convelix Team</p>
        </div>
      `,
    });

    console.log("Emails sent successfully:", {
      support: supportEmailResponse,
      customer: customerEmailResponse
    });

    return new Response(JSON.stringify({ 
      success: true,
      supportEmailId: supportEmailResponse.data?.id,
      customerEmailId: customerEmailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
