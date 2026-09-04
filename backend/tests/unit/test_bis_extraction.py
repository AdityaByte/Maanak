import io
import pytest
from unittest.mock import patch

from app.extractor.bis_extractor import BISDocumentExtractor
from app.schema.bis_schema import BISResponseSchema, DocumentStatus, BISScheme


@pytest.fixture
def extractor():
    return BISDocumentExtractor()


def test_extract_valid_crs_document(extractor):
    mock_text = """
    Bureau of Indian Standards
    Registration No: R-12345678
    Standard: IS 13252 (Part 1):2010
    Valid Upto: 11-05-2026 Issue Date: 12-05-2023
    """
    with patch.object(extractor, "_extract_content", return_value=mock_text):
        result = extractor.extract("dummy_path.pdf")

    assert isinstance(result, BISResponseSchema)
    assert result.is_valid_document is True
    assert result.document_status == DocumentStatus.VALID
    assert result.scheme_type == BISScheme.CRS
    assert result.registration_number == "R-12345678"
    assert str(result.issue_date) == "2023-05-12"
    assert str(result.valid_upto) == "2026-05-11"


def test_registration_number_casing_normalization(extractor):
    mock_text = "BIS Registration: r-87654321 IS 13252:2010 10-10-2023 10-10-2025"
    with patch.object(extractor, "_extract_content", return_value=mock_text):
        result = extractor.extract(b"dummy bytes")

    assert result.registration_number == "R-87654321"


@pytest.mark.parametrize(
    "date_str,expected_iso",
    [
        ("12-05-2023", "2023-05-12"),
        ("12/05/2023", "2023-05-12"),
        ("12.05.2023", "2023-05-12"),
        ("12 May 2023", "2023-05-12"),
        ("2023-05-12", "2023-05-12"),
    ],
)
def test_flexible_date_formats(extractor, date_str, expected_iso):
    raw_data = {
        "is_valid_document": True,
        "document_status": "valid",
        "scheme_type": "CRS",
        "registration_number": "R-12345678",
        "issue_date": date_str,
        "valid_upto": "2028-01-01",
        "extracted_text_summary": "Test summary",
        "confidence_score": 0.9,
    }
    res = extractor._validate_and_build(raw_data)
    assert str(res.issue_date) == expected_iso


def test_invalid_date_range_triggers_incomplete_status(extractor):
    raw_data = {
        "is_valid_document": True,
        "document_status": "valid",
        "scheme_type": "CRS",
        "registration_number": "R-12345678",
        "issue_date": "12-05-2025",
        "valid_upto": "12-05-2022",
        "extracted_text_summary": "Test summary",
        "confidence_score": 0.9,
    }
    result = extractor._validate_and_build(raw_data)
    assert result.document_status == DocumentStatus.INVALID_INCOMPLETE


def test_invalid_document_flag_overrides_valid_status(extractor):
    raw_data = {
        "is_valid_document": False,
        "document_status": "valid",
        "extracted_text_summary": "Non-BIS document",
        "confidence_score": 0.1,
    }
    result = extractor._validate_and_build(raw_data)
    assert result.document_status == DocumentStatus.INVALID_NOT_BIS


def test_non_bis_document_extraction(extractor):
    mock_text = "Random invoice content without any standard numbers or registration."
    with patch.object(extractor, "_extract_content", return_value=mock_text):
        result = extractor.extract("invoice.pdf")

    assert result.is_valid_document is False
    assert result.document_status == DocumentStatus.INVALID_NOT_BIS


def test_extract_accepts_bytes_io_stream(extractor):
    bytes_stream = io.BytesIO(b"%PDF-1.4 dummy content")
    with patch.object(extractor, "_extract_content", return_value="Bureau of Indian Standards R-11223344"):
        result = extractor.extract(bytes_stream)

    assert result.registration_number == "R-11223344"


def test_unsupported_file_raises_error(extractor):
    with patch.object(extractor, "_extract_content", side_effect=ValueError("Could not extract content")):
        with pytest.raises(ValueError, match="Could not extract content"):
            extractor.extract(b"corrupted bytes")


def test_validate_and_build_batch_list(extractor):
    records = [
        {
            "is_valid_document": True,
            "document_status": "valid",
            "registration_number": "R-11111111",
            "extracted_text_summary": "Doc 1",
            "confidence_score": 0.95,
        },
        {
            "is_valid_document": False,
            "document_status": "invalid_not_bis",
            "extracted_text_summary": "Doc 2",
            "confidence_score": 0.2,
        },
    ]
    results = extractor._validate_and_build(records)
    assert isinstance(results, list)
    assert len(results) == 2
    assert results[0].registration_number == "R-11111111"
    assert results[1].is_valid_document is False