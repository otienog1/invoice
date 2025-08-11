from fpdf import FPDF
from app.models.invoice import Invoice
from app.services.email_service import EmailService

class InvoiceService:
    """Service for invoice operations"""
    
    def __init__(self):
        self.email_service = EmailService()
    
    def generate_pdf(self, invoice: Invoice):
        """Generate PDF for invoice"""
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font('Arial', 'B', 16)
        
        # Header
        pdf.cell(190, 10, f'Invoice #{invoice.invoice_number}', 0, 1, 'C')
        pdf.ln(10)
        
        # Company info (if available)
        if invoice.user.company_name:
            pdf.set_font('Arial', 'B', 12)
            pdf.cell(95, 10, invoice.user.company_name, 0, 1)
            if invoice.user.company_address:
                pdf.set_font('Arial', '', 10)
                pdf.multi_cell(95, 5, invoice.user.company_address)
        
        # Customer info
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(95, 10, 'Bill To:', 0, 1)
        pdf.set_font('Arial', '', 10)
        pdf.cell(95, 5, invoice.customer.name, 0, 1)
        if invoice.customer.email:
            pdf.cell(95, 5, invoice.customer.email, 0, 1)
        if invoice.customer.address:
            pdf.multi_cell(95, 5, invoice.customer.address)
        
        pdf.ln(10)
        
        # Invoice details
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(40, 10, 'Invoice Date:', 0, 0)
        pdf.set_font('Arial', '', 10)
        pdf.cell(40, 10, invoice.issue_date.strftime('%Y-%m-%d'), 0, 1)
        
        if invoice.due_date:
            pdf.set_font('Arial', 'B', 10)
            pdf.cell(40, 10, 'Due Date:', 0, 0)
            pdf.set_font('Arial', '', 10)
            pdf.cell(40, 10, invoice.due_date.strftime('%Y-%m-%d'), 0, 1)
        
        pdf.ln(10)
        
        # Items table header
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(80, 10, 'Description', 1, 0, 'C')
        pdf.cell(30, 10, 'Quantity', 1, 0, 'C')
        pdf.cell(30, 10, 'Rate', 1, 0, 'C')
        pdf.cell(30, 10, 'Total', 1, 1, 'C')
        
        # Items
        pdf.set_font('Arial', '', 9)
        for item in invoice.items:
            pdf.cell(80, 8, item.description[:30], 1, 0)
            pdf.cell(30, 8, str(item.quantity), 1, 0, 'C')
            pdf.cell(30, 8, f'${item.rate:.2f}', 1, 0, 'R')
            pdf.cell(30, 8, f'${item.total:.2f}', 1, 1, 'R')
        
        # Totals
        pdf.ln(5)
        pdf.set_font('Arial', 'B', 10)
        
        if invoice.discount_amount > 0:
            pdf.cell(140, 8, f'Discount ({invoice.discount_rate}%):', 0, 0, 'R')
            pdf.cell(30, 8, f'-${invoice.discount_amount:.2f}', 0, 1, 'R')
        
        if invoice.tax_amount > 0:
            pdf.cell(140, 8, f'Tax ({invoice.tax_rate}%):', 0, 0, 'R')
            pdf.cell(30, 8, f'${invoice.tax_amount:.2f}', 0, 1, 'R')
        
        pdf.cell(140, 8, 'Total Amount:', 0, 0, 'R')
        pdf.cell(30, 8, f'${invoice.total_amount:.2f}', 1, 1, 'R')
        
        # Notes
        if invoice.notes:
            pdf.ln(10)
            pdf.set_font('Arial', 'B', 10)
            pdf.cell(0, 10, 'Notes:', 0, 1)
            pdf.set_font('Arial', '', 9)
            pdf.multi_cell(0, 5, invoice.notes)
        
        return pdf.output(dest='S').encode('latin-1')
    
    def send_invoice_email(self, invoice: Invoice):
        """Send invoice via email"""
        if not invoice.customer.email:
            return {'success': False, 'error': 'Customer email not found'}
        
        # Generate PDF
        pdf_data = self.generate_pdf(invoice)
        
        # Send email
        return self.email_service.send_invoice_email(
            invoice, 
            invoice.customer.email, 
            pdf_data
        )