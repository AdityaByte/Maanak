from dataclasses import dataclass, field

@dataclass
class ContextBuilder:

    max_context_chars: int = 12_000

    include_metadata_fields: list[str] = field(
        default_factory=lambda: [
            "standard_number", "title", "category", "status",
        ]
    )

    dedupe: bool = True # Duplicate document.

    def build(self, documents: list[dict[str, any]]) -> str:

        # First we need to sort the documents by the score value the highest score should be at first end.
        docs = sorted(
            documents,
            key=lambda d: d.get("score", 0),
            reverse=True
        )

        # Removing the duplicates.
        if self.dedupe:
            docs = self._dedupe(docs)

        blocks: list[str] = []
        used_chars = 0

        # Add complete chunks until the context budget is reached.
        for doc in docs:
            block = self._format_block(doc)

            # Skipping the empty documents.
            if not block.strip():
                continue

            block_len = len(block)
            if used_chars + block_len > self.max_context_chars:
                break # Breaking out if the page_content length exceeds.

            blocks.append(block)
            used_chars += block_len

        # Using a delimeter for distinguishing the different chunks.
        return "\n\n---\n\n".join(blocks)


    @staticmethod
    def _dedupe(documents: list[dict[str, any]]) -> list[dict[str, any]]:
        """This method mainly removes the duplicate documents."""
        seen = set()
        deduped = []

        for doc in documents:
            metadata = doc.get("metadata", {})
            key = metadata.get("chunk_id")

            if key is None:
                standard_number = metadata.get("standard_number", "")
                content = doc.get("page_content", "").strip()
                key = (
                    standard_number,
                    content[:100],
                )

            if key is seen:
                continue

            seen.add(key)
            deduped.append(doc)

        return deduped

    def _format_block(self, doc: dict[str, any]) -> str:
        """Format one retrieved chunk with its metadata."""
        meta = doc.get("metadata", {})

        header_part = [
            f"{field}: {meta[field]}"
            for field in self.include_metadata_fields
            if meta.get(field) is not None
        ]

        header = " | ".join(header_part)
        content = doc.get("page_content", "").strip()

        if header:
            return f"[{header}]\n{content}"

        return content