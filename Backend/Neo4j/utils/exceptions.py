class NodeDoesNotExistError(Exception):
    def __init__(self, entity):
        self.message = f"{entity} node does not exist"
        super().__init__(self.message)


class AppLogicError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class SyncError(Exception):
    def __init__(self, message):
        self.message = f"Sync failed: {message}"
        super().__init__(self.message)