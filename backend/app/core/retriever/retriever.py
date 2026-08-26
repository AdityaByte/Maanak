from typing import List, Dict, Any, Optional, Callable, Tuple
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Filter,
    FieldCondition,
    MatchValue,
    Prefetch,
    FusionQuery,
    Fusion,
    SparseVector,
)
from app.core.retriever.query_router import QueryRouter

class HybridRetriever:
    """RAG Retriever: Fetches the sementic correct document from the vector db which exactly matches
    the query."""

    def __init__(
        self,
        client: QdrantClient,
        collection_name: str,
        embed_fn: Callable[[str], list[float]],
        sparse_embed_fn: Callable[[str], tuple[list[int], list[float]]] | None = None,
        router: QueryRouter | None = None,
    ):
        self.client = client
        self.collection_name = collection_name
        self.embed_fn = embed_fn
        self.sparse_embed_fn = sparse_embed_fn
        self.use_hybrid = sparse_embed_fn is not None
        self.router = router or QueryRouter()

    def retrieve(self, query: str, top_k: int = 5) -> list[dict[str, any]]:
        route = self.router.route(query) # Selecting a correct route.

        if route.mode == "exact_id":
            # If it matches to the exact id then we need to do the exact lookup.
            return self._exact_lookup(route.exact_id, top_k)

        # Else we need to do the hybrid search.
        return self._hybrid_search(query, route.filters, top_k)
        # return self._hybrid_search(query, {}, top_k)

    def retrieve_by_id(self, standard_id: str) -> list[dict[str, any]]:
        """Direct lookup, bypassing the router. Used for reference-following."""
        return self._exact_lookup(standard_id, limit=1)

    def _exact_lookup(self, standard_id: str, limit: int) -> list[dict[str, any]]:
        points, _ = self.client.scroll(
            collection_name=self.collection_name,
            scroll_filter=Filter(
                must=[FieldCondition(key="standard_number", match=MatchValue(value=standard_id))]
            ),
            limit=limit,
        )
        return [self._format(p.payload, score=1.0) for p in points]

    def _hybrid_search(self, query: str, filters: dict[str, any], top_k: int) -> list[dict[str, any]]:
        qdrant_filter = None
        if filters:
            qdrant_filter = Filter(
                must=[FieldCondition(key=k, match=MatchValue(value=v)) for k, v in filters.items()]
            )

        # Converting the query text to vector for semantic search.
        dense_vector = self.embed_fn(query)

        if self.use_hybrid:
            indices, values = self.sparse_embed_fn(query)
            result = self.client.query_points(
                collection_name=self.collection_name,
                prefetch=[
                    Prefetch(query=dense_vector, using="dense", filter=qdrant_filter, limit=20),
                    Prefetch(
                        query=SparseVector(indices=indices, values=values),
                        using="sparse",
                        filter=qdrant_filter,
                        limit=20,
                    ),
                ],
                query=FusionQuery(fusion=Fusion.RRF),
                limit=top_k,
            )
        else:
            result = self.client.query_points(
                collection_name=self.collection_name,
                query=dense_vector,
                using="dense",
                query_filter=qdrant_filter,
                limit=top_k,
            )

        return [self._format(p.payload, score=p.score) for p in result.points]

    @staticmethod
    def _format(payload: dict[str, any], score: float) -> dict[str, any]:
        payload = dict(payload)
        content = payload.pop("page_content", "")
        return {"page_content": content, "metadata": payload, "score": score}