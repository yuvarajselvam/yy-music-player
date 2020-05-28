import logging

# noinspection PyArgumentList
logging.basicConfig(format='[{levelname:^8s}] - {name} - {message}', style='{', level=logging.ERROR)


class Logger:
    def __init__(self, module_name, level=logging.DEBUG):
        self.logger = logging.getLogger(module_name)
        self.logger.setLevel(level)
