"""
response
========
Response schema package for LLM #26 (BIS document extraction).

Usage:
    from response import BISResponseSchema
"""

from .bis_schema import (
    BISResponseSchema,
    BISScheme,
    DocumentStatus,
    ProductDetails,
    VendorDetails,
)

__all__ = [
    "BISResponseSchema",
    "BISScheme",
    "DocumentStatus",
    "ProductDetails",
    "VendorDetails",
]