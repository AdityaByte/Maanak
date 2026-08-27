class LLMClient:
    """Interface for the LLM clients which ever client we are using in the future"""
    def complete(self, prompt: dict[str, any]) -> str:
        raise NotImplementedError