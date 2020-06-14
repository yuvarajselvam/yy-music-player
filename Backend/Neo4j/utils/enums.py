from enum import Enum


class AccountType(Enum):
    GOOGLE = 'GOOGLE'
    FACEBOOK = 'FACEBOOK'


class DeviceOs(Enum):
    ANDROID = 'ANDROID'
    IOS = 'IOS'


class Scope(Enum):
    PRIVATE = 'PRIVATE'
    PUBLIC = 'PUBLIC'


class PlaylistType(Enum):
    GROUP = 'GROUP'
    USER = 'USER'
    SYSTEM = 'SYSTEM'
