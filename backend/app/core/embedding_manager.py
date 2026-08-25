import numpy as np
from sentence_transformers import SentenceTransformer
import logging

logger = logging.getLogger(__name__)

class EmbeddingManager:
    """This class mainly converts the text datatype to vector."""

    def __init__(self, model_name: str = "all-MiniLM-L6-v2") -> None:
        self.model_name = model_name
        self.model = None
        self._load_model()

    def _load_model(self):
        """Loads the sentence-tranformer model."""
        try:
            logger.info(f"Loading the embedding model {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            logger.info(f"Model loaded successfully. Embedding Dimesion: {self.model.get_embedding_dimension()}")
        except Exception as e:
            logger.error(f"Failed to load model {self.model_name}: {e}")
            raise

    def generate_embeddings(self, texts: list[str]) ->np.ndarray:
        """Generates embedding for the page_content."""
        if not self.model:
            raise ValueError(f"Model not loaded {self.model_name}")

        logger.info(f"Generating embeddings for {len(texts)}")
        embeddings = self.model.encode(texts, show_progress_bar=True)
        logger.info(f"Embeddings generated successfully with shape: {embeddings.shape}")
        return embeddings

    def get_embeddings_dimesion(self) -> int:
        "Returns embeddings dimesion."
        if not self.model:
            raise ValueError(f"Model not loaded {self.model_name}")
        return self.model.get_embedding_dimension()