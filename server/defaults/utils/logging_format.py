import logging
from colorama import Fore, Style, init

init(autoreset=True)


class CustomFormatter(logging.Formatter):
    grey = Fore.BLACK + Style.DIM
    green = Fore.GREEN
    yellow = Fore.YELLOW
    red = Fore.RED + Style.BRIGHT
    dark_red = Fore.RED
    blue = Fore.BLUE
    reset = Style.RESET_ALL
    format = "%(asctime)s - %(name)s - %(levelname)s - %(filename)s - Line: %(lineno)d - %(message)s"

    FORMATS = {
        logging.DEBUG: green + format + reset,
        logging.INFO: blue + format + reset,
        logging.WARNING: yellow + format + reset,
        logging.ERROR: red + format + reset,
        logging.CRITICAL: dark_red + format + reset
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)