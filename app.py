from .core.server_routes import defaultRoutes


if __name__ == '__main__':
    # app.run(debug=True)
    defaultRoutes.app.run(ssl_context=('c38827a1bd357111.pem', 'promarkresearch.com.key'))  # this is required to run the proxy
