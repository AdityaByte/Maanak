import fitz  # PyMuPDF
import cv2
import re
import numpy as np
import pytesseract
from typing import Dict, Any, Union, List, Optional
from app.schema.vendor import VendorDocumentSchema


class VendorExtractor:
    def __init__(self, tesseract_cmd: Optional[str] = None):
        if tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Applies OpenCV transformations to enhance text for OCR."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        return thresh

    def _convert_input_to_images(self, source: Union[str, np.ndarray]) -> List[np.ndarray]:
        """Converts input (Image path, PDF path, or NumPy array) into OpenCV BGR images."""
        if isinstance(source, np.ndarray):
            return [source]

        
        if isinstance(source, str) and source.lower().endswith(".pdf"):
            images = []
            doc = fitz.open(source)
            for page in doc:
                pix = page.get_pixmap()
                img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape(
                    pix.height, pix.width, pix.n
                )
                if pix.n == 4:
                    img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2BGR)
                elif pix.n == 3:
                    img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
                images.append(img_array)
            doc.close()
            return images

        
        if isinstance(source, str):
            img = cv2.imread(source)
            if img is None:
                raise ValueError(f"Unable to read image at path: {source}")
            return [img]

        raise TypeError("Input must be a file path string or a numpy ndarray")

    def extract_information(self, file_path_or_img: Union[str, np.ndarray]) -> Dict[str, Any]:
        """Extracts vendor document details from an image or PDF and returns a Python dict."""
        images = self._convert_input_to_images(file_path_or_img)
        full_text = ""

        for img in images:
            processed = self.preprocess_image(img)
            full_text += pytesseract.image_to_string(processed) + "\n"

        
        invoice_no = re.search(r"(?i)(?:invoice\s*(?:no|num|#)?[\s:]*)([A-Z0-9-]+)", full_text)
        date_match = re.search(r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\w+\s+\d{1,2},\s+\d{4})\b", full_text)
        total_match = re.search(r"(?i)(?:total|amount due)[\s:$]*([\d,]+\.\d{2})", full_text)
        tax_match = re.search(r"(?i)(?:tax|vat|gst)[\s:$]*([\d,]+\.\d{2})", full_text)

        extracted_data = {
            "vendor_name": full_text.splitlines()[0] if full_text.strip() else None,
            "invoice_number": invoice_no.group(1) if invoice_no else None,
            "invoice_date": date_match.group(1) if date_match else None,
            "total_amount": float(total_match.group(1).replace(",", "")) if total_match else None,
            "tax_amount": float(tax_match.group(1).replace(",", "")) if tax_match else None,
            "line_items": [],
        }

        
        validated_schema = VendorDocumentSchema(**extracted_data)
        return validated_schema.model_dump()