from dataclasses import dataclass, field
import re

@dataclass
class Route:
    """
        exact_id: Means the query contains the exact id.
        filtered_hybrid: The query has some keywords such as category by which we have to futher choose a document.
        hybrid: We simply needs to do sementic search.
    """
    mode: str  # Model could be this one - exact_id | filtered_hybrid | hybrid
    filters: dict[str, any] = field(default_factory=dict)
    exact_id: str | None = None


class QueryRouter:
    """This mainly decides which route we have to choose."""

    def __init__(self, known_categories: list[str] | None = None):
        # Known categories should be provided from scraping the dataset.
        self.known_categories = known_categories or [
            "Pesticides", "Cement", "Steel", "Electrical", "Food" # For now we are using this dummy one.
        ]


    def route(self, query: str) -> Route:
        # 1. Exact standard number -> identifier lookup, short-circuits everything
        id_match = re.search(r"IS[\s\-]?(\d{3,5})", query, re.IGNORECASE)
        if id_match:
            # If the id matches then we know the route we just need to return the route.
            return Route(mode="exact_id", exact_id=f"IS_{id_match.group(1)}")

        filters: dict[str, any] = {}

        # 2. Status signal
        if re.search(r"\bcurrent\b", query, re.IGNORECASE):
            filters["status"] = "current"
        elif re.search(r"\bwithdrawn\b|\bobsolete\b", query, re.IGNORECASE):
            filters["status"] = "withdrawn"

        # 3. Category signal
        for cat in self.known_categories:
            if cat.lower() in query.lower():
                filters["category"] = cat
                break

        mode = "filtered_hybrid" if filters else "hybrid"
        return Route(mode=mode, filters=filters)

