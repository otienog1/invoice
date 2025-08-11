import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

class EmailService:
    """Service for sending emails"""
    
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
        self.from_email = os.getenv('FROM_EMAIL', self.smtp_username)
    
    def send_invoice_email(self, invoice, to_email, pdf_data):
        """Send invoice via email with PDF attachment"""
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = f'Invoice #{invoice.invoice_number} from {invoice.user.name}'
            
            # Email body
            body = self._create_invoice_email_body(invoice)
            msg.attach(MIMEText(body, 'html'))
            
            # Attach PDF
            pdf_attachment = MIMEApplication(pdf_data, _subtype='pdf')
            pdf_attachment.add_header(
                'Content-Disposition', 
                f'attachment; filename=invoice_{invoice.invoice_number}.pdf'
            )
            msg.attach(pdf_attachment)
            
            # Send email
            if not self.smtp_username or not self.smtp_password:
                return {'success': False, 'error': 'Email configuration not found'}
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            return {'success': True}
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _create_invoice_email_body(self, invoice):
        """Create HTML email body for invoice"""
        return f"""
        <html>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Invoice #{invoice.invoice_number}</h2>
                
                <p>Dear {invoice.customer.name},</p>
                
                <p>Please find attached your invoice for the amount of <strong>${invoice.total_amount:.2f}</strong>.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #495057;">Invoice Details</h3>
                    <p><strong>Invoice Number:</strong> {invoice.invoice_number}</p>
                    <p><strong>Issue Date:</strong> {invoice.issue_date.strftime('%B %d, %Y')}</p>
                    {f'<p><strong>Due Date:</strong> {invoice.due_date.strftime("%B %d, %Y")}</p>' if invoice.due_date else ''}
                    <p><strong>Total Amount:</strong> ${invoice.total_amount:.2f}</p>
                </div>
                
                {f'<div style="margin: 20px 0;"><h4>Description:</h4><p>{invoice.description}</p></div>' if invoice.description else ''}
                
                {f'<div style="margin: 20px 0;"><h4>Notes:</h4><p>{invoice.notes}</p></div>' if invoice.notes else ''}
                
                <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
                
                <p>Thank you for your business!</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                    <p style="margin: 0;"><strong>{invoice.user.name}</strong></p>
                    {f'<p style="margin: 5px 0;">{invoice.user.company_name}</p>' if invoice.user.company_name else ''}
                    <p style="margin: 5px 0;">{invoice.user.email}</p>
                    {f'<p style="margin: 5px 0;">{invoice.user.phone}</p>' if invoice.user.phone else ''}
                </div>
            </div>
        </body>
        </html>
        """
    
    def send_notification_email(self, to_email, subject, body):
        """Send generic notification email"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'html'))
            
            if not self.smtp_username or not self.smtp_password:
                return {'success': False, 'error': 'Email configuration not found'}
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            return {'success': True}
            
        except Exception as e:
            return {'success': False, 'error': str(e)}