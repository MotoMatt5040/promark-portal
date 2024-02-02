class Permissions:
    def __init__(self, authorization_location: str = None, authorization_level: int = None):
        '''

        :param authorization_location: String for location
        :param authorization_level: String for level
        '''
        self._authorization_location = authorization_location
        self._authorization_level = authorization_level

    @property
    def authorization_location(self):
        return self._authorization_location

    @authorization_location.setter
    def authorization_location(self, location):
        self._authorization_location = location

    @property
    def authorization_level(self):
        return self._authorization_level

    @authorization_level.setter
    def authorization_level(self, level):
        self._authorization_level = level


if __name__ == '__main__':
    print("Class used to edit and maintain permission based on location and authorization level")