from fpdf import FPDF
from io import BytesIO

class PDFService:
    """Service for PDF generation"""
    
    def __init__(self):
        self.font_family = 'Arial'
        self.default_font_size = 10
    
    def create_invoice_pdf(self, invoice_data):
        """Create PDF from invoice data"""
        pdf = FPDF()
        pdf.add_page()
        
        # Set fonts
        pdf.set_font(self.font_family, 'B', 16)
        
        # Title
        pdf.cell(0, 10, f'Invoice #{invoice_data["invoice_number"]}', 0, 1, 'C')
        pdf.ln(10)
        
        # Company and customer info
        self._add_header_info(pdf, invoice_data)
        
        # Invoice details
        self._add_invoice_details(pdf, invoice_data)
        
        # Items table
        self._add_items_table(pdf, invoice_data['items'])
        
        # Totals
        self._add_totals_section(pdf, invoice_data)
        
        # Notes and terms
        self._add_notes_section(pdf, invoice_data)
        
        return pdf.output(dest='S').encode('latin-1')
    
    def _add_header_info(self, pdf, invoice_data):
        """Add company and customer information"""
        # Company info (left side)
        pdf.set_font(self.font_family, 'B', 12)
        if invoice_data.get('company_name'):
            pdf.cell(95, 6, invoice_data['company_name'], 0, 0)
        
        # Customer info (right side)
        pdf.cell(95, 6, 'Bill To:', 0, 1)
        
        pdf.set_font(self.font_family, '', 10)
        if invoice_data.get('company_address'):
            pdf.multi_cell(95, 5, invoice_data['company_address'], 0, 'L')
        
        # Customer details
        y_pos = pdf.get_y()
        pdf.set_xy(105, y_pos - 20)
        pdf.cell(95, 5, invoice_data['customer_name'], 0, 1)
        
        if invoice_data.get('customer_email'):
            pdf.set_x(105)
            pdf.cell(95, 5, invoice_data['customer_email'], 0, 1)
        
        if invoice_data.get('customer_address'):
            pdf.set_x(105)
            pdf.multi_cell(95, 5, invoice_data['customer_address'], 0, 'L')
    
    def _add_invoice_details(self, pdf, invoice_data):
        """Add invoice date and due date"""
        pdf.ln(10)
        pdf.set_font(self.font_family, 'B', 10)
        
        pdf.cell(40, 6, 'Invoice Date:', 0, 0)
        pdf.set_font(self.font_family, '', 10)
        pdf.cell(40, 6, invoice_data['issue_date'], 0, 1)
        
        if invoice_data.get('due_date'):
            pdf.set_font(self.font_family, 'B', 10)
            pdf.cell(40, 6, 'Due Date:', 0, 0)
            pdf.set_font(self.font_family, '', 10)
            pdf.cell(40, 6, invoice_data['due_date'], 0, 1)
    
    def _add_items_table(self, pdf, items):
        """Add items table"""
        pdf.ln(10)
        
        # Table header
        pdf.set_font(self.font_family, 'B', 10)
        pdf.cell(80, 10, 'Description', 1, 0, 'C')
        pdf.cell(30, 10, 'Quantity', 1, 0, 'C')
        pdf.cell(30, 10, 'Rate', 1, 0, 'C')
        pdf.cell(30, 10, 'Total', 1, 1, 'C')
        
        # Table rows
        pdf.set_font(self.font_family, '', 9)
        for item in items:
            pdf.cell(80, 8, item['description'][:35], 1, 0)
            pdf.cell(30, 8, str(item['quantity']), 1, 0, 'C')
            pdf.cell(30, 8, f"${item['rate']:.2f}", 1, 0, 'R')
            pdf.cell(30, 8, f"${item['total']:.2f}", 1, 1, 'R')
    
    def _add_totals_section(self, pdf, invoice_data):
        """Add totals section"""
        pdf.ln(5)
        pdf.set_font(self.font_family, 'B', 10)
        
        # Subtotal
        pdf.cell(140, 8, 'Subtotal:', 0, 0, 'R')
        pdf.cell(30, 8, f"${invoice_data.get('subtotal', 0):.2f}", 0, 1, 'R')
        
        # Discount
        if invoice_data.get('discount_amount', 0) > 0:
            pdf.cell(140, 8, f"Discount ({invoice_data.get('discount_rate', 0)}%):", 0, 0, 'R')
            pdf.cell(30, 8, f"-${invoice_data['discount_amount']:.2f}", 0, 1, 'R')
        
        # Tax
        if invoice_data.get('tax_amount', 0) > 0:
            pdf.cell(140, 8, f"Tax ({invoice_data.get('tax_rate', 0)}%):", 0, 0, 'R')
            pdf.cell(30, 8, f"${invoice_data['tax_amount']:.2f}", 0, 1, 'R')
        
        # Total
        pdf.cell(140, 8, 'Total Amount:', 0, 0, 'R')
        pdf.cell(30, 8, f"${invoice_data.get('total_amount', 0):.2f}", 1, 1, 'R')
    
    def _add_notes_section(self, pdf, invoice_data):
        """Add notes and terms"""
        if invoice_data.get('notes'):
            pdf.ln(10)
            pdf.set_font(self.font_family, 'B', 10)
            pdf.cell(0, 6, 'Notes:', 0, 1)
            pdf.set_font(self.font_family, '', 9)
            pdf.multi_cell(0, 5, invoice_data['notes'])
        
        if invoice_data.get('terms'):
            pdf.ln(5)
            pdf.set_font(self.font_family, 'B', 10)
            pdf.cell(0, 6, 'Terms & Conditions:', 0, 1)
            pdf.set_font(self.font_family, '', 9)
            pdf.multi_cell(0, 5, invoice_data['terms'])