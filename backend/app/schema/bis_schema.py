from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

# Date formats.
_DATE_FORMATS = (
    "%Y-%m-%d",   # ISO
    "%d-%m-%Y",   # 12-05-2023
    "%d/%m/%Y",   # 12/05/2023
    "%d.%m.%Y",   # 12.05.2023
    "%d %b %Y",   # 12 May 2023
    "%d %B %Y",   # 12 May 2023
)


def _parse_flexible_date(value):
    """Parsing the dates from the value."""
    if value in (None, "", "NA", "N/A"):
        return None
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        text = value.strip()
        for fmt in _DATE_FORMATS:
            try:
                return datetime.strptime(text, fmt).date()
            except ValueError:
                continue
        raise ValueError(f"Unrecognized date format: {value!r}")
    return value


class BISScheme(str, Enum):
    """BIS certification scheme the document was issued under."""

    ISI = "ISI"          # Voluntary product certification (license: CM/L-XXXXXXX)
    CRS = "CRS"           # Compulsory Registration Scheme (registration: R-XXXXXXXX)
    UNKNOWN = "UNKNOWN"


class DocumentStatus(str, Enum):
    """Fine-grained reason behind is_valid_document, for downstream triage."""

    VALID = "valid"
    INVALID_NOT_BIS = "invalid_not_bis"
    INVALID_ILLEGIBLE = "invalid_illegible"
    INVALID_EXPIRED = "invalid_expired"
    INVALID_INCOMPLETE = "invalid_incomplete"


class VendorDetails(BaseModel):
    """Manufacturer / vendor details. All fields optional so extraction
    never has to fabricate data for an invalid or unrelated document."""

    model_config = ConfigDict(extra="forbid")

    manufacturer_name: str | None = Field(
        default=None, description="Name of the manufacturing unit/vendor."
    )
    factory_address: str | None = Field(
        default=None, description="Physical address of the manufacturing facility."
    )
    country: str | None = Field(
        default=None, description="Country of origin/manufacture."
    )


class ProductDetails(BaseModel):
    """Product details covered under the license/certificate. All fields
    optional for the same reason as VendorDetails."""

    model_config = ConfigDict(extra="forbid")

    product_name: str | None = Field(
        default=None, description="Name or description of the product/equipment."
    )
    model_number: str | None = Field(
        default=None, description="Model or type designation of the product."
    )
    brand: str | None = Field(
        default=None, description="Brand name under which the product is sold."
    )
    standard_number: str | None = Field(
        default=None,
        description="Applicable Indian Standard number, e.g., IS 13252 (Part 1):2010.",
    )


class BISResponseSchema(BaseModel):
    """Top-level structured response for a single BIS document extraction."""

    model_config = ConfigDict(extra="forbid")

    is_valid_document: bool = Field(
        description="Indicates whether the document is a valid BIS certificate/document."
    )
    document_status: DocumentStatus = Field(
        default=DocumentStatus.VALID,
        description=(
            "Fine-grained status explaining the validity decision "
            "(e.g. not a BIS document, expired, illegible, incomplete)."
        ),
    )
    scheme_type: BISScheme = Field(
        default=BISScheme.UNKNOWN,
        description="BIS scheme under which the document was issued: ISI mark licensing or CRS registration.",
    )
    registration_number: str | None = Field(
        default=None,
        description="BIS Registration/License Number (e.g., R-XXXXXXXX for CRS or CM/L-XXXXXXX for ISI).",
    )
    vendor: VendorDetails = Field(
        default_factory=VendorDetails,
        description="Details regarding the manufacturer or vendor.",
    )
    product: ProductDetails = Field(
        default_factory=ProductDetails,
        description="Details regarding the product specified in the document.",
    )
    issue_date: date | None = Field(
        default=None, description="Date of issuance of the BIS license/certificate."
    )
    valid_upto: date | None = Field(
        default=None, description="Expiration/validity date of the certificate."
    )
    reasoning: str = Field(
        default="",
        description=(
            "Brief chain-of-thought style justification for the validity decision, "
            "written before extracting the summary. Improves extraction quality."
        ),
    )
    extracted_text_summary: str = Field(
        description="Brief summary of key information extracted from the document."
    )
    confidence_score: float = Field(
        ge=0.0,
        le=1.0,
        description="LLM confidence score regarding accuracy of extracted data (0.0 to 1.0).",
    )

    # Validators.

    @field_validator("issue_date", "valid_upto", mode="before")
    @classmethod
    def _flexible_dates(cls, v):
        return _parse_flexible_date(v)

    @field_validator("registration_number")
    @classmethod
    def _normalize_registration_number(cls, v):
        return v.strip().upper() if v else v

    @model_validator(mode="after")
    def _cross_field_checks(self):
        # If the LLM says the document is invalid but didn't set a reason,
        # default it to "not a BIS document" rather than leaving it VALID.
        if not self.is_valid_document and self.document_status == DocumentStatus.VALID:
            self.document_status = DocumentStatus.INVALID_NOT_BIS

        # Flag an internally inconsistent date range rather than raising,
        # since we still want the (likely OCR-noisy) record to come through.
        if self.issue_date and self.valid_upto and self.valid_upto < self.issue_date:
            self.document_status = DocumentStatus.INVALID_INCOMPLETE

        return self