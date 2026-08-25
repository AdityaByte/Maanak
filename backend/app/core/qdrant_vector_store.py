from qdrant_client import QdrantClient
from qdrant_client.models import (
    VectorParams,
    SparseVectorParams,
    Distance,
    PointStruct,
    SparseVector,
    PayloadSchemaType,
)
from typing import Callable
import uuid
import logging

logger = logging.getLogger(__name__)

class QdrantVectorStore:

    def __init__(
            self,
            collection_name: str,
            dense_dim: int,
            embed_fn: Callable[[str], list[float]],
            url: str = "http://localhost:6333",
            api_key: str | None = None,
            sparse_embed_fn: Callable[[str], tuple[list[int], list[float]]] | None = None
    ):
        self.client = QdrantClient(url=url, api_key=api_key)
        self.collection_name = collection_name
        self.dense_dim = dense_dim
        self.embed_fn = embed_fn
        self.sparse_embed_fn = sparse_embed_fn
        self.use_hybrid = sparse_embed_fn is not None


    def create_collection(self, payload_index_fields: dict[str, PayloadSchemaType] | None = None, recreate: bool = False):
        """
        Create the collection if it doesn't exists.
        payload_index_fields: dict of {field_name: PayloadSchemaType} to index for fast filtering.
        recreate: if True, drops and recreates the collection even if it exists.
        """
        exists = self.client.collection_exists(self.collection_name)

        if exists and recreate:

            logger.info(f"Dropping the existed collection {self.collection_name} and recreating it.")
            # Dropping the existing collection and creating a new one.
            self.client.delete_collection(self.collection_name)

        if not exists:

            logger.info(f"Creating qdrant collection: {self.collection_name}...")
            # Then we need to create a new collection.
            vectors_config = {
                # we are using dense for semantic vector.
                "dense": VectorParams(
                    size=self.dense_dim,
                    distance=Distance.COSINE
                )
            }

            sparse_vectors_config = {
                "sparse": SparseVectorParams()
            } if self.use_hybrid else None


            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=vectors_config,
                # sparse_vectors_config=sparse_vectors_config # currently skipping it.
            )

            logger.info(f"Qdrant collection: {self.collection_name} has been created successfully.")

        # default payload schema safe to call it if not provided.
        default_fields = payload_index_fields or {
            "standard_number": PayloadSchemaType.KEYWORD,
            "category": PayloadSchemaType.KEYWORD,
            "subcategory": PayloadSchemaType.KEYWORD,
            "status": PayloadSchemaType.KEYWORD,
            "certification_mandatory": PayloadSchemaType.BOOL,
            "normative_references": PayloadSchemaType.KEYWORD,
            "keywords": PayloadSchemaType.KEYWORD,
            "year_published": PayloadSchemaType.INTEGER,
        }

        for field, schema_type in default_fields.items():
            try:
                self.client.create_payload_index(
                    collection_name=self.collection_name,
                    field_name=field,
                    field_schema=schema_type
                )
            except Exception:
                # index may already exists.
                # skipping expection.
                pass

    def add_documents(self, documents: list[dict[str, any]], batch_size:int = 64):
        """
        documents: list of dicts shaped like:
            {"page_content": "...", "metadata": {"id": "IS_8707", ...}}

        Uses metadata["id"] as the point ID if present (converted to a stable UUID),
        otherwise generates a random UUID.
        """

        logger.info(f"Adding documents to the collection {self.collection_name}")
        points: list[PointStruct] = []

        for doc in documents:
            text = doc.page_content
            metadata = doc.metadata

            dense_vector = self.embed_fn(text)

            vector_payload: dict[str, any] = {"dense": dense_vector}
            if self.use_hybrid:
                indices, values = self.sparse_embed_fn(text)
                vector_payload["sparse"] = SparseVector(indices=indices, values=values)

            point_id = self._get_point_id(metadata.get("id"))

            points.append(
                PointStruct(
                    id=point_id,
                    vector=vector_payload,
                    payload={**metadata, "page_content": text},
                )
            )

        # Once the point struct has been created we need to upsert in batches.
        for i in range(0, len(points), batch_size):
            batch = points[i: i+batch_size]
            self.client.upsert(collection_name=self.collection_name, points=batch)
            logger.info(f"Batch of {len(batch)} has been successfully upserted.")

        return {"upserted": len(points)}


    # Helper method


    @staticmethod
    def _get_point_id(raw_id: str | None) -> str:
        """
        Qdrant point IDs must be an unsigned int or a UUID.
        Converts a human-readable id (e.g. 'IS_8707') into a stable UUID
        so re-upserting the same document updates it instead of duplicating.
        """
        if raw_id is None:
            return str(uuid.uuid4())
        return str(uuid.uuid5(uuid.NAMESPACE_DNS, raw_id))