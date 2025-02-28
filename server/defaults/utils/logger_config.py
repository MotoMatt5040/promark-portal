# logger_config.py
import logging
from logging.handlers import TimedRotatingFileHandler
from .logging_format import CustomFormatter
import os

# Set up the main logger
logger = logging.getLogger('log')

env = os.environ['environment']

# Root logger
if env == 'dev':
    logger.setLevel(logging.DEBUG)
elif env == 'prod':
    logger.setLevel(logging.INFO)

# Console handler
ch = logging.StreamHandler()
if env == 'dev':
    ch.setLevel(logging.DEBUG)
elif env == 'prod':
    ch.setLevel(logging.WARNING)
ch.setFormatter(CustomFormatter())
logger.addHandler(ch)

if not os.path.exists('logs'):
    os.mkdir('logs')

# File handler with monthly rotation
fh = TimedRotatingFileHandler('logs/logs.log', when='W0', interval=1, backupCount=3)
if env == 'dev':
    fh.setLevel(logging.WARNING)
elif env == 'prod':
    fh.setLevel(logging.INFO)
plain_formatter = logging.Formatter("%(asctime)s - %(name)s - %(filename)s - %(levelname)s - Line: %(lineno)d - %(message)s")
fh.setFormatter(plain_formatter)
logger.addHandler(fh)

logger.debug('Enabled')
logger.info('Enabled')
logger.warning('Enabled')
logger.error('Enabled')
logger.critical('Enabled')
