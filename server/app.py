from defaults.core.server_routes import defaultRoutes

if __name__ == '__main__':
    defaultRoutes.app.run(debug=True)
    # defaultRoutes.app.run(ssl_context=('b27662e91187c7e3.crt', 'promarkresearch.com.key'))
