import io
import re
from pathlib import Path
from typing import BinaryIO, List, Union

from PIL import Image
import pypdf
import pytesseract

from app.schema.bis_schema import BISResponseSchema


class BISDocumentExtractor:
    """Document Extractor for processing BIS Certificates & Documents (PDF or Images)

    and validating them against app.schema.bis_schema.BISResponseSchema.
    """

    def __init__(self, llm_client=None):
        # Pass an optional LLM client (e.g. OpenAI/Gemini/Anthropic) if available
        self.llm_client = llm_client

    def extract(
        self, document: Union[str, Path, bytes, BinaryIO]
    ) -> Union[BISResponseSchema, List[BISResponseSchema]]:
        """Extracts BIS document metadata from a PDF or Image and returns a validated schema instance."""
        # 1. Extract raw text from PDF or Image
        raw_text = self._extract_content(document)

        # 2. Parse text into structured schema data
        if self.llm_client:
            extracted_dict = self._parse_fields_with_llm(raw_text)
        else:
            extracted_dict = self._parse_fields_with_regex(raw_text)

        # 3. Validate and build Pydantic model
        return self._validate_and_build(extracted_dict)

    def _extract_content(self, document: Union[str, Path, bytes, BinaryIO]) -> str:
        """Extracts text from PDF files or images using pypdf and pytesseract."""
        # Normalize input into bytes stream
        if isinstance(document, (str, Path)):
            with open(document, "rb") as f:
                content = f.read()
        elif isinstance(document, io.BufferedIOBase) or hasattr(document, "read"):
            content = document.read()
        else:
            content = document

        # Try parsing as PDF first
        try:
            pdf_reader = pypdf.PdfReader(io.BytesIO(content))
            extracted_text = ""
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
            if extracted_text.strip():
                return extracted_text.strip()
        except Exception:
            pass  # Not a valid PDF or scanned PDF without embedded text

        # Fallback to OCR for images or scanned PDFs
        try:
            image = Image.open(io.BytesIO(content))
            return pytesseract.image_to_string(image)
        except Exception as e:
            raise ValueError(f"Could not extract content from document: {str(e)}")

    def _parse_fields_with_llm(self, raw_text: str) -> dict:
        """Uses LLM structured outputs to parse raw OCR/PDF text cleanly."""
        # Example prompt structure if integrating with an LLM client
        prompt = f"""
        Extract BIS Certificate details from the text below.
        Return data conforming strictly to the requested schema.

        Text:
        {raw_text}
        """
        # Call your preferred LLM provider here (e.g. client.beta.chat.completions.parse)
        # response = self.llm_client.parse(prompt, response_format=BISResponseSchema)
        # return response.model_dump()
        pass

    def _parse_fields_with_regex(self, raw_text: str) -> dict:
        """Rule-based pattern matching fallback when no LLM is configured."""
        is_bis = bool(re.search(r"bureau of indian standards|bis|is\s*\d+", raw_text, re.IGNORECASE))
        
        # Regex patterns for key identifiers
        reg_match = re.search(r"\b(R-\d{8}|CM/L-\d{7})\b", raw_text, re.IGNORECASE)
        std_match = re.search(r"\bIS\s*\d+(?:\s*\([Part\s\d]+\))?:\d{4}\b", raw_text, re.IGNORECASE)
        date_matches = re.findall(r"\b\d{2}[-/\.]\d{2}[-/\.]\d{4}\b", raw_text)

        return {
            "is_valid_document": is_bis,
            "document_status": "valid" if is_bis else "invalid_not_bis",
            "scheme_type": "CRS" if reg_match and reg_match.group(0).startswith("R-") else "ISI",
            "registration_number": reg_match.group(0) if reg_match else None,
            "vendor": {
                "manufacturer_name": None,
                "factory_address": None,
                "country": "India",
            },
            "product": {
                "product_name": None,
                "model_number": None,
                "brand": None,
                "standard_number": std_match.group(0) if std_match else None,
            },
            "issue_date": date_matches[0] if len(date_matches) > 0 else None,
            "valid_upto": date_matches[1] if len(date_matches) > 1 else None,
            "reasoning": "Extracted using regex matching rules.",
            "extracted_text_summary": raw_text[:300],
            "confidence_score": 0.85 if is_bis and reg_match else 0.30,
        }

    def _validate_and_build(
        self, data: Union[dict, List[dict]]
    ) -> Union[BISResponseSchema, List[BISResponseSchema]]:
        if isinstance(data, list):
            return [BISResponseSchema.model_validate(item) for item in data]
        return BISResponseSchema.model_validate(data)