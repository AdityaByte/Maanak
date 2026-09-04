from pydantic import BaseModel, Field

class StandardResponse(BaseModel):
    """Response model for the standard schema."""
    id: str = Field(..., description="This field contains the bis standard id")
    title: str = Field(..., description="This field contains the title of the bis standard")
    content: str = Field(..., description="Actual description about te point.")
    category: str = Field(..., description="From which category it belongs to.")
    sub_category: str | None = Field(default=None, description="Sub-Category for the standard.")
    year_published: int | None = Field(default=None, description="Year in which the standard is published.")
    last_amended: int | None = Field(default=None, description="Year in which it is last ameneded.")
    certification_type: str | None = Field(default=None, description="Certificate type.")
    certificate_mandatory: bool | None = Field(default=None, description="Is the certificate is mandatory")