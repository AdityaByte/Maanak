from pydantic import BaseModel, Field
from typing import List, Optional

class LineItem(BaseModel):
    description: Optional[str] = Field(None, description="Item or service description")
    quantity: Optional[float] = Field(None, description="Item quantity")
    unit_price: Optional[float] = Field(None, description="Price per item unit")
    total: Optional[float] = Field(None, description="Total amount for the line item")

class VendorDocumentSchema(BaseModel):
    vendor_name: Optional[str] = Field(None, description="Name of the vendor")
    vendor_address: Optional[str] = Field(None, description="Vendor physical address")
    tax_id: Optional[str] = Field(None, description="Vendor Tax ID / VAT / GSTIN")
    
    invoice_number: Optional[str] = Field(None, description="Invoice or reference number")
    invoice_date: Optional[str] = Field(None, description="Date of document creation")
    due_date: Optional[str] = Field(None, description="Payment due date")
    
    line_items: List[LineItem] = Field(default_factory=list)
    
    subtotal: Optional[float] = Field(None, description="Subtotal before tax")
    tax_amount: Optional[float] = Field(None, description="Calculated tax amount")
    total_amount: Optional[float] = Field(None, description="Final total payable amount")