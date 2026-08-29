from pathlib import Path
from typing import Union, List, BinaryIO
from app.schema.bis_schema import BISResponseSchema


class BISDocumentExtractor:
    """
    Document Extractor for processing BIS Certificates & Documents (PDF or Images)
    and validating them against app.schema.bis_schema.BISResponseSchema.
    """

    def __init__(self):
        # Initialize OCR models, PDF libraries, or LLM vision/text parsers here
        pass

    def extract(
        self, document: Union[str, Path, bytes, BinaryIO]
    ) -> Union[BISResponseSchema, List[BISResponseSchema]]:
        """
        Extracts BIS document metadata from a PDF or Image and returns a validated schema instance.

        :param document: File path, byte buffer, or file stream.
        :return: Validated BISResponseSchema instance or list of BISResponseSchema instances.
        """
        # 1. Extract raw content from PDF / Image
        raw_text = self._extract_content(document)

        # 2. Parse text into structured fields matching BISResponseSchema dictionary structure
        extracted_dict = self._parse_fields(raw_text)

        # 3. Validate and build model using Pydantic
        return self._validate_and_build(extracted_dict)

    def _extract_content(self, document: Union[str, Path, bytes, BinaryIO]) -> str:
        # TODO: Add PDF reading (pdfplumber/pypdf) or Image OCR (Tesseract / EasyOCR / Vision LLM)
        return ""

    def _parse_fields(self, raw_text: str) -> dict:
        # Dummy structure for illustration; populate this with actual OCR/LLM logic
        return {
            "is_valid_document": True,
            "document_status": "valid",
            "scheme_type": "CRS",
            "registration_number": "R-12345678",
            "vendor": {
                "manufacturer_name": "Example Corp Ltd",
                "factory_address": "Industrial Area, New Delhi",
                "country": "India"
            },
            "product": {
                "product_name": "Power Adapter",
                "model_number": "PA-65W",
                "brand": "TechBrand",
                "standard_number": "IS 13252 (Part 1):2010"
            },
            "issue_date": "12-05-2023",
            "valid_upto": "11-05-2026",
            "reasoning": "Document contains valid CRS registration number, standard number, and active dates.",
            "extracted_text_summary": "BIS CRS certificate for Power Adapter under IS 13252 (Part 1):2010.",
            "confidence_score": 0.95
        }

    def _validate_and_build(
        self, data: Union[dict, List[dict]]
    ) -> Union[BISResponseSchema, List[BISResponseSchema]]:
        if isinstance(data, list):
            return [BISResponseSchema.model_validate(item) for item in data]
        return BISResponseSchema.model_validate(data)